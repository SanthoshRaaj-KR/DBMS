import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, Users, FileText, Clock, CheckCircle, Award, Briefcase, Phone, Mail } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

export default function DoctorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const data = await API.get(`/dashboard/doctor/${userId}`);
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!dashboardData) return <div className="p-6">Failed to load dashboard</div>;

  const { doctorInfo, statistics, todaySchedule, recentAppointments } = dashboardData;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Doctor Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dr. {doctorInfo.FirstName} {doctorInfo.LastName}
              </h1>
              <p className="text-blue-600 font-medium text-lg">
                {doctorInfo.Specialization?.SpecializationName}
              </p>
              <p className="text-gray-600">{doctorInfo.Qualification} • {doctorInfo.ExperienceYears} years experience</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-50 px-4 py-2 rounded-lg mb-2">
              <p className="text-sm text-gray-600">License Number</p>
              <p className="text-lg font-bold text-blue-700">{doctorInfo.LicenseNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{doctorInfo.Email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="font-medium text-gray-800">{doctorInfo.ContactNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Award className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="font-medium text-gray-800">{doctorInfo.Department?.DepartmentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Calendar}
          title="Total Appointments"
          value={statistics.totalAppointments}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatCard 
          icon={Clock}
          title="Today's Appointments"
          value={statistics.todayAppointments}
          color="bg-orange-500"
          subtitle={`${todaySchedule.length} scheduled`}
        />
        <StatCard 
          icon={CheckCircle}
          title="Completed"
          value={statistics.completedAppointments}
          color="bg-green-500"
          subtitle="Successfully treated"
        />
        <StatCard 
          icon={Calendar}
          title="Upcoming"
          value={statistics.upcomingAppointments}
          color="bg-purple-500"
          subtitle="Scheduled visits"
        />
        <StatCard 
          icon={Users}
          title="Total Patients"
          value={statistics.uniquePatients}
          color="bg-indigo-500"
          subtitle="Unique patients"
        />
        <StatCard 
          icon={FileText}
          title="Medical Records"
          value={statistics.totalMedicalRecords}
          color="bg-teal-500"
          subtitle="Records created"
        />
      </div>

      {/* Today's Schedule */}
      <Card 
        title="Today's Schedule"
        subtitle={`${todaySchedule.length} appointments scheduled for today`}
        noPadding
        icon={Clock}
      >
        {todaySchedule.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Patient ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {todaySchedule.map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                      {appt.AppointmentTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">
                        {appt.Patient?.FirstName} {appt.Patient?.LastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">
                        {appt.Patient?.PatientNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {appt.Patient?.ContactNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {appt.Reason || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appt.Status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
            <p className="text-gray-400 text-sm mt-2">Enjoy your free day!</p>
          </div>
        )}
      </Card>

      {/* Recent Appointments History */}
      <Card 
        title="Recent Appointments History"
        subtitle="Your appointment history"
        noPadding
        icon={Calendar}
        className="mt-6"
      >
        {recentAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Patient ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentAppointments.map(appt => (
                  <tr key={appt.AppointmentID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{appt.AppointmentDate}</p>
                      <p className="text-xs text-gray-500">{appt.AppointmentTime}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {appt.Patient?.FirstName} {appt.Patient?.LastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">
                        {appt.Patient?.PatientNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {appt.Patient?.ContactNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {appt.Reason || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appt.Status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointment history found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Scheduled': 'bg-blue-100 text-blue-700',
    'Confirmed': 'bg-green-100 text-green-700',
    'Completed': 'bg-gray-100 text-gray-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'No Show': 'bg-orange-100 text-orange-700'
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
