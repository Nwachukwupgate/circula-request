// src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SaveUser } from "api/userSlice";
import { apiSlice, useLogoutMutation } from "api/apiSlice";
import { clearTokens } from "utils/tokenManager";
import { toast } from "react-toastify";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout API to invalidate refresh token on server
        await logout().unwrap();
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API fails
      } finally {
        // Clear all tokens from storage
        clearTokens();
        
        // Clear Redux state
        dispatch(SaveUser(null)); 
        dispatch(apiSlice.util.resetApiState());
        
        // Show success message
        toast.success('Logged out successfully');
        
        // Redirect to sign-in
        navigate("/authentication/sign-in", { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
