import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import RegisterStudent from "./pages/RegisterStudent";
import NotFound from "./pages/NotFound";

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffPatients from "./pages/staff/StaffPatients";
import StaffAppointments from "./pages/staff/StaffAppointments";
import StaffReports from "./pages/staff/StaffReports";
import StaffConsultations from "./pages/staff/StaffConsultations";
import StaffLabResults from "./pages/staff/StaffLabResults";
import StaffProfile from "./pages/staff/StaffProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReports from "./pages/admin/AdminReports";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentReportIllness from "./pages/student/StudentReportIllness";
import StudentVisits from "./pages/student/StudentVisits";
import StudentAppointments from "./pages/student/StudentAppointments";
import StudentProfile from "./pages/student/StudentProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/index" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/admin" element={<RegisterAdmin />} />
            <Route path="/register/student" element={<RegisterStudent />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/reports" element={<AdminReports />} />

            {/* Staff routes */}
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/patients" element={<StaffPatients />} />
            <Route path="/staff/appointments" element={<StaffAppointments />} />
            <Route path="/staff/reports" element={<StaffReports />} />
            <Route path="/staff/consultations" element={<StaffConsultations />} />
            <Route path="/staff/lab-results" element={<StaffLabResults />} />
            <Route path="/staff/profile" element={<StaffProfile />} />

            {/* Student routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/report" element={<StudentReportIllness />} />
            <Route path="/student/visits" element={<StudentVisits />} />
            <Route path="/student/appointments" element={<StudentAppointments />} />
            <Route path="/student/profile" element={<StudentProfile />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
