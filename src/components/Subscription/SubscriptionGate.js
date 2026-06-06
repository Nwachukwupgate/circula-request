import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useGetProfileQuery } from 'api/apiSlice';
import { setSubscriptionBlocked, clearSubscriptionBlocked } from 'api/subscriptionSlice';
import { getSubscriptionBlockFromProfile } from 'utils/subscription';
import { isAuthenticated } from 'utils/tokenManager';

const PUBLIC_PATHS = [
  '/authentication/sign-in',
  '/authentication/reset-password',
  '/change-password',
  '/subscription/callback',
];

function SubscriptionGate({ children }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const hasAuth = isAuthenticated();

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: isPublic || !hasAuth,
  });

  useEffect(() => {
    if (!profile) return;

    const block = getSubscriptionBlockFromProfile(profile);
    if (block) {
      dispatch(setSubscriptionBlocked(block));
    } else {
      dispatch(clearSubscriptionBlocked());
    }
  }, [profile, dispatch]);

  return children;
}

export default SubscriptionGate;
