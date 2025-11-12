import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [role, setRole] = useState('patient');
  const [identifier, setIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Load doctors and patients for selection
  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          API.get('/doctors'),
          API.get('/patients')
        ]);
        setDoctors(doctorsRes.doctors || []);
        setPatients(patientsRes.patients || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (role === 'admin') {
        // Verify admin password
        if (adminPassword !== 'admin123') {
          toast.error('Invalid admin password');
          setLoading(false);
          return;
        }
        
        login('admin', null, 'Administrator', adminPassword);
        toast.success('Admin access granted!');
        navigate('/dashboard');
      } else if (role === 'doctor') {
        // Find doctor by ID or name
        const doctor = doctors.find(d => 
          d.DoctorID.toString() === identifier || 
          `${d.FirstName} ${d.LastName}`.toLowerCase().includes(identifier.toLowerCase())
        );
        
        if (!doctor) {
          toast.error('Doctor not found. Please check the ID or name.');
          setLoading(false);
          return;
        }
        
        login('doctor', doctor.DoctorID, `Dr. ${doctor.FirstName} ${doctor.LastName}`);
        toast.success(`Welcome, Dr. ${doctor.FirstName} ${doctor.LastName}!`);
        navigate('/dashboard');
      } else if (role === 'patient') {
        // Find patient by ID or name
        const patient = patients.find(p => 
          p.PatientID.toString() === identifier || 
          `${p.FirstName} ${p.LastName}`.toLowerCase().includes(identifier.toLowerCase())
        );
        
        if (!patient) {
          toast.error('Patient not found. Please check the ID or name.');
          setLoading(false);
          return;
        }
        
        login('patient', patient.PatientID, `${patient.FirstName} ${patient.LastName}`);
        toast.success(`Welcome, ${patient.FirstName} ${patient.LastName}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Access failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🏥 Hospital Management System
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier('');
                setAdminPassword('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="patient">👤 Patient</option>
              <option value="doctor">👨‍⚕️ Doctor</option>
              <option value="admin">🔐 Admin</option>
            </select>
          </div>
          
          {/* Admin Password Input */}
          {role === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Default: admin123</p>
            </div>
          ) : (
            /* Doctor/Patient ID or Name Input */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'doctor' ? 'Doctor ID or Name' : 'Patient ID or Name'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={`Enter ${role} ID or name`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              {/* Quick Selection Dropdown */}
              {role === 'doctor' && doctors.length > 0 && (
                <select
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Or select from list...</option>
                  {doctors.map(d => (
                    <option key={d.DoctorID} value={d.DoctorID}>
                      ID: {d.DoctorID} - Dr. {d.FirstName} {d.LastName} ({d.Specialization?.SpecializationName})
                    </option>
                  ))}
                </select>
              )}
              
              {role === 'patient' && patients.length > 0 && (
                <select
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Or select from list...</option>
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>
                      ID: {p.PatientID} - {p.FirstName} {p.LastName} ({p.PatientNumber})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Accessing...' : 'Access System'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Quick Access:</strong><br/>
            Admin: password "admin123"<br/>
            Doctor: ID 1-6 or select from dropdown<br/>
            Patient: ID 1-12 or select from dropdown
          </p>
        </div>
      </div>
    </div>
  );
}
