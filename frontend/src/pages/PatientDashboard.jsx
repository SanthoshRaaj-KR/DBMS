import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, FileText, Pill, Clock, CheckCircle, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get patient's appointments
      const appts = await API.get('/appointments');
      setAppointments(Array.isArray(appts) ? appts : []);

      // Calculate stats
      const upcoming = appts.filter(a => 
        new Date(a.AppointmentDate) >= new Date() && 
        a.Status !== 'Cancelled' && 
        a.Status !== 'Completed'
      ).length;

      const completed = appts.filter(a => a.Status === 'Completed').length;

      setStats({
        totalAppointments: appts.length,
        upcomingAppointments: upcoming,
        completedAppointments: completed
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setStats({ totalAppointments: 0, upcomingAppointments: 0, completedAppointments: 0 });
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <PageHeader 
        title="My Dashboard"
        subtitle="Welcome back! Here's your health overview"
        icon={Calendar}
        action={
          <Button 
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/appointments')}
          >
            Book Appointment
          </Button>
        }
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Calendar}
          title="Total Appointments"
          value={stats.totalAppointments}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatCard 
          icon={Clock}
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="bg-orange-500"
          subtitle="Scheduled visits"
        />
        <StatCard 
          icon={CheckCircle}
          title="Completed Visits"
          value={stats.completedAppointments}
          color="bg-green-500"
          subtitle="Past appointments"
        />
      </div>

      {/* Appointments List */}
      <Card 
        title="My Appointments"
        subtitle="View and manage your scheduled appointments"
        noPadding
      >
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {appointments.slice(0, 10).map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
                        </p>
                        <p className="text-xs text-gray-500">{appt.Doctor?.Specialization?.SpecializationName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{appt.AppointmentDate}</p>
                      <p className="text-xs text-gray-500">{appt.AppointmentTime}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {appt.Reason || 'General Consultation'}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No Appointments"
            description="You don't have any appointments scheduled yet. Book your first appointment to get started."
            actionLabel="Book Appointment"
            onAction={() => navigate('/appointments')}
          />
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <QuickActionCard
          icon={FileText}
          title="Medical Records"
          description="View your complete medical history and previous consultations"
          onClick={() => navigate('/medical-records')}
          color="bg-purple-500"
        />
        <QuickActionCard
          icon={Pill}
          title="Prescriptions"
          description="Access your current and past prescriptions from doctors"
          onClick={() => navigate('/prescriptions')}
          color="bg-green-500"
        />
        <QuickActionCard
          icon={Calendar}
          title="View All Appointments"
          description="See complete history of all your appointments"
          onClick={() => navigate('/appointments')}
          color="bg-blue-500"
        />
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className={`${color} p-3 rounded-lg text-white w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

