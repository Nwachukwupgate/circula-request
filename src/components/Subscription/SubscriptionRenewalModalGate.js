import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from 'utils/tokenManager';
import SubscriptionRenewalModal from './SubscriptionRenewalModal';

const PUBLIC_PATHS = [
  '/authentication/sign-in',
  '/authentication/reset-password',
  '/change-password',
  '/subscription/callback',
];

/** Renders renewal modal inside ThemeProvider (requires MUI theme). */
function SubscriptionRenewalModalGate() {
  const { pathname } = useLocation();
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isBlocked = useSelector((state) => state.subscription.isBlocked);
  const hasAuth = isAuthenticated();

  if (isPublic || !hasAuth || !isBlocked) {
    return null;
  }

  return <SubscriptionRenewalModal />;
}

export default SubscriptionRenewalModalGate;
