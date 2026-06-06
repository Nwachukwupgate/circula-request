import { useState } from 'react';
import {
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Calendar, RefreshCw, XCircle } from 'lucide-react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import {
  useGetSubscriptionStatusQuery,
  useCancelSubscriptionMutation,
} from 'api/apiSlice';
import { formatMoney, formatPlanLabel, getRegionDisplay } from 'utils/subscription';
import { toast } from 'react-toastify';

function SubscriptionManagement({ companyId, isCompanyAdmin }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [immediate, setImmediate] = useState(false);

  const { data, isLoading, refetch } = useGetSubscriptionStatusQuery(companyId, {
    skip: !companyId || !isCompanyAdmin,
  });

  const [cancelSubscription, { isLoading: cancelling }] = useCancelSubscriptionMutation();

  const subscription = data?.data;
  const billing = subscription?.billing;
  const regionLabel = getRegionDisplay(subscription);
  const isActive = subscription?.subscriptionStatus === 'active';
  const isLifetime = billing?.isLifetime || subscription?.billingType === 'lifetime';
  const isRecurring = billing?.recurring && !isLifetime;
  const cancelPending = billing?.cancelAtPeriodEnd;

  if (!isCompanyAdmin || !companyId) {
    return null;
  }

  if (isLoading) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <MDBox display="flex" justifyContent="center">
          <CircularProgress size={28} />
        </MDBox>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const handleCancel = async () => {
    try {
      const result = await cancelSubscription({
        companyId,
        reason: 'Cancelled by admin from profile',
        immediate,
      }).unwrap();
      toast.success(result.message);
      setCancelOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel subscription');
    }
  };

  const planAmount = subscription.pricing?.[subscription.subscriptionPlan]?.[subscription.billingCycle];

  return (
    <>
      <Card sx={{ p: 3, mb: 3 }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox>
            <MDTypography variant="h6" fontWeight="bold">
              Subscription & Billing
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {isLifetime
                ? 'Lifetime license — no recurring billing'
                : 'Manage your recurring Paystack subscription'}
            </MDTypography>
          </MDBox>
          <Chip
            label={isLifetime ? 'lifetime' : subscription.subscriptionStatus}
            color={isActive ? 'success' : 'default'}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        </MDBox>

        <MDBox display="flex" flexWrap="wrap" gap={3} mb={2}>
          <MDBox>
            <MDTypography variant="caption" color="text" display="block">
              Billing region
            </MDTypography>
            <MDTypography variant="button" fontWeight="medium">
              {regionLabel} ({subscription.currency})
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDTypography variant="caption" color="text" display="block">
              Current plan
            </MDTypography>
            <MDTypography variant="button" fontWeight="medium">
              {formatPlanLabel(subscription.subscriptionPlan)}
              {isLifetime ? ' · lifetime' : ` · ${subscription.billingCycle}`}
            </MDTypography>
          </MDBox>
          {planAmount != null && !isLifetime && (
            <MDBox>
              <MDTypography variant="caption" color="text" display="block">
                Price
              </MDTypography>
              <MDTypography variant="button" fontWeight="medium">
                {formatMoney(planAmount, subscription.currency)}
                /{subscription.billingCycle === 'yearly' ? 'year' : 'month'}
              </MDTypography>
            </MDBox>
          )}
          {isLifetime && billing?.lifetimePurchasedAt && (
            <MDBox>
              <MDTypography variant="caption" color="text" display="block">
                Licensed since
              </MDTypography>
              <MDTypography variant="button" fontWeight="medium">
                {new Date(billing.lifetimePurchasedAt).toLocaleDateString()}
              </MDTypography>
            </MDBox>
          )}
          {billing?.nextBillingDate && isActive && !isLifetime && (
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <Calendar size={14} />
              <MDBox>
                <MDTypography variant="caption" color="text" display="block">
                  {cancelPending ? 'Access until' : 'Next billing'}
                </MDTypography>
                <MDTypography variant="button" fontWeight="medium">
                  {new Date(billing.nextBillingDate).toLocaleDateString()}
                </MDTypography>
              </MDBox>
            </MDBox>
          )}
          {isRecurring && (
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <RefreshCw size={14} />
              <MDTypography variant="button" color="info">
                Auto-renewal on
              </MDTypography>
            </MDBox>
          )}
        </MDBox>

        {cancelPending && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Auto-renewal is cancelled. You can use the platform until{' '}
            {billing?.currentPeriodEnd
              ? new Date(billing.currentPeriodEnd).toLocaleDateString()
              : 'the end of your billing period'}
            .
          </Alert>
        )}

        {isActive && isRecurring && !cancelPending && (
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setCancelOpen(true)}
          >
            <MDBox component="span" display="inline-flex" alignItems="center" gap={0.5}>
              <XCircle size={16} />
              Cancel subscription
            </MDBox>
          </MDButton>
        )}

        {subscription.subscriptionStatus === 'trialing' && subscription.trial?.daysRemaining != null && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {subscription.trial.daysRemaining} day(s) left in your free trial.
          </Alert>
        )}
      </Card>

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel subscription</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2" color="text" mb={2}>
            You can stop auto-renewal at any time. By default you keep access until the end of the
            current billing period.
          </MDTypography>
          <FormControlLabel
            control={
              <Checkbox
                checked={immediate}
                onChange={(e) => setImmediate(e.target.checked)}
                color="error"
              />
            }
            label="End access immediately (revoke platform access now)"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MDButton variant="text" color="secondary" onClick={() => setCancelOpen(false)}>
            Keep subscription
          </MDButton>
          <MDButton
            variant="gradient"
            color="error"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling…' : immediate ? 'End now' : 'Cancel auto-renewal'}
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubscriptionManagement;
