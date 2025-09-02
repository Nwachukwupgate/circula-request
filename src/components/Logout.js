// src/layouts/authentication/logout/index.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SaveUser } from "api/userSlice";
import { apiSlice } from "api/apiSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear token, user data, etc.
    localStorage.clear();
    dispatch(SaveUser(null)); 
    dispatch(apiSlice.util.resetApiState());
    navigate("/authentication/sign-in");
  }, [dispatch, navigate]);

  return null;
}
