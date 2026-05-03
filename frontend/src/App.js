import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import LoadingSpinner from './components/LoadingSpinner';

import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/LoginRegister/RoleSelectionPage';
import PatientRegister from './pages/LoginRegister/PatientRegister';
import DoctorRegister from './pages/LoginRegister/DoctorRegister';
import AdminRegister from './pages/LoginRegister/AdminRegister';
import PatientRegisterProfile from './pages/LoginRegister/PatientRegisterProfile';
import DoctorRegisterProfile from './pages/LoginRegister/DoctorRegisterProfile';

import PatientDashboard from './pages/Patient/PatientDashboard';
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';
import MedicalRecords from './pages/Patient/MedicalRecords';
import Prescriptions from './pages/Patient/Prescriptions';
import Bills from './pages/Patient/Bills';
import PatientProfile from './pages/Patient/PatientProfile';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import AddMedicalRecord from './pages/Doctor/AddMedicalRecord';
import CreatePrescription from './pages/Doctor/CreatePrescription';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorPatients from './pages/Doctor/DoctorPatients';

import AdminDashboard from './pages/Admin/AdminDashboard';
import Reports from './pages/Admin/Reports';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageBills from './pages/Admin/ManageBills';
import AdminAppointments from './pages/Admin/AdminAppointments';
import AdminDoctors from './pages/Admin/AdminDoctors';

import './styles/global.css';
import './styles/auth.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RoleSelectionPage />} />
      <Route path="/register/patient" element={<PatientRegister />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/admin" element={<AdminRegister />} />

      <Route
        path="/patient/register-profile"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientRegisterProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/register-profile"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorRegisterProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute requiredRole="patient">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute requiredRole="patient">
            <MyAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/medical-records"
        element={
          <ProtectedRoute requiredRole="patient">
            <MedicalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute requiredRole="patient">
            <Prescriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/bills"
        element={
          <ProtectedRoute requiredRole="patient">
            <Bills />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/add-record"
        element={
          <ProtectedRoute requiredRole="doctor">
            <AddMedicalRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute requiredRole="doctor">
            <CreatePrescription />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bills"
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageBills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDoctors />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Chatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
