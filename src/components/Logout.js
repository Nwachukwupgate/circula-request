// src/layouts/authentication/logout/index.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SaveUser } from "api/userSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear token, user data, etc.
    localStorage.clear();
    dispatch(SaveUser(null)); // Clear user from redux store
    navigate("/authentication/sign-in");
  }, [dispatch, navigate]);

  return null; // You can also return a spinner or blank screen
}
