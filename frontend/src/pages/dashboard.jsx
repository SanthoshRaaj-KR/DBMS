import React from 'react';
import useAuthStore from '../store/authStore';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { role } = useAuthStore();

  // Route to appropriate dashboard based on role
  if (role === 'patient') {
    return <PatientDashboard />;
  } else if (role === 'doctor') {
    return <DoctorDashboard />;
  } else if (role === 'admin' || role === 'staff') {
    return <AdminDashboard />;
  }

  return <div className="p-6">Loading...</div>;
}
