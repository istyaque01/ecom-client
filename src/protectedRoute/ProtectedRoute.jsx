import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // Change this line

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    // Invalid token
    return <Navigate to="/login" replace />;
  }

  return children;
};
