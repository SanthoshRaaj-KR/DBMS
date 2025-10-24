import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Clinics from './pages/Clinics';
import Appointments from './pages/appointments';
import { LogOut } from 'lucide-react';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { isAuthenticated, role, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/appointments" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                  Appointments
                </Link>
                {role === 'admin' && (
                  <>
                    <Link to="/patients" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                      Patients
                    </Link>
                    <Link to="/doctors" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                      Doctors
                    </Link>
                    <Link to="/clinics" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                      Clinics
                    </Link>
                  </>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4 capitalize">{role}</span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/clinics" element={<ProtectedRoute><Clinics /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
