import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, getRefreshToken } from "./utils/tokenManager";

const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  
  // Check for either access token or refresh token
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const hasToken = accessToken || refreshToken;

  // No tokens - redirect to login
  if (!hasToken) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
  }

  // Has tokens - render the protected component
  return element;
};

export default ProtectedRoute;
