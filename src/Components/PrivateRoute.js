import React from "react";
import { Routes, Route, Redirect, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate replace to="/" />;
}

export default PrivateRoute;
