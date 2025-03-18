import React from "react";

// Completely disabled ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Always allow access - auth disabled
  return <>{children}</>;
};

export default ProtectedRoute;
