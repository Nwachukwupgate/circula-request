import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Card } from '@mui/material';
import MDTypography from 'components/MDTypography';
import MDBox from 'components/MDBox';
import { useVerifySubscriptionPaymentMutation, useGetProfileQuery } from 'api/apiSlice';
import { clearSubscriptionBlocked } from 'api/subscriptionSlice';
import { toast } from 'react-toastify';

function SubscriptionCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const { data: profile } = useGetProfileQuery();
  const subscriptionCompanyId = useSelector((state) => state.subscription.companyId);
  const companyId = profile?.companyId || subscriptionCompanyId;
  const [verifyPayment, { isLoading }] = useVerifySubscriptionPaymentMutation();

  useEffect(() => {
    if (!reference) {
      toast.error('No payment reference found');
      navigate('/dashboard', { replace: true });
      return;
    }

    if (!companyId) return;

    let cancelled = false;

    const runVerification = async () => {
      try {
        const result = await verifyPayment({ companyId, reference }).unwrap();
        if (cancelled) return;
        if (result?.success) {
          dispatch(clearSubscriptionBlocked());
          toast.success(result.message || 'Subscription activated!');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        if (cancelled) return;
        toast.error(err?.data?.message || 'Payment verification failed');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
      }
    };

    runVerification();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, companyId]);

  return (
    <MDBox
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: 'linear-gradient(160deg, #0f172a 0%, #312e81 100%)' }}
    >
      <Card sx={{ p: 4, textAlign: 'center', maxWidth: 420 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <MDTypography variant="h5" fontWeight="bold" gutterBottom>
          Confirming your payment
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Please wait while we activate your subscription…
        </MDTypography>
        {reference && (
          <Box mt={2}>
            <MDTypography variant="caption" color="text">
              Ref: {reference}
            </MDTypography>
          </Box>
        )}
        {(isLoading || !companyId) && (
          <MDTypography variant="caption" color="text" display="block" mt={1}>
            {!companyId ? 'Loading account…' : 'Verifying with Paystack…'}
          </MDTypography>
        )}
      </Card>
    </MDBox>
  );
}

export default SubscriptionCallback;
