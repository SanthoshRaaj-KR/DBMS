import React, { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [filterSpec, setFilterSpec] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { role } = useAuthStore();
  
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    ContactNumber: '',
    SpecializationID: ''
  });

  useEffect(() => {
    loadDoctors();
    loadSpecializations();
    loadClinics();
  }, [filterSpec]);

  const loadDoctors = async () => {
    try {
      const params = filterSpec ? { specializationId: filterSpec } : {};
      const { data } = await API.get('/doctors', { params });
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const loadSpecializations = async () => {
    try {
      const { data } = await API.get('/specializations');
      setSpecializations(data);
    } catch (error) {
      console.error('Failed to load specializations');
    }
  };

  const loadClinics = async () => {
    try {
      const { data } = await API.get('/clinics');
      setClinics(data);
    } catch (error) {
      console.error('Failed to load clinics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, formData);
        toast.success('Doctor updated successfully');
      } else {
        await API.post('/doctors', formData);
        toast.success('Doctor added successfully');
      }
      
      resetForm();
      loadDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      FirstName: doctor.FirstName || '',
      LastName: doctor.LastName || '',
      ContactNumber: doctor.ContactNumber || '',
      SpecializationID: doctor.SpecializationID || ''
    });
    setEditingId(doctor.DoctorID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      await API.delete(`/doctors/${id}`);
      toast.success('Doctor deleted successfully');
      loadDoctors();
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const resetForm = () => {
    setFormData({
      FirstName: '',
      LastName: '',
      ContactNumber: '',
      SpecializationID: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Doctors</h1>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Doctor'}
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Specialization
        </label>
        <select
          value={filterSpec}
          onChange={(e) => setFilterSpec(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Specializations</option>
          {specializations.map(s => (
            <option key={s.SpecializationID} value={s.SpecializationID}>
              {s.SpecializationName}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.FirstName}
                onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.LastName}
                onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.ContactNumber}
                onChange={(e) => setFormData({...formData, ContactNumber: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.SpecializationID}
                onChange={(e) => setFormData({...formData, SpecializationID: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map(s => (
                  <option key={s.SpecializationID} value={s.SpecializationID}>
                    {s.SpecializationName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Add'} Doctor
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                {role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.DoctorID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      Dr. {doctor.FirstName} {doctor.LastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {doctor.Specialization?.SpecializationName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {doctor.ContactNumber || 'N/A'}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.DoctorID)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No doctors found
        </div>
      )}
    </div>
  );
}
