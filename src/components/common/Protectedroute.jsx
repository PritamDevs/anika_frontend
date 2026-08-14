import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
    }
  }, [token]);
  
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;