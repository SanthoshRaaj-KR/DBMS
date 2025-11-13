import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuthStore from '../store/authStore';
import { Calendar, FileText, DollarSign, Pill, User, Phone, Mail, Droplet, CreditCard } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

export default function PatientDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bills');
  const { userId } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const data = await API.get(`/dashboard/patient/${userId}`);
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!dashboardData) return <div className="p-6">Failed to load dashboard</div>;

  const { patientInfo, billingSummary, medicalRecords, prescriptions, appointments } = dashboardData;

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">
      {/* Patient Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-4 rounded-full text-white">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {patientInfo.FirstName} {patientInfo.LastName}
              </h1>
              <p className="text-green-600 font-medium text-lg">Patient Dashboard</p>
              <p className="text-gray-600">Patient ID: {patientInfo.PatientNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-green-50 px-4 py-2 rounded-lg mb-2">
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="text-2xl font-bold text-green-700">{patientInfo.BloodGroup}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800 text-sm">{patientInfo.Email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="font-medium text-gray-800">{patientInfo.ContactNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">{patientInfo.DateOfBirth}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">{patientInfo.Gender}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={DollarSign}
          title="Total Billed"
          value={`₹${billingSummary.totalBilled.toFixed(2)}`}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatCard 
          icon={CreditCard}
          title="Amount Paid"
          value={`₹${billingSummary.totalPaid.toFixed(2)}`}
          color="bg-green-500"
          subtitle="Paid bills"
        />
        <StatCard 
          icon={DollarSign}
          title="Pending Payment"
          value={`₹${billingSummary.pendingAmount.toFixed(2)}`}
          color="bg-orange-500"
          subtitle="Outstanding"
        />
        <StatCard 
          icon={Calendar}
          title="Appointments"
          value={appointments.total}
          color="bg-purple-500"
          subtitle={`${appointments.upcomingCount} upcoming`}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <TabButton
              active={activeTab === 'bills'}
              onClick={() => setActiveTab('bills')}
              icon={DollarSign}
              label="Bills & Payments"
              count={billingSummary.billingRecords.length}
            />
            <TabButton
              active={activeTab === 'records'}
              onClick={() => setActiveTab('records')}
              icon={FileText}
              label="Medical Records"
              count={medicalRecords.length}
            />
            <TabButton
              active={activeTab === 'prescriptions'}
              onClick={() => setActiveTab('prescriptions')}
              icon={Pill}
              label="Prescriptions"
              count={prescriptions.length}
            />
            <TabButton
              active={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
              icon={Calendar}
              label="Appointments"
              count={appointments.total}
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'bills' && <BillsTab billingRecords={billingSummary.billingRecords} />}
          {activeTab === 'records' && <MedicalRecordsTab records={medicalRecords} />}
          {activeTab === 'prescriptions' && <PrescriptionsTab prescriptions={prescriptions} />}
          {activeTab === 'appointments' && <AppointmentsTab appointments={appointments.all} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
        active
          ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {count > 0 && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function BillsTab({ billingRecords }) {
  if (billingRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No billing records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice #</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Services</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {billingRecords.map(bill => (
            <tr key={bill.BillingID} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                {bill.InvoiceNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(bill.BillingDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {bill.Appointment?.Doctor ? 
                  `Dr. ${bill.Appointment.Doctor.FirstName} ${bill.Appointment.Doctor.LastName}` : 
                  'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {bill.Items?.map(item => item.description).join(', ') || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                ₹{parseFloat(bill.NetAmount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  bill.Status === 'Paid' ? 'bg-green-100 text-green-700' :
                  bill.Status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {bill.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicalRecordsTab({ records }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No medical records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map(record => (
        <div key={record.RecordID} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Visit on {new Date(record.VisitDate).toLocaleDateString()}
              </h3>
              <p className="text-sm text-gray-600">
                Dr. {record.Doctor?.FirstName} {record.Doctor?.LastName}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {record.Appointment?.AppointmentDate}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms:</p>
              <p className="text-sm text-gray-600">{record.Symptoms || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Diagnosis:</p>
              <p className="text-sm text-gray-600">{record.Diagnosis || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Treatment Plan:</p>
            <p className="text-sm text-gray-600">{record.TreatmentPlan || 'N/A'}</p>
          </div>

          {record.VitalSigns && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Vital Signs:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {record.VitalSigns.bloodPressure && (
                  <div>
                    <span className="text-gray-500">BP:</span>
                    <span className="ml-2 font-medium">{record.VitalSigns.bloodPressure}</span>
                  </div>
                )}
                {record.VitalSigns.temperature && (
                  <div>
                    <span className="text-gray-500">Temp:</span>
                    <span className="ml-2 font-medium">{record.VitalSigns.temperature}°F</span>
                  </div>
                )}
                {record.VitalSigns.pulse && (
                  <div>
                    <span className="text-gray-500">Pulse:</span>
                    <span className="ml-2 font-medium">{record.VitalSigns.pulse} bpm</span>
                  </div>
                )}
                {record.VitalSigns.weight && (
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 font-medium">{record.VitalSigns.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PrescriptionsTab({ prescriptions }) {
  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No prescriptions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map(prescription => (
        <div key={prescription.PrescriptionID} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Prescription from Dr. {prescription.Doctor?.FirstName} {prescription.Doctor?.LastName}
              </h3>
              <p className="text-sm text-gray-600">
                Date: {new Date(prescription.PrescriptionDate).toLocaleDateString()}
              </p>
              {prescription.ValidUntil && (
                <p className="text-sm text-gray-600">
                  Valid until: {prescription.ValidUntil}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              prescription.Status === 'Active' ? 'bg-green-100 text-green-700' :
              prescription.Status === 'Completed' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {prescription.Status}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Medications:</p>
            {prescription.Medications?.map((med, idx) => (
              <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">{med.name}</p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">Dosage:</span>
                    <span className="ml-1 font-medium">{med.dosage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <span className="ml-1 font-medium">{med.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-1 font-medium">{med.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {prescription.Instructions && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-1">Instructions:</p>
              <p className="text-sm text-gray-600">{prescription.Instructions}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AppointmentsTab({ appointments }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Specialization</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {appointments.map(appt => (
            <tr key={appt.AppointmentID} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{appt.AppointmentDate}</p>
                <p className="text-xs text-gray-500">{appt.AppointmentTime}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Dr. {appt.Doctor?.FirstName} {appt.Doctor?.LastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {appt.Doctor?.Specialization?.SpecializationName || 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {appt.Reason || 'General Consultation'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
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
  );
}
