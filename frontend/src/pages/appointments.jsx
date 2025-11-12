import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { role, userId } = useAuthStore();
  
  const [formData, setFormData] = useState({
    PatientID: '',
    DoctorID: '',
    AppointmentDate: '',
    AppointmentTime: '',
    Reason: '',
    Notes: ''
  });

  useEffect(() => {
    loadAppointments();
    loadDoctors();
    if (role === 'admin' || role === 'doctor') {
      loadPatients();
    }
  }, [filterStatus, role, userId]);

  const loadAppointments = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (role === 'doctor') params.doctorId = userId;
      if (role === 'patient') params.patientId = userId;
      
      const data = await API.get('/appointments', { params });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments');
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await API.get('/doctors');
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await API.get('/patients');
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        PatientID: role === 'patient' ? userId : parseInt(formData.PatientID),
        DoctorID: parseInt(formData.DoctorID)
      };
      
      await API.post('/appointments', appointmentData);
      toast.success('Appointment booked successfully!');
      setShowForm(false);
      loadAppointments();
      setFormData({ 
        PatientID: '', 
        DoctorID: '', 
        AppointmentDate: '', 
        AppointmentTime: '',
        Reason: '',
        Notes: ''
      });
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

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await API.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        {(role === 'patient' || role === 'admin') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Book Appointment'}
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="mr-2 text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Patient Selection (only for admin) */}
            {role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  value={formData.PatientID}
                  onChange={(e) => setFormData({...formData, PatientID: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>
                      {p.FirstName} {p.LastName} ({p.PatientNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Doctor Selection */}
            <div className={role === 'admin' ? '' : 'col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor *
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
                    Dr. {d.FirstName} {d.LastName} - {d.Specialization?.SpecializationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.AppointmentDate}
                onChange={(e) => setFormData({...formData, AppointmentDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={formData.AppointmentTime}
                onChange={(e) => setFormData({...formData, AppointmentTime: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Reason */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <input
                type="text"
                value={formData.Reason}
                onChange={(e) => setFormData({...formData, Reason: e.target.value})}
                placeholder="e.g., Regular checkup, Follow-up visit"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.Notes}
                onChange={(e) => setFormData({...formData, Notes: e.target.value})}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
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

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {role !== 'patient' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              )}
              {role !== 'doctor' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {(role === 'doctor' || role === 'admin') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map(appt => (
                <tr key={appt.AppointmentID}>
                  {role !== 'patient' && (
                    <td className="px-6 py-4">
                      {appt.Patient?.FirstName} {appt.Patient?.LastName}
                      <br/>
                      <span className="text-xs text-gray-500">{appt.Patient?.PatientNumber}</span>
                    </td>
                  )}
                  {role !== 'doctor' && (
                    <td className="px-6 py-4">
                      Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
                      <br/>
                      <span className="text-xs text-gray-500">{appt.Doctor?.Specialization?.SpecializationName}</span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {appt.AppointmentDate}
                    <br/>
                    <span className="text-sm text-gray-600">{appt.AppointmentTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {appt.Reason || 'N/A'}
                      {appt.Notes && (
                        <div className="text-xs text-gray-500 mt-1">{appt.Notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appt.Status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appt.Status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appt.Status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appt.Status}
                    </span>
                  </td>
                  {(role === 'doctor' || role === 'admin') && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {(appt.Status === 'Scheduled' || appt.Status === 'Confirmed') && (
                          <>
                            <button
                              onClick={() => updateStatus(appt.AppointmentID, 'Completed')}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => deleteAppointment(appt.AppointmentID)}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
