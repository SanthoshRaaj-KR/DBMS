import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { role } = useAuthStore();
  
  const [formData, setFormData] = useState({
    DoctorID: '',
    ClinicID: '',
    AppointmentDate: '',
    AppointmentTime: ''
  });

  useEffect(() => {
    loadAppointments();
    API.get('/doctors').then(r => setDoctors(r.data));
    API.get('/clinics').then(r => setClinics(r.data));
  }, [filterStatus]);

  const loadAppointments = () => {
    const params = filterStatus ? { status: filterStatus } : {};
    API.get('/appointments', { params }).then(r => setAppointments(r.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', formData);
      toast.success('Appointment booked successfully!');
      setShowForm(false);
      loadAppointments();
      setFormData({ DoctorID: '', ClinicID: '', AppointmentDate: '', AppointmentTime: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { Status: status });
      toast.success('Status updated');
      loadAppointments();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        {role === 'patient' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Book Appointment'}
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="mr-2 text-gray-700">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                value={formData.DoctorID}
                onChange={(e) => setFormData({...formData, DoctorID: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.DoctorID} value={d.DoctorID}>
                    Dr. {d.FirstName} {d.LastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinic
              </label>
              <select
                value={formData.ClinicID}
                onChange={(e) => setFormData({...formData, ClinicID: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Clinic</option>
                {clinics.map(c => (
                  <option key={c.ClinicID} value={c.ClinicID}>
                    {c.ClinicName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.AppointmentDate}
                onChange={(e) => setFormData({...formData, AppointmentDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={formData.AppointmentTime}
                onChange={(e) => setFormData({...formData, AppointmentTime: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {role !== 'patient' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map(appt => (
              <tr key={appt.AppointmentID}>
                <td className="px-6 py-4">
                  {appt.Patient?.FirstName} {appt.Patient?.LastName}
                </td>
                <td className="px-6 py-4">
                  Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
                </td>
                <td className="px-6 py-4">{appt.Clinic?.ClinicName}</td>
                <td className="px-6 py-4">
                  {appt.AppointmentDate} {appt.AppointmentTime}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appt.Status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    appt.Status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appt.Status}
                  </span>
                </td>
                {role !== 'patient' && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {appt.Status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => updateStatus(appt.AppointmentID, 'Completed')}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(appt.AppointmentID, 'Cancelled')}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
