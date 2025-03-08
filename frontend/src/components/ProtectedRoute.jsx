import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  // If user is not logged in, redirect to /auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
