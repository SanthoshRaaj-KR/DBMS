import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Patients from './pages/patients';
import Doctors from './pages/doctors';
import Appointments from './pages/appointments';
import { LogOut } from 'lucide-react';

function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { isLoggedIn, role, userName, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn && (
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
                  </>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  {userName} <span className="text-xs text-gray-500">({role})</span>
                </span>
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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
