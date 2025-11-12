import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const { userId } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get doctor's appointments
      const appts = await API.get('/appointments');
      setAppointments(Array.isArray(appts) ? appts : []);

      // Today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appts.filter(a => a.AppointmentDate === today);

      // Calculate stats
      const scheduled = appts.filter(a => a.Status === 'Scheduled' || a.Status === 'Confirmed').length;
      const completed = appts.filter(a => a.Status === 'Completed').length;
      const cancelled = appts.filter(a => a.Status === 'Cancelled').length;

      setStats({
        totalAppointments: appts.length,
        todayAppointments: todayAppts.length,
        scheduledAppointments: scheduled,
        completedAppointments: completed,
        cancelledAppointments: cancelled
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setStats({ 
        totalAppointments: 0, 
        todayAppointments: 0, 
        scheduledAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
      });
    }
  };

  if (!stats) return <div className="p-6">Loading...</div>;

  const todayAppointments = appointments.filter(a => 
    a.AppointmentDate === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Calendar className="w-8 h-8" />}
          title="Total Appointments"
          value={stats.totalAppointments}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<Clock className="w-8 h-8" />}
          title="Today's Appointments"
          value={stats.todayAppointments}
          color="bg-orange-500"
        />
        <StatCard 
          icon={<CheckCircle className="w-8 h-8" />}
          title="Completed"
          value={stats.completedAppointments}
          color="bg-green-500"
        />
        <StatCard 
          icon={<Users className="w-8 h-8" />}
          title="Scheduled"
          value={stats.scheduledAppointments}
          color="bg-purple-500"
        />
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today's Schedule
        </h2>
        
        {todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAppointments.map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {appt.AppointmentTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.Patient?.FirstName} {appt.Patient?.LastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.Patient?.ContactNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {appt.Reason || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appt.Status === 'Scheduled' || appt.Status === 'Confirmed' ? 'bg-green-100 text-green-800' :
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
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Appointments
        </h2>
        
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.slice(0, 10).map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.AppointmentDate} {appt.AppointmentTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.Patient?.FirstName} {appt.Patient?.LastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.Patient?.ContactNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {appt.Reason || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appt.Status === 'Scheduled' || appt.Status === 'Confirmed' ? 'bg-green-100 text-green-800' :
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
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments found</p>
        )}
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

