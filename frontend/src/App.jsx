import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast.jsx";

import LandingPage from "./features/landing/LandingPage.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import SignupPage from "./features/auth/SignupPage.jsx";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage.jsx";
import VerifyEmailPage from "./features/auth/VerifyEmailPage.jsx";
import OAuthSuccessPage from "./features/auth/OAuthSuccessPage.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import StudentOverview from "./features/dashboard/student/StudentOverview.jsx";
import StudentAttendance from "./features/dashboard/student/StudentAttendance.jsx";
import StudentAssignments from "./features/dashboard/student/StudentAssignments.jsx";
import StudentEvents from "./features/dashboard/student/StudentEvents.jsx";
import StudentPlacements from "./features/dashboard/student/StudentPlacements.jsx";
import StudentClubs from "./features/dashboard/student/StudentClubs.jsx";

import FacultyOverview from "./features/dashboard/faculty/FacultyOverview.jsx";
import FacultyClasses from "./features/dashboard/faculty/FacultyClasses.jsx";
import FacultyAttendance from "./features/dashboard/faculty/FacultyAttendance.jsx";
import FacultyAssignments from "./features/dashboard/faculty/FacultyAssignments.jsx";

import CoordinatorOverview from "./features/dashboard/coordinator/CoordinatorOverview.jsx";
import CoordinatorEvents from "./features/dashboard/coordinator/CoordinatorEvents.jsx";
import CoordinatorClubs from "./features/dashboard/coordinator/CoordinatorClubs.jsx";
import CoordinatorApprovals from "./features/dashboard/coordinator/CoordinatorApprovals.jsx";

import AdminOverview from "./features/dashboard/admin/AdminOverview.jsx";
import AdminUsers from "./features/dashboard/admin/AdminUsers.jsx";
import AdminDepartments from "./features/dashboard/admin/AdminDepartments.jsx";
import AdminCourses from "./features/dashboard/admin/AdminCourses.jsx";
import AdminEvents from "./features/dashboard/admin/AdminEvents.jsx";
import AdminAttendance from "./features/dashboard/admin/AdminAttendance.jsx";
import AdminPlacements from "./features/dashboard/admin/AdminPlacements.jsx";
import AdminReports from "./features/dashboard/admin/AdminReports.jsx";
import AdminLogs from "./features/dashboard/admin/AdminLogs.jsx";

import NoticesPage from "./features/shared/NoticesPage.jsx";
import ProfilePage from "./features/shared/ProfilePage.jsx";
import SettingsPage from "./features/shared/SettingsPage.jsx";

// top-level route map — public pages, auth pages, then one protected
// /app/<role> subtree per role, each guarded so only that role can enter
export default function App() {
  return (
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />

          <Route element={<ProtectedRoute />}>
            {/* student */}
            <Route element={<RoleRoute allowedRoles={["student"]} />}>
              <Route path="/app/student" element={<DashboardLayout role="student" />}>
                <Route index element={<StudentOverview />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="events" element={<StudentEvents />} />
                <Route path="placements" element={<StudentPlacements />} />
                <Route path="clubs" element={<StudentClubs />} />
                <Route path="notices" element={<NoticesPage canPublish={false} />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* faculty */}
            <Route element={<RoleRoute allowedRoles={["faculty"]} />}>
              <Route path="/app/faculty" element={<DashboardLayout role="faculty" />}>
                <Route index element={<FacultyOverview />} />
                <Route path="classes" element={<FacultyClasses />} />
                <Route path="attendance" element={<FacultyAttendance />} />
                <Route path="assignments" element={<FacultyAssignments />} />
                <Route path="notices" element={<NoticesPage canPublish />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* coordinator */}
            <Route element={<RoleRoute allowedRoles={["coordinator"]} />}>
              <Route path="/app/coordinator" element={<DashboardLayout role="coordinator" />}>
                <Route index element={<CoordinatorOverview />} />
                <Route path="events" element={<CoordinatorEvents />} />
                <Route path="clubs" element={<CoordinatorClubs />} />
                <Route path="approvals" element={<CoordinatorApprovals />} />
                <Route path="notices" element={<NoticesPage canPublish />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* admin */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/app/admin" element={<DashboardLayout role="admin" />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="placements" element={<AdminPlacements />} />
                <Route path="announcements" element={<NoticesPage canPublish />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
  );
}