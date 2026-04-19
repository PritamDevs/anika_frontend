import { Navigate, Outlet } from "react-router-dom";

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
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;