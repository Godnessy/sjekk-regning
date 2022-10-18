import React from "react";
import { Routes, Route, Redirect, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../Pages/Login";

// function PrivateRoute({ component: Component, ...rest }) {
//   const { currentUser } = useAuth();
//   return (
//     <Route
//       {...rest}
//       render={({children}) => {
//         return currentUser ? (
//         //   <Component {children} />
//         {children}
//         ) : (
//           <Navigate replace to="/login" />
//         );
//       }}
//     ></Route>
//   );
// }

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  console.log(children);
  return currentUser ? (
    <Route path="/home" />
  ) : (
    <Route path="/" element={<Login />} />
  );
}

export default PrivateRoute;
