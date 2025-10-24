import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, Users, Stethoscope, Building2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { role } = useAuthStore();

  useEffect(() => {
    API.get('/dashboard/stats').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users className="w-8 h-8" />}
          title="Total Patients"
          value={stats.totalPatients}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<Stethoscope className="w-8 h-8" />}
          title="Total Doctors"
          value={stats.totalDoctors}
          color="bg-green-500"
        />
        <StatCard 
          icon={<Building2 className="w-8 h-8" />}
          title="Total Clinics"
          value={stats.totalClinics}
          color="bg-purple-500"
        />
        <StatCard 
          icon={<Calendar className="w-8 h-8" />}
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentAppointments.map(appt => (
                <tr key={appt.AppointmentID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appt.Patient?.FirstName} {appt.Patient?.LastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appt.Clinic?.ClinicName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appt.AppointmentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appt.Status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                      appt.Status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appt.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
      <div className={`${color} p-3 rounded-full text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
