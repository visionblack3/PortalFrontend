import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import BrowseJobs from "./pages/seeker/BrowseJobs";
import MyApplications from "./pages/seeker/MyApplications";

import MyJobs from "./pages/employer/MyJobs";
import JobFormPage from "./pages/employer/JobFormPage";
import JobApplications from "./pages/employer/JobApplications";

import AdminJobs from "./pages/admin/AdminJobs";
import AdminJobEditPage from "./pages/admin/AdminJobEditPage";
import AdminApplications from "./pages/admin/AdminApplications";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute roles={["JOB_SEEKER"]}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute roles={["JOB_SEEKER"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute roles={["EMPLOYER"]}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/new"
          element={
            <ProtectedRoute roles={["EMPLOYER"]}>
              <JobFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:jobId/edit"
          element={
            <ProtectedRoute roles={["EMPLOYER"]}>
              <JobFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:jobId/applications"
          element={
            <ProtectedRoute roles={["EMPLOYER"]}>
              <JobApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:jobId/edit"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminJobEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminApplications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
