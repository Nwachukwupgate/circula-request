import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Switch,
  Typography,
} from '@mui/material';
import { Check, X, CreditCard, LogOut, Lock, Clock, MapPin } from 'lucide-react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import {
  useGetSubscriptionStatusQuery,
  useChangeSubscriptionPlanMutation,
  useInitializeSubscriptionPaymentMutation,
  useVerifySubscriptionPaymentMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from 'api/apiSlice';
import { clearSubscriptionBlocked } from 'api/subscriptionSlice';
import { formatMoney, formatPlanLabel, getRegionDisplay } from 'utils/subscription';
import { openPaystackCheckout } from 'utils/paystack';
import { toast } from 'react-toastify';
import ContactSupportPanel from 'components/Support/ContactSupportPanel';

const LOGO_URL =
  'https://www.internalops.pro/_next/image?url=%2Fimages%2Flogo%2Flogo-transparent.jpg&w=256&q=75';

const THEME = {
  pageBg: '#f0f2f5',
  cardBg: '#ffffff',
  heading: '#344767',
  body: '#7b809a',
  primary: '#1A73E8',
  primaryLight: '#49a3f1',
  primarySoft: 'rgba(26, 115, 232, 0.1)',
  border: '#dee2e6',
  success: '#4CAF50',
  warningBg: '#fff8e1',
  warningText: '#f57c00',
};

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Perfect for small teams getting started',
    popular: false,
    features: [
      { text: 'Up to 15 users', active: true },
      { text: 'Core Request Management', active: true },
      { text: 'Circular Broadcasting', active: true },
      { text: '3 Departments', active: true },
      { text: 'Email Notifications', active: true },
      { text: 'KPI Management', active: false },
      { text: 'API Access', active: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'For growing organizations',
    popular: true,
    features: [
      { text: 'Up to 50 users', active: true },
      { text: 'Everything in Starter', active: true },
      { text: 'Unlimited Departments', active: true },
      { text: 'KPI & Performance Tracking', active: true },
      { text: 'Advanced Analytics', active: true },
      { text: 'Custom Approval Workflows', active: true },
      { text: 'API Access', active: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For large organizations with advanced needs',
    popular: false,
    features: [
      { text: 'Unlimited users', active: true },
      { text: 'Everything in Professional', active: true },
      { text: 'AI-Powered Insights', active: true },
      { text: 'Full API Access', active: true },
      { text: 'SSO / SAML Authentication', active: true },
      { text: 'Dedicated Account Manager', active: true },
      { text: '24/7 Priority Support', active: true },
    ],
  },
];

function FeatureRow({ text, active }) {
  return (
    <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.25}>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: 0.25,
          bgcolor: active ? THEME.primarySoft : 'rgba(123, 128, 154, 0.12)',
          color: active ? THEME.primary : THEME.body,
        }}
      >
        {active ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: active ? THEME.heading : THEME.body,
          fontWeight: active ? 500 : 400,
          lineHeight: 1.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function PlanCard({
  plan,
  amount,
  currency,
  billingCycle,
  isSelected,
  isCompanyAdmin,
  onSelect,
}) {
  const duration = billingCycle === 'lifetime' ? ' one-time' : billingCycle === 'yearly' ? '/year' : '/month';

  return (
    <Card
      elevation={0}
      onClick={() => isCompanyAdmin && onSelect(plan.id)}
      sx={{
        height: '100%',
        position: 'relative',
        cursor: isCompanyAdmin ? 'pointer' : 'default',
        bgcolor: THEME.cardBg,
        borderRadius: 3,
        border: '2px solid',
        borderColor: isSelected ? THEME.primary : THEME.border,
        boxShadow: isSelected
          ? '0 20px 40px rgba(26, 115, 232, 0.15)'
          : '0 4px 20px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.25s ease',
        overflow: 'visible',
        '&:hover': isCompanyAdmin
          ? { boxShadow: '0 12px 32px rgba(26, 115, 232, 0.12)', transform: 'translateY(-2px)' }
          : {},
      }}
    >
      {plan.popular && (
        <Box
          sx={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: THEME.primary,
            color: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(26, 115, 232, 0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          Most Popular
        </Box>
      )}

      <CardContent sx={{ p: 3, pt: plan.popular ? 3.5 : 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: THEME.heading, mb: 0.5 }}>
          {plan.name}
        </Typography>
        <Typography variant="body2" sx={{ color: THEME.body, mb: 2, minHeight: 40 }}>
          {plan.subtitle}
        </Typography>

        <Box sx={{ borderBottom: `1px solid ${THEME.border}`, pb: 2, mb: 2 }}>
          <Typography
            component="div"
            sx={{ color: THEME.heading, fontWeight: 700, fontSize: '2rem', lineHeight: 1.2 }}
          >
            {amount != null ? formatMoney(amount, currency) : '—'}
            <Typography
              component="span"
              sx={{ color: THEME.body, fontSize: '1rem', fontWeight: 500, ml: 0.5 }}
            >
              {duration}
            </Typography>
          </Typography>
        </Box>

        <Box mb={2}>
          {plan.features.map((feature) => (
            <FeatureRow key={feature.text} text={feature.text} active={feature.active} />
          ))}
        </Box>

        {isSelected && (
          <Chip
            label="Selected plan"
            size="small"
            sx={{
              bgcolor: THEME.primarySoft,
              color: THEME.primary,
              fontWeight: 600,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SubscriptionRenewalModal() {
  const dispatch = useDispatch();
  const { isBlocked, code, message, companyId, isCompanyAdmin, company } = useSelector(
    (state) => state.subscription
  );
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !isBlocked,
  });

  const resolvedCompanyId = companyId || company?.id;

  const { data: subscriptionResponse, isLoading: statusLoading } = useGetSubscriptionStatusQuery(
    resolvedCompanyId,
    { skip: !isBlocked || !resolvedCompanyId }
  );

  const subscriptionData = subscriptionResponse?.data;
  const pricing = subscriptionData?.pricing || {};
  const currency = subscriptionData?.currency || company?.currency || 'USD';
  const regionLabel = getRegionDisplay(subscriptionData);
  const lifetimeOfferEnabled = Boolean(
    subscriptionData?.lifetimeOfferEnabled || company?.lifetimeOfferEnabled
  );
  const lifetimePricing = subscriptionData?.lifetimePricing || {};

  const [selectedPlan, setSelectedPlan] = useState(
    company?.subscriptionPlan || subscriptionData?.subscriptionPlan || 'professional'
  );
  const [billingCycle, setBillingCycle] = useState(
    company?.billingCycle || subscriptionData?.billingCycle || 'monthly'
  );
  const [checkoutMode, setCheckoutMode] = useState('recurring');
  const [paying, setPaying] = useState(false);

  const [changePlan, { isLoading: changingPlan }] = useChangeSubscriptionPlanMutation();
  const [initializePayment] = useInitializeSubscriptionPaymentMutation();
  const [verifyPayment] = useVerifySubscriptionPaymentMutation();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (subscriptionData?.subscriptionPlan) {
      setSelectedPlan(subscriptionData.subscriptionPlan);
    }
    if (subscriptionData?.billingCycle) {
      setBillingCycle(subscriptionData.billingCycle);
    }
  }, [subscriptionData?.subscriptionPlan, subscriptionData?.billingCycle]);

  const headline = useMemo(() => {
    if (code === 'TRIAL_ENDED') return 'Your free trial has ended';
    if (code === 'SUBSCRIPTION_EXPIRED') return 'Renew your subscription';
    return 'Choose a plan to continue';
  }, [code]);

  const subheadline =
    message ||
    'Select a plan below to restore access. Billing is secure via Paystack and you can cancel anytime.';

  const selectedAmount =
    checkoutMode === 'lifetime'
      ? lifetimePricing[selectedPlan] ??
        subscriptionData?.lifetimeAmount ??
        company?.lifetimeAmount ??
        null
      : pricing[selectedPlan]?.[billingCycle];
  const isYearly = billingCycle === 'yearly';
  const isLifetimeCheckout = checkoutMode === 'lifetime';

  const handlePlanSelect = async (planId) => {
    if (!isCompanyAdmin || !resolvedCompanyId) {
      setSelectedPlan(planId);
      return;
    }
    setSelectedPlan(planId);
    try {
      await changePlan({
        companyId: resolvedCompanyId,
        plan: planId,
        billingCycle,
      }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update plan selection');
    }
  };

  const handleBillingToggle = async () => {
    const next = isYearly ? 'monthly' : 'yearly';
    setBillingCycle(next);
    if (isCompanyAdmin && resolvedCompanyId) {
      try {
        await changePlan({
          companyId: resolvedCompanyId,
          plan: selectedPlan,
          billingCycle: next,
        }).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to update billing cycle');
      }
    }
  };

  const handlePayWithPaystack = async () => {
    if (!resolvedCompanyId) {
      toast.error('Company account not found');
      return;
    }

    setPaying(true);
    try {
      const initResult = await initializePayment({
        companyId: resolvedCompanyId,
        billingType: isLifetimeCheckout ? 'lifetime' : 'recurring',
      }).unwrap();
      const paymentData = initResult.data;

      if (!paymentData?.publicKey) {
        toast.error('Payment provider is not configured. Contact support.');
        return;
      }

      const paidReference = await openPaystackCheckout({
        publicKey: paymentData.publicKey,
        email: paymentData.email || profile?.email,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference: paymentData.reference,
        accessCode: paymentData.accessCode,
      });

      const verifyResult = await verifyPayment({
        companyId: resolvedCompanyId,
        reference: paidReference,
      }).unwrap();

      if (verifyResult?.success) {
        toast.success(verifyResult.message || 'Subscription activated. Welcome back!');
        dispatch(clearSubscriptionBlocked());
        await refetchProfile();
      }
    } catch (err) {
      if (err?.message !== 'Payment cancelled') {
        toast.error(err?.data?.message || err?.message || 'Payment failed');
      }
    } finally {
      setPaying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearSubscriptionBlocked());
      window.location.href = '/authentication/sign-in';
    }
  };

  if (!isBlocked) {
    return null;
  }

  return (
    <Dialog
      open={isBlocked}
      fullScreen
      disableEscapeKeyDown
      PaperProps={{
        sx: { bgcolor: THEME.pageBg },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            component="img"
            src={LOGO_URL}
            alt="Internalops Pro"
            sx={{ height: 48, mb: 2, objectFit: 'contain' }}
          />

          <Chip
            icon={<Clock size={14} />}
            label={code === 'TRIAL_ENDED' ? 'Free trial expired' : 'Subscription required'}
            sx={{
              mb: 2,
              bgcolor: THEME.warningBg,
              color: THEME.warningText,
              fontWeight: 600,
              '& .MuiChip-icon': { color: THEME.warningText },
            }}
          />

          <Typography variant="h3" fontWeight="bold" sx={{ color: THEME.heading, mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            {headline}
          </Typography>
          <Typography variant="body1" sx={{ color: THEME.body, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
            {subheadline}
          </Typography>

          {company?.name && (
            <Chip
              label={company.name}
              sx={{
                mt: 2,
                bgcolor: THEME.primarySoft,
                color: THEME.primary,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {!isCompanyAdmin && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: '#e8f4fd',
              color: THEME.heading,
              '& .MuiAlert-icon': { color: THEME.primary },
            }}
          >
            Your company administrator must renew the subscription before you can access the
            platform. Please contact your admin or sign out and try again later.
          </Alert>
        )}

        {statusLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: THEME.primary }} />
          </Box>
        ) : (
          <>
            <Box textAlign="center" mb={1}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: THEME.heading }}>
                Simple, transparent pricing
              </Typography>
              <Typography variant="body2" sx={{ color: THEME.body, mt: 0.5 }}>
                Recurring billing via Paystack. Cancel anytime from your profile.
              </Typography>
              {regionLabel && (
                <Chip
                  icon={<MapPin size={14} />}
                  label={`Pricing shown for ${regionLabel}`}
                  sx={{
                    mt: 2,
                    bgcolor: THEME.primarySoft,
                    color: THEME.primary,
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: THEME.primary },
                  }}
                />
              )}
            </Box>

            {isCompanyAdmin && lifetimeOfferEnabled && (
              <Box display="flex" justifyContent="center" gap={1} mb={2}>
                <Chip
                  label="Monthly / Yearly"
                  onClick={() => setCheckoutMode('recurring')}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: checkoutMode === 'recurring' ? 700 : 500,
                    bgcolor: checkoutMode === 'recurring' ? THEME.primarySoft : 'transparent',
                    color: checkoutMode === 'recurring' ? THEME.primary : THEME.body,
                    border: `1px solid ${checkoutMode === 'recurring' ? THEME.primary : THEME.border}`,
                  }}
                />
                <Chip
                  label="Lifetime license"
                  onClick={() => setCheckoutMode('lifetime')}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: checkoutMode === 'lifetime' ? 700 : 500,
                    bgcolor: checkoutMode === 'lifetime' ? THEME.primarySoft : 'transparent',
                    color: checkoutMode === 'lifetime' ? THEME.primary : THEME.body,
                    border: `1px solid ${checkoutMode === 'lifetime' ? THEME.primary : THEME.border}`,
                  }}
                />
              </Box>
            )}

            {isCompanyAdmin && checkoutMode === 'recurring' && (
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} my={3}>
                <Typography
                  variant="button"
                  fontWeight={!isYearly ? 700 : 500}
                  sx={{ color: !isYearly ? THEME.primary : THEME.body }}
                >
                  Monthly
                </Typography>
                <Switch
                  checked={isYearly}
                  onChange={handleBillingToggle}
                  disabled={changingPlan}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: THEME.primary },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: THEME.primary,
                    },
                  }}
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="button"
                    fontWeight={isYearly ? 700 : 500}
                    sx={{ color: isYearly ? THEME.primary : THEME.body }}
                  >
                    Yearly
                  </Typography>
                  <Chip
                    label="Save 20%"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.12)',
                      color: THEME.success,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              </Box>
            )}

            <Grid container spacing={3} mb={4}>
              {PLANS.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <PlanCard
                    plan={plan}
                    amount={
                      checkoutMode === 'lifetime'
                        ? lifetimePricing[plan.id]
                        : pricing[plan.id]?.[billingCycle]
                    }
                    currency={currency}
                    billingCycle={checkoutMode === 'lifetime' ? 'lifetime' : billingCycle}
                    isSelected={selectedPlan === plan.id}
                    isCompanyAdmin={isCompanyAdmin}
                    onSelect={handlePlanSelect}
                  />
                </Grid>
              ))}
            </Grid>

            {isCompanyAdmin && (
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: THEME.cardBg,
                  border: `1px solid ${THEME.border}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <CreditCard size={20} color={THEME.primary} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: THEME.heading }}>
                    Complete your subscription
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: THEME.body, mb: 2, lineHeight: 1.7 }}>
                  {isLifetimeCheckout ? (
                    <>
                      You are purchasing a{' '}
                      <Box component="span" fontWeight="bold" sx={{ color: THEME.heading }}>
                        lifetime license
                      </Box>{' '}
                      for the{' '}
                      <Box component="span" fontWeight="bold" sx={{ color: THEME.heading }}>
                        {formatPlanLabel(selectedPlan)}
                      </Box>{' '}
                      plan for{' '}
                      <Box component="span" fontWeight="bold" sx={{ color: THEME.primary }}>
                        {selectedAmount != null ? formatMoney(selectedAmount, currency) : '—'}
                      </Box>
                      . This is a one-time payment with no recurring billing.
                    </>
                  ) : (
                    <>
                      You are subscribing to the{' '}
                      <Box component="span" fontWeight="bold" sx={{ color: THEME.heading }}>
                        {formatPlanLabel(selectedPlan)}
                      </Box>{' '}
                      plan ({billingCycle}) for{' '}
                      <Box component="span" fontWeight="bold" sx={{ color: THEME.primary }}>
                        {selectedAmount != null ? formatMoney(selectedAmount, currency) : '—'}
                      </Box>
                      . Paystack will renew automatically each billing cycle until you cancel.
                    </>
                  )}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                  <Lock size={14} color={THEME.body} />
                  <Typography variant="caption" sx={{ color: THEME.body }}>
                    Card, bank transfer, and mobile money supported via Paystack
                  </Typography>
                </Box>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handlePayWithPaystack}
                  disabled={paying || changingPlan || !resolvedCompanyId}
                  sx={{ py: 1.25, fontSize: '1rem' }}
                >
                  {paying
                    ? 'Processing payment…'
                    : isLifetimeCheckout
                      ? `Pay lifetime — ${selectedAmount != null ? formatMoney(selectedAmount, currency) : ''}`
                      : `Subscribe — ${selectedAmount != null ? formatMoney(selectedAmount, currency) : ''}${isYearly ? '/year' : '/month'}`}
                </MDButton>
                {!isLifetimeCheckout && (
                  <Typography variant="caption" display="block" textAlign="center" sx={{ color: THEME.body, mt: 1.5 }}>
                    Cancel anytime from Profile → Subscription & Billing
                  </Typography>
                )}
              </Card>
            )}

            <Typography variant="body2" textAlign="center" sx={{ color: THEME.body, mb: 2 }}>
              Billing questions? Submit a support ticket below and we will email you back.
            </Typography>

            <Box mb={2}>
              <ContactSupportPanel compact />
            </Box>
          </>
        )}

        <Divider sx={{ borderColor: THEME.border, my: 2 }} />

        <Box display="flex" justifyContent="center">
          <MDButton variant="text" color="dark" onClick={handleLogout} disabled={loggingOut}>
            <MDBox component="span" display="inline-flex" alignItems="center" gap={0.75}>
              <LogOut size={16} />
              Sign out
            </MDBox>
          </MDButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionRenewalModal;
