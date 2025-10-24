import React, { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Edit2, Trash2, Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { role } = useAuthStore();
  
  const [formData, setFormData] = useState({
    ClinicName: '',
    Address: '',
    ContactNumber: '',
    Email: ''
  });

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      const { data } = await API.get('/clinics');
      setClinics(data);
    } catch (error) {
      toast.error('Failed to load clinics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await API.put(`/clinics/${editingId}`, formData);
        toast.success('Clinic updated successfully');
      } else {
        await API.post('/clinics', formData);
        toast.success('Clinic added successfully');
      }
      
      resetForm();
      loadClinics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (clinic) => {
    setFormData({
      ClinicName: clinic.ClinicName || '',
      Address: clinic.Address || '',
      ContactNumber: clinic.ContactNumber || '',
      Email: clinic.Email || ''
    });
    setEditingId(clinic.ClinicID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) return;
    
    try {
      await API.delete(`/clinics/${id}`);
      toast.success('Clinic deleted successfully');
      loadClinics();
    } catch (error) {
      toast.error('Failed to delete clinic');
    }
  };

  const resetForm = () => {
    setFormData({
      ClinicName: '',
      Address: '',
      ContactNumber: '',
      Email: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clinics</h1>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Clinic'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Clinic' : 'Add New Clinic'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinic Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ClinicName}
                onChange={(e) => setFormData({...formData, ClinicName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.Address}
                onChange={(e) => setFormData({...formData, Address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
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
                Email
              </label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({...formData, Email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Add'} Clinic
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

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <div key={clinic.ClinicID} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {clinic.ClinicName}
              </h3>
              {role === 'admin' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(clinic)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(clinic.ClinicID)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-gray-600">
              {clinic.Address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="text-sm">{clinic.Address}</span>
                </div>
              )}

              {clinic.ContactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{clinic.ContactNumber}</span>
                </div>
              )}

              {clinic.Email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{clinic.Email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {clinics.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No clinics found</p>
          {role === 'admin' && (
            <p className="text-sm mt-2">Click "Add Clinic" to create your first clinic</p>
          )}
        </div>
      )}
    </div>
  );
}
