import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

// makes sure a signed-in user can only reach dashboards that match
// their own role, e.g. a student can't browse to /app/admin
export default function RoleRoute({ allowedRoles }) {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={`/app/${currentUser.role}`} replace />;
  }

  return <Outlet />;
}
