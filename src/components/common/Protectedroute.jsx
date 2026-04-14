import { Navigate, Outlet } from "react-router-dom";

// This component re-evaluates on every render (unlike inline localStorage check in App.jsx)
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // No token → kick to login, replace so back button can't return to dashboard
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists → render the child route (DashboardLayout + page)
  return <Outlet />;
};

export default ProtectedRoute;