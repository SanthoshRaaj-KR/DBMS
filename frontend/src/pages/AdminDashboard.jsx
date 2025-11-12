import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, Users, Stethoscope, Building2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuthStore();

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(r => {
        setStats(r);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const recentAppointments = stats?.recentAppointments || [];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <PageHeader 
        title="Admin Dashboard"
        subtitle="Manage and monitor your hospital operations"
        icon={Building2}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Users}
          title="Total Patients"
          value={stats?.totalPatients || 0}
          color="bg-blue-500"
          subtitle="Registered patients"
        />
        <StatCard 
          icon={Stethoscope}
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          color="bg-green-500"
          subtitle="Medical professionals"
        />
        <StatCard 
          icon={Calendar}
          title="Upcoming Appointments"
          value={stats?.upcomingAppointments || 0}
          color="bg-orange-500"
          subtitle="Scheduled visits"
        />
      </div>

      <Card 
        title="Recent Appointments"
        subtitle="Latest scheduled appointments"
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentAppointments.length > 0 ? (
                recentAppointments.map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {appt.Patient?.FirstName?.charAt(0)}{appt.Patient?.LastName?.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {appt.Patient?.FirstName} {appt.Patient?.LastName}
                          </p>
                          <p className="text-xs text-gray-500">{appt.Patient?.ContactNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
                      </p>
                      <p className="text-xs text-gray-500">{appt.Doctor?.Specialization?.SpecializationName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{appt.AppointmentDate}</p>
                      <p className="text-xs text-gray-500">{appt.AppointmentTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{appt.Reason || 'General Consultation'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        appt.Status === 'Scheduled' || appt.Status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        appt.Status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appt.Status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No appointments found</p>
                    <p className="text-sm">Appointments will appear here once scheduled</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

