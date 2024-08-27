import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token") 

  // If the user is not authenticated, redirect to the sign-in page
  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  return element;
};

export default ProtectedRoute;
