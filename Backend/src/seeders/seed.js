// ============================================
// src/seeders/seed.js - Simplified (No Auth, No Clinics)
// ============================================
require('dotenv').config();
const { 
  sequelize, 
  Patient, 
  Doctor, 
  Staff, 
  Specialization, 
  Department,
  Appointment, 
  MedicalRecord, 
  Prescription, 
  Billing, 
  Payment 
} = require('../models');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database schema created\n');

    // 1. Create Specializations
    console.log('📋 Creating specializations...');
    const specializations = await Specialization.bulkCreate([
      { SpecializationName: 'Cardiology', Description: 'Heart and cardiovascular system' },
      { SpecializationName: 'Dermatology', Description: 'Skin, hair, and nails' },
      { SpecializationName: 'Pediatrics', Description: 'Medical care of infants and children' },
      { SpecializationName: 'Orthopedics', Description: 'Bones, joints, and muscles' },
      { SpecializationName: 'Neurology', Description: 'Nervous system and brain' },
      { SpecializationName: 'General Medicine', Description: 'General medical care' }
    ]);
    console.log(`✅ Created ${specializations.length} specializations\n`);

    // 2. Create Departments
    console.log('🏥 Creating departments...');
    const departments = await Department.bulkCreate([
      { DepartmentName: 'Emergency', Description: 'Emergency medical services' },
      { DepartmentName: 'Outpatient', Description: 'Outpatient consultation' },
      { DepartmentName: 'Inpatient', Description: 'Inpatient care' },
      { DepartmentName: 'Laboratory', Description: 'Medical tests and diagnostics' },
      { DepartmentName: 'Pharmacy', Description: 'Medication dispensing' },
      { DepartmentName: 'Administration', Description: 'Hospital administration' }
    ]);
    console.log(`✅ Created ${departments.length} departments\n`);

    // 3. Create Doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctors = await Doctor.bulkCreate([
      {
        FirstName: 'Rajesh',
        LastName: 'Kumar',
        ContactNumber: '9876543210',
        Email: 'rajesh.kumar@hospital.com',
        SpecializationID: specializations[0].SpecializationID,
        DepartmentID: departments[1].DepartmentID,
        LicenseNumber: 'MD-2015-0001',
        Qualification: 'MD (Cardiology)',
        ExperienceYears: 15,
        ConsultationFee: 1000
      },
      {
        FirstName: 'Priya',
        LastName: 'Sharma',
        ContactNumber: '9876543211',
        Email: 'priya.sharma@hospital.com',
        SpecializationID: specializations[1].SpecializationID,
        DepartmentID: departments[1].DepartmentID,
        LicenseNumber: 'MD-2018-0002',
        Qualification: 'MD (Dermatology)',
        ExperienceYears: 8,
        ConsultationFee: 800
      },
      {
        FirstName: 'Amit',
        LastName: 'Patel',
        ContactNumber: '9876543212',
        Email: 'amit.patel@hospital.com',
        SpecializationID: specializations[2].SpecializationID,
        DepartmentID: departments[1].DepartmentID,
        LicenseNumber: 'MD-2017-0003',
        Qualification: 'MD (Pediatrics)',
        ExperienceYears: 10,
        ConsultationFee: 700
      },
      {
        FirstName: 'Sneha',
        LastName: 'Reddy',
        ContactNumber: '9876543213',
        Email: 'sneha.reddy@hospital.com',
        SpecializationID: specializations[3].SpecializationID,
        DepartmentID: departments[1].DepartmentID,
        LicenseNumber: 'MD-2016-0004',
        Qualification: 'MS (Orthopedics)',
        ExperienceYears: 12,
        ConsultationFee: 900
      },
      {
        FirstName: 'Vikram',
        LastName: 'Singh',
        ContactNumber: '9876543214',
        Email: 'vikram.singh@hospital.com',
        SpecializationID: specializations[4].SpecializationID,
        DepartmentID: departments[1].DepartmentID,
        LicenseNumber: 'MD-2014-0005',
        Qualification: 'DM (Neurology)',
        ExperienceYears: 18,
        ConsultationFee: 1200
      },
      {
        FirstName: 'Anjali',
        LastName: 'Verma',
        ContactNumber: '9876543215',
        Email: 'anjali.verma@hospital.com',
        SpecializationID: specializations[5].SpecializationID,
        DepartmentID: departments[0].DepartmentID,
        LicenseNumber: 'MD-2019-0006',
        Qualification: 'MBBS, MD',
        ExperienceYears: 6,
        ConsultationFee: 600
      }
    ]);
    console.log(`✅ Created ${doctors.length} doctors\n`);

    // 4. Create Staff
    console.log('👔 Creating staff members...');
    const staff = await Staff.bulkCreate([
      {
        FirstName: 'Ramesh',
        LastName: 'Nair',
        ContactNumber: '9123456780',
        Email: 'ramesh.nair@hospital.com',
        DepartmentID: departments[5].DepartmentID,
        Position: 'Receptionist',
        JoiningDate: '2020-01-15'
      },
      {
        FirstName: 'Lakshmi',
        LastName: 'Iyer',
        ContactNumber: '9123456781',
        Email: 'lakshmi.iyer@hospital.com',
        DepartmentID: departments[5].DepartmentID,
        Position: 'Accountant',
        JoiningDate: '2019-06-10'
      },
      {
        FirstName: 'Suresh',
        LastName: 'Menon',
        ContactNumber: '9123456782',
        Email: 'suresh.menon@hospital.com',
        DepartmentID: departments[4].DepartmentID,
        Position: 'Pharmacist',
        JoiningDate: '2018-03-20'
      }
    ]);
    console.log(`✅ Created ${staff.length} staff members\n`);

    // 5. Create Patients
    console.log('👥 Creating patients...');
    const patients = await Patient.bulkCreate([
      {
        FirstName: 'Arun',
        LastName: 'Krishnan',
        DateOfBirth: '1990-05-15',
        Gender: 'Male',
        BloodGroup: 'O+',
        ContactNumber: '9234567890',
        Email: 'arun.k@example.com',
        Address: '123, MG Road, Bangalore, Karnataka',
        EmergencyContact: 'Kavita Krishnan',
        EmergencyContactNumber: '9234567891'
      },
      {
        FirstName: 'Meera',
        LastName: 'Nambiar',
        DateOfBirth: '1985-08-22',
        Gender: 'Female',
        BloodGroup: 'A+',
        ContactNumber: '9234567892',
        Email: 'meera.n@example.com',
        Address: '456, Brigade Road, Bangalore, Karnataka',
        EmergencyContact: 'Ravi Nambiar',
        EmergencyContactNumber: '9234567893'
      },
      {
        FirstName: 'Karthik',
        LastName: 'Rao',
        DateOfBirth: '1992-03-10',
        Gender: 'Male',
        BloodGroup: 'B+',
        ContactNumber: '9234567894',
        Email: 'karthik.r@example.com',
        Address: '789, Indiranagar, Bangalore, Karnataka',
        EmergencyContact: 'Priya Rao',
        EmergencyContactNumber: '9234567895'
      },
      {
        FirstName: 'Divya',
        LastName: 'Menon',
        DateOfBirth: '1988-11-30',
        Gender: 'Female',
        BloodGroup: 'AB+',
        ContactNumber: '9234567896',
        Email: 'divya.m@example.com',
        Address: '321, Koramangala, Bangalore, Karnataka',
        EmergencyContact: 'Suresh Menon',
        EmergencyContactNumber: '9234567897'
      },
      {
        FirstName: 'Rahul',
        LastName: 'Pillai',
        DateOfBirth: '1995-07-18',
        Gender: 'Male',
        BloodGroup: 'O-',
        ContactNumber: '9234567898',
        Email: 'rahul.p@example.com',
        Address: '654, Whitefield, Bangalore, Karnataka',
        EmergencyContact: 'Anjali Pillai',
        EmergencyContactNumber: '9234567899'
      },
      {
        FirstName: 'Pooja',
        LastName: 'Desai',
        DateOfBirth: '1993-12-05',
        Gender: 'Female',
        BloodGroup: 'A-',
        ContactNumber: '9234567800',
        Email: 'pooja.d@example.com',
        Address: '987, Jayanagar, Bangalore, Karnataka',
        EmergencyContact: 'Vikram Desai',
        EmergencyContactNumber: '9234567801'
      },
      {
        FirstName: 'Sanjay',
        LastName: 'Kumar',
        DateOfBirth: '1987-02-14',
        Gender: 'Male',
        BloodGroup: 'B-',
        ContactNumber: '9234567802',
        Email: 'sanjay.k@example.com',
        Address: '111, Electronic City, Bangalore, Karnataka',
        EmergencyContact: 'Rekha Kumar',
        EmergencyContactNumber: '9234567803'
      },
      {
        FirstName: 'Neha',
        LastName: 'Singh',
        DateOfBirth: '1991-09-25',
        Gender: 'Female',
        BloodGroup: 'O+',
        ContactNumber: '9234567804',
        Email: 'neha.s@example.com',
        Address: '222, HSR Layout, Bangalore, Karnataka',
        EmergencyContact: 'Amit Singh',
        EmergencyContactNumber: '9234567805'
      },
      {
        FirstName: 'Ravi',
        LastName: 'Sharma',
        DateOfBirth: '1989-06-30',
        Gender: 'Male',
        BloodGroup: 'A+',
        ContactNumber: '9234567806',
        Email: 'ravi.s@example.com',
        Address: '333, BTM Layout, Bangalore, Karnataka',
        EmergencyContact: 'Sunita Sharma',
        EmergencyContactNumber: '9234567807'
      },
      {
        FirstName: 'Priya',
        LastName: 'Reddy',
        DateOfBirth: '1994-04-12',
        Gender: 'Female',
        BloodGroup: 'AB-',
        ContactNumber: '9234567808',
        Email: 'priya.r@example.com',
        Address: '444, Marathahalli, Bangalore, Karnataka',
        EmergencyContact: 'Venkat Reddy',
        EmergencyContactNumber: '9234567809'
      },
      {
        FirstName: 'Vijay',
        LastName: 'Patel',
        DateOfBirth: '1986-11-08',
        Gender: 'Male',
        BloodGroup: 'O-',
        ContactNumber: '9234567810',
        Email: 'vijay.p@example.com',
        Address: '555, Yelahanka, Bangalore, Karnataka',
        EmergencyContact: 'Kavita Patel',
        EmergencyContactNumber: '9234567811'
      },
      {
        FirstName: 'Ananya',
        LastName: 'Iyer',
        DateOfBirth: '1996-01-20',
        Gender: 'Female',
        BloodGroup: 'B+',
        ContactNumber: '9234567812',
        Email: 'ananya.i@example.com',
        Address: '666, Malleshwaram, Bangalore, Karnataka',
        EmergencyContact: 'Ramesh Iyer',
        EmergencyContactNumber: '9234567813'
      }
    ], { individualHooks: true });
    console.log(`✅ Created ${patients.length} patients\n`);

    // 6. Create Appointments (Simplified - No Clinics)
    console.log('📅 Creating appointments...');
    
    // Dynamic dates relative to today (Nov 13, 2025)
    const today = new Date('2025-11-13');
    
    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // Calculate dates
    const nov13 = formatDate(today); // Today
    const nov12 = formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)); // Yesterday
    const nov11 = formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000));
    const nov10 = formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000));
    const nov05 = formatDate(new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000));
    const oct28 = formatDate(new Date(today.getTime() - 16 * 24 * 60 * 60 * 1000));
    const oct20 = formatDate(new Date(today.getTime() - 24 * 24 * 60 * 60 * 1000));
    const oct10 = formatDate(new Date(today.getTime() - 34 * 24 * 60 * 60 * 1000));
    const sep25 = formatDate(new Date(today.getTime() - 49 * 24 * 60 * 60 * 1000));
    const sep10 = formatDate(new Date(today.getTime() - 64 * 24 * 60 * 60 * 1000));
    
    // Future dates
    const nov14 = formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)); // Tomorrow
    const nov15 = formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000));
    const nov16 = formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000));
    const nov17 = formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000));
    const nov20 = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

    const appointments = await Appointment.bulkCreate([
      // Dr. Rajesh Kumar (Cardiologist) - 8 appointments
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: sep10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Initial cardiac consultation', Notes: 'First visit - chest pain complaints' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Follow-up ECG results', Notes: 'Monitoring progress' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: oct20, AppointmentTime: '11:30:00', Status: 'Completed', Reason: 'Heart palpitations', Notes: 'Regular heart checkup' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov05, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Hypertension check', Notes: 'Blood pressure monitoring' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Monthly cardiac checkup', Notes: 'Regular monitoring - 3rd visit' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov12, AppointmentTime: '11:00:00', Status: 'No Show', Reason: 'Chest discomfort', Notes: 'Patient did not show up' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:00:00', Status: 'Confirmed', Reason: 'Follow-up palpitations', Notes: 'Second visit - review medication' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov13, AppointmentTime: '14:30:00', Status: 'Scheduled', Reason: 'Cardiac screening', Notes: 'Family history of heart disease' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov14, AppointmentTime: '09:30:00', Status: 'Scheduled', Reason: 'Hypertension follow-up', Notes: 'Check BP readings' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov15, AppointmentTime: '11:00:00', Status: 'Scheduled', Reason: 'General cardiac checkup', Notes: 'Annual screening' },

      // Dr. Priya Sharma (Dermatologist) - 8 appointments
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: sep25, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Initial skin consultation', Notes: 'First visit for skin rash' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: oct28, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'Skin allergy test follow-up', Notes: 'Second visit - reviewing test results' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: oct10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Acne consultation', Notes: 'Initial visit for acne treatment' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov05, AppointmentTime: '15:00:00', Status: 'Completed', Reason: 'Acne treatment follow-up', Notes: 'Second visit - progress check' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:30:00', Status: 'Completed', Reason: 'Skin rash recurrence', Notes: 'Third visit - rash returned' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov12, AppointmentTime: '13:00:00', Status: 'Cancelled', Reason: 'Eczema consultation', Notes: 'Patient cancelled - rescheduled' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:00:00', Status: 'Confirmed', Reason: 'Acne progress review', Notes: 'Third visit - treatment effectiveness' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Skin mole examination', Notes: 'Routine skin check' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov14, AppointmentTime: '14:00:00', Status: 'Scheduled', Reason: 'Skin allergy consultation', Notes: 'New patient evaluation' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov16, AppointmentTime: '10:30:00', Status: 'Scheduled', Reason: 'Hair loss consultation', Notes: 'Dermatology evaluation' },

      // Dr. Amit Patel (Pediatrician) - 7 appointments
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: sep10, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'First prenatal visit', Notes: 'Initial pregnancy consultation' },
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: oct10, AppointmentTime: '09:30:00', Status: 'Completed', Reason: 'Second prenatal checkup', Notes: 'Regular monitoring' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Child vaccination', Notes: 'Routine immunization' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov10, AppointmentTime: '15:30:00', Status: 'Completed', Reason: 'Flu symptoms', Notes: 'Fever and cold for 3 days' },
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov12, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Third trimester checkup', Notes: 'Regular prenatal monitoring' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov13, AppointmentTime: '11:00:00', Status: 'Confirmed', Reason: 'Follow-up vaccination', Notes: 'Second vaccination appointment' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov13, AppointmentTime: '14:00:00', Status: 'Scheduled', Reason: 'Flu follow-up', Notes: 'Check recovery progress' },
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov15, AppointmentTime: '09:00:00', Status: 'Scheduled', Reason: 'Prenatal ultrasound', Notes: 'Third trimester scan' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov17, AppointmentTime: '10:30:00', Status: 'Scheduled', Reason: 'Child health checkup', Notes: 'Routine pediatric visit' },

      // Dr. Sneha Reddy (Orthopedics) - 8 appointments
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: sep25, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Initial back pain consultation', Notes: 'First visit - chronic pain' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Back pain follow-up', Notes: 'MRI results review' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: oct28, AppointmentTime: '15:00:00', Status: 'Completed', Reason: 'Knee pain initial visit', Notes: 'Jogging injury' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov05, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'Shoulder pain', Notes: 'Sports injury consultation' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Physiotherapy review', Notes: 'Third visit - progress evaluation' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov12, AppointmentTime: '15:00:00', Status: 'Completed', Reason: 'Knee pain follow-up', Notes: 'Second visit - check healing' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:30:00', Status: 'Confirmed', Reason: 'Shoulder physiotherapy', Notes: 'Second visit - treatment plan' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Hip pain consultation', Notes: 'New patient' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov14, AppointmentTime: '13:00:00', Status: 'Scheduled', Reason: 'Wrist pain evaluation', Notes: 'Possible carpal tunnel' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov16, AppointmentTime: '15:30:00', Status: 'Scheduled', Reason: 'Ankle sprain follow-up', Notes: 'Check healing progress' },

      // Dr. Vikram Singh (Neurology) - 8 appointments
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: sep10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Initial migraine consultation', Notes: 'First visit - frequent headaches' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:30:00', Status: 'Completed', Reason: 'Migraine medication review', Notes: 'Second visit - treatment adjustment' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: oct20, AppointmentTime: '13:00:00', Status: 'Completed', Reason: 'Memory issues consultation', Notes: 'Initial cognitive assessment' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov05, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Dizziness episodes', Notes: 'Neurological examination' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:30:00', Status: 'Completed', Reason: 'Monthly migraine follow-up', Notes: 'Third visit - progress check' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov12, AppointmentTime: '13:00:00', Status: 'Completed', Reason: 'Memory test results', Notes: 'Second visit - discuss findings' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov13, AppointmentTime: '11:00:00', Status: 'Confirmed', Reason: 'Dizziness follow-up', Notes: 'Second visit - medication review' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov13, AppointmentTime: '15:30:00', Status: 'Scheduled', Reason: 'Seizure consultation', Notes: 'New patient - urgent' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov15, AppointmentTime: '10:00:00', Status: 'Scheduled', Reason: 'Chronic headache evaluation', Notes: 'New patient consultation' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov20, AppointmentTime: '14:00:00', Status: 'Scheduled', Reason: 'Migraine follow-up', Notes: 'Regular check-in' },

      // Dr. Anjali Verma (General Medicine) - 8 appointments
      { PatientID: patients[0].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: sep25, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Annual health screening', Notes: 'Routine checkup' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Fever and fatigue', Notes: 'Viral infection symptoms' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Fever follow-up', Notes: 'Second visit - recovery check' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct28, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'General health checkup', Notes: 'Wellness visit' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov11, AppointmentTime: '08:30:00', Status: 'Completed', Reason: 'Follow-up health screening', Notes: 'Blood test results reviewed' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov11, AppointmentTime: '14:30:00', Status: 'Completed', Reason: 'Abdominal pain', Notes: 'Prescribed medication' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov13, AppointmentTime: '09:00:00', Status: 'Confirmed', Reason: 'Post-recovery checkup', Notes: 'Third visit - final assessment' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Diabetes screening', Notes: 'Preventive care' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov14, AppointmentTime: '10:00:00', Status: 'Scheduled', Reason: 'General consultation', Notes: 'Fatigue and weakness' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov17, AppointmentTime: '11:30:00', Status: 'Scheduled', Reason: 'Annual physical exam', Notes: 'Comprehensive checkup' }
    ]);
    console.log(`✅ Created ${appointments.length} appointments\n`);

    // 7. Create Medical Records
    console.log('📋 Creating medical records...');
    const medicalRecords = await MedicalRecord.bulkCreate([
      // Patient 0 (Arun) - Cardiac patient with history
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentID: appointments[0].AppointmentID,
        VisitDate: '2025-09-10 09:00:00',
        Symptoms: 'Chest pain, shortness of breath during exercise',
        Diagnosis: 'Mild angina, requires monitoring',
        TreatmentPlan: 'ECG ordered, lifestyle modifications, medication prescribed',
        Notes: 'Patient advised to reduce stress and maintain regular exercise',
        VitalSigns: { bloodPressure: '140/90', temperature: '98.6', pulse: '78', weight: '75kg', height: '172cm' }
      },
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentID: appointments[1].AppointmentID,
        VisitDate: '2025-10-10 10:00:00',
        Symptoms: 'Follow-up visit, occasional chest discomfort',
        Diagnosis: 'Stable angina, ECG shows improvement',
        TreatmentPlan: 'Continue current medication, monthly follow-ups',
        Notes: 'Patient responding well to treatment',
        VitalSigns: { bloodPressure: '135/85', temperature: '98.4', pulse: '72', weight: '74kg', height: '172cm' }
      },
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentID: appointments[39].AppointmentID,
        VisitDate: '2025-09-25 09:00:00',
        Symptoms: 'General fatigue, routine screening',
        Diagnosis: 'Overall health good, slight vitamin D deficiency',
        TreatmentPlan: 'Vitamin D supplements, balanced diet',
        Notes: 'Annual health checkup completed',
        VitalSigns: { bloodPressure: '138/88', temperature: '98.6', pulse: '75', weight: '75kg', height: '172cm' }
      },

      // Patient 1 (Meera) - Dermatology patient with skin issues
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        AppointmentID: appointments[8].AppointmentID,
        VisitDate: '2025-09-25 10:00:00',
        Symptoms: 'Itchy rash on arms and legs, persistent for 2 weeks',
        Diagnosis: 'Allergic contact dermatitis',
        TreatmentPlan: 'Allergy testing scheduled, topical corticosteroid cream prescribed',
        Notes: 'Patient advised to avoid common allergens',
        VitalSigns: { bloodPressure: '120/80', temperature: '98.2', pulse: '70', weight: '62kg', height: '165cm' }
      },
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        AppointmentID: appointments[9].AppointmentID,
        VisitDate: '2025-10-28 11:00:00',
        Symptoms: 'Rash improved but not completely healed',
        Diagnosis: 'Allergic dermatitis improving, positive reaction to nickel',
        TreatmentPlan: 'Continue topical treatment, avoid nickel jewelry',
        Notes: 'Allergy test results reviewed with patient',
        VitalSigns: { bloodPressure: '118/78', temperature: '98.4', pulse: '68', weight: '62kg', height: '165cm' }
      },

      // Patient 2 (Karthik) - Pediatric patient (child vaccination)
      {
        PatientID: patients[2].PatientID,
        DoctorID: doctors[2].DoctorID,
        AppointmentID: appointments[18].AppointmentID,
        VisitDate: '2025-10-20 14:00:00',
        Symptoms: 'Routine vaccination visit',
        Diagnosis: 'Healthy child, growth normal',
        TreatmentPlan: 'MMR vaccine administered',
        Notes: 'No adverse reactions, next vaccination in 2 months',
        VitalSigns: { temperature: '98.0', pulse: '90', weight: '18kg', height: '110cm' }
      },

      // Patient 3 (Divya) - Orthopedic patient with knee pain
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentID: appointments[26].AppointmentID,
        VisitDate: '2025-10-28 15:00:00',
        Symptoms: 'Knee pain after jogging, swelling',
        Diagnosis: 'Runner\'s knee (Patellofemoral pain syndrome)',
        TreatmentPlan: 'Rest, ice therapy, physiotherapy exercises, NSAIDs',
        Notes: 'Patient advised to reduce running intensity',
        VitalSigns: { bloodPressure: '125/82', temperature: '98.4', pulse: '70', weight: '58kg', height: '168cm' }
      },

      // Patient 4 (Rahul) - Neurology patient with migraines
      {
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        AppointmentID: appointments[32].AppointmentID,
        VisitDate: '2025-09-10 09:00:00',
        Symptoms: 'Severe headaches 3-4 times per week, sensitivity to light',
        Diagnosis: 'Chronic migraine with aura',
        TreatmentPlan: 'Preventive medication prescribed, lifestyle diary recommended',
        Notes: 'MRI scheduled to rule out other causes',
        VitalSigns: { bloodPressure: '130/85', temperature: '98.6', pulse: '72', weight: '70kg', height: '175cm' }
      },
      {
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        AppointmentID: appointments[33].AppointmentID,
        VisitDate: '2025-10-10 10:30:00',
        Symptoms: 'Migraine frequency reduced to 2 times per week',
        Diagnosis: 'Chronic migraine improving with treatment',
        TreatmentPlan: 'Continue current medication, adjust dosage',
        Notes: 'MRI results normal, continue monitoring',
        VitalSigns: { bloodPressure: '128/83', temperature: '98.4', pulse: '70', weight: '70kg', height: '175cm' }
      },

      // Patient 5 (Pooja) - General Medicine patient with fever
      {
        PatientID: patients[5].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentID: appointments[40].AppointmentID,
        VisitDate: '2025-10-10 10:00:00',
        Symptoms: 'High fever (101°F), body aches, fatigue for 2 days',
        Diagnosis: 'Viral fever, suspected influenza',
        TreatmentPlan: 'Antipyretics, rest, hydration, symptomatic treatment',
        Notes: 'Follow up if symptoms persist beyond 5 days',
        VitalSigns: { bloodPressure: '122/80', temperature: '101.2', pulse: '88', weight: '60kg', height: '163cm' }
      },
      {
        PatientID: patients[5].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentID: appointments[41].AppointmentID,
        VisitDate: '2025-10-20 14:00:00',
        Symptoms: 'Fever resolved, feeling much better',
        Diagnosis: 'Recovered from viral fever',
        TreatmentPlan: 'No further treatment needed',
        Notes: 'Complete recovery achieved',
        VitalSigns: { bloodPressure: '120/78', temperature: '98.4', pulse: '72', weight: '60kg', height: '163cm' }
      },
      {
        PatientID: patients[5].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentID: appointments[3].AppointmentID,
        VisitDate: '2025-11-05 14:00:00',
        Symptoms: 'High blood pressure reading at home',
        Diagnosis: 'Stage 1 Hypertension',
        TreatmentPlan: 'Lifestyle modifications, low-salt diet, exercise, monitor BP daily',
        Notes: 'Will consider medication if lifestyle changes insufficient',
        VitalSigns: { bloodPressure: '145/92', temperature: '98.6', pulse: '76', weight: '61kg', height: '163cm' }
      },

      // Patient 6 (Sanjay) - Cardiac and Neurology patient
      {
        PatientID: patients[6].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentID: appointments[2].AppointmentID,
        VisitDate: '2025-10-20 11:30:00',
        Symptoms: 'Heart palpitations, irregular heartbeat',
        Diagnosis: 'Premature ventricular contractions (PVCs)',
        TreatmentPlan: 'Holter monitor test, reduce caffeine intake',
        Notes: 'Mostly benign but requires monitoring',
        VitalSigns: { bloodPressure: '138/88', temperature: '98.6', pulse: '82', weight: '78kg', height: '178cm' }
      },
      {
        PatientID: patients[6].PatientID,
        DoctorID: doctors[4].DoctorID,
        AppointmentID: appointments[35].AppointmentID,
        VisitDate: '2025-11-05 14:00:00',
        Symptoms: 'Episodes of dizziness, especially when standing',
        Diagnosis: 'Orthostatic hypotension',
        TreatmentPlan: 'Increase fluid and salt intake, compression stockings',
        Notes: 'Related to blood pressure regulation',
        VitalSigns: { bloodPressure: '110/70', temperature: '98.4', pulse: '78', weight: '78kg', height: '178cm' }
      },

      // Patient 7 (Neha) - Prenatal care patient
      {
        PatientID: patients[7].PatientID,
        DoctorID: doctors[2].DoctorID,
        AppointmentID: appointments[15].AppointmentID,
        VisitDate: '2025-09-10 11:00:00',
        Symptoms: 'First trimester of pregnancy, morning sickness',
        Diagnosis: 'Normal first trimester pregnancy',
        TreatmentPlan: 'Prenatal vitamins, regular checkups, dietary advice',
        Notes: 'Expected delivery date: May 2026',
        VitalSigns: { bloodPressure: '118/75', temperature: '98.6', pulse: '75', weight: '58kg', height: '162cm' }
      },
      {
        PatientID: patients[7].PatientID,
        DoctorID: doctors[2].DoctorID,
        AppointmentID: appointments[16].AppointmentID,
        VisitDate: '2025-10-10 09:30:00',
        Symptoms: 'Morning sickness improved, feeling better',
        Diagnosis: 'Normal second trimester progression',
        TreatmentPlan: 'Continue prenatal care, ultrasound scheduled',
        Notes: 'Baby developing normally',
        VitalSigns: { bloodPressure: '120/76', temperature: '98.4', pulse: '76', weight: '60kg', height: '162cm' }
      },

      // Patient 8 (Ravi) - Orthopedic patient with chronic back pain
      {
        PatientID: patients[8].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentID: appointments[23].AppointmentID,
        VisitDate: '2025-09-25 10:00:00',
        Symptoms: 'Lower back pain for 6 months, radiating to legs',
        Diagnosis: 'Lumbar disc herniation L4-L5',
        TreatmentPlan: 'MRI ordered, physiotherapy, pain management',
        Notes: 'Patient may need epidural injection if conservative treatment fails',
        VitalSigns: { bloodPressure: '132/84', temperature: '98.4', pulse: '74', weight: '82kg', height: '180cm' }
      },
      {
        PatientID: patients[8].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentID: appointments[24].AppointmentID,
        VisitDate: '2025-10-20 14:00:00',
        Symptoms: 'Back pain improved with physiotherapy',
        Diagnosis: 'Lumbar disc herniation - responding to conservative treatment',
        TreatmentPlan: 'Continue physiotherapy, strengthen core muscles',
        Notes: 'MRI shows mild improvement, avoid surgery for now',
        VitalSigns: { bloodPressure: '130/82', temperature: '98.6', pulse: '72', weight: '81kg', height: '180cm' }
      },

      // Patient 9 (Priya) - Dermatology patient with acne
      {
        PatientID: patients[9].PatientID,
        DoctorID: doctors[1].DoctorID,
        AppointmentID: appointments[10].AppointmentID,
        VisitDate: '2025-10-10 09:00:00',
        Symptoms: 'Severe acne on face and back',
        Diagnosis: 'Moderate to severe acne vulgaris',
        TreatmentPlan: 'Topical retinoids, benzoyl peroxide, antibiotic cream',
        Notes: 'Consider oral medication if no improvement in 8 weeks',
        VitalSigns: { bloodPressure: '118/76', temperature: '98.2', pulse: '68', weight: '55kg', height: '160cm' }
      },
      {
        PatientID: patients[9].PatientID,
        DoctorID: doctors[1].DoctorID,
        AppointmentID: appointments[11].AppointmentID,
        VisitDate: '2025-11-05 15:00:00',
        Symptoms: 'Acne showing some improvement',
        Diagnosis: 'Acne vulgaris - partial response to treatment',
        TreatmentPlan: 'Continue current regimen, adjust dosage',
        Notes: 'Patient compliance good, skin clearing gradually',
        VitalSigns: { bloodPressure: '116/74', temperature: '98.4', pulse: '70', weight: '55kg', height: '160cm' }
      },
      {
        PatientID: patients[9].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentID: appointments[42].AppointmentID,
        VisitDate: '2025-10-28 11:00:00',
        Symptoms: 'General wellness checkup',
        Diagnosis: 'Overall health excellent',
        TreatmentPlan: 'Maintain healthy lifestyle',
        Notes: 'Routine checkup - all parameters normal',
        VitalSigns: { bloodPressure: '115/75', temperature: '98.4', pulse: '68', weight: '55kg', height: '160cm' }
      },

      // Patient 10 (Vijay) - Neurology and Orthopedic patient
      {
        PatientID: patients[10].PatientID,
        DoctorID: doctors[4].DoctorID,
        AppointmentID: appointments[34].AppointmentID,
        VisitDate: '2025-10-20 13:00:00',
        Symptoms: 'Memory lapses, difficulty concentrating',
        Diagnosis: 'Mild cognitive impairment, stress-related',
        TreatmentPlan: 'Cognitive testing, stress management, sleep hygiene',
        Notes: 'Likely related to work stress, not dementia',
        VitalSigns: { bloodPressure: '135/88', temperature: '98.6', pulse: '76', weight: '85kg', height: '182cm' }
      },
      {
        PatientID: patients[10].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentID: appointments[27].AppointmentID,
        VisitDate: '2025-11-05 11:00:00',
        Symptoms: 'Shoulder pain after playing sports',
        Diagnosis: 'Rotator cuff strain',
        TreatmentPlan: 'Rest, ice, physiotherapy, avoid overhead activities',
        Notes: 'Sports injury, should heal with conservative treatment',
        VitalSigns: { bloodPressure: '133/86', temperature: '98.4', pulse: '74', weight: '85kg', height: '182cm' }
      },

      // Patient 11 (Ananya) - Recent flu patient
      {
        PatientID: patients[11].PatientID,
        DoctorID: doctors[2].DoctorID,
        AppointmentID: appointments[19].AppointmentID,
        VisitDate: '2025-11-10 15:30:00',
        Symptoms: 'High fever, cough, body aches for 3 days',
        Diagnosis: 'Influenza A',
        TreatmentPlan: 'Antiviral medication, rest, fluids, symptomatic treatment',
        Notes: 'Advised isolation for 5 days',
        VitalSigns: { bloodPressure: '120/78', temperature: '102.4', pulse: '92', weight: '52kg', height: '158cm' }
      },

      // Nov 11 (completed yesterday) - Patient 0
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        VisitDate: nov11 + ' 08:30:00',
        Symptoms: 'Follow-up for general health',
        Diagnosis: 'Blood test results normal, vitamin D levels improved',
        TreatmentPlan: 'Continue vitamin supplements, maintain healthy diet',
        Notes: 'Patient responding well to lifestyle changes',
        VitalSigns: { bloodPressure: '132/84', temperature: '98.6', pulse: '74', weight: '74kg', height: '172cm' }
      },

      // Nov 11 - Patient 11 abdominal pain
      {
        PatientID: patients[11].PatientID,
        DoctorID: doctors[5].DoctorID,
        VisitDate: nov11 + ' 14:30:00',
        Symptoms: 'Abdominal pain, mild cramping',
        Diagnosis: 'Gastritis',
        TreatmentPlan: 'Antacids, dietary modifications, avoid spicy foods',
        Notes: 'Should improve within a week',
        VitalSigns: { bloodPressure: '118/76', temperature: '98.4', pulse: '78', weight: '52kg', height: '158cm' }
      },

      // Nov 12 (yesterday) - Patient 0 cardiac
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        VisitDate: nov12 + ' 09:00:00',
        Symptoms: 'Routine cardiac checkup, feeling well',
        Diagnosis: 'Stable angina, good progress',
        TreatmentPlan: 'Continue current medications, regular monitoring',
        Notes: 'Patient doing very well, no new concerns',
        VitalSigns: { bloodPressure: '130/82', temperature: '98.6', pulse: '70', weight: '73kg', height: '172cm' }
      },

      // Nov 12 - Patient 1 dermatology
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        VisitDate: nov12 + ' 09:30:00',
        Symptoms: 'Skin rash returned on arms',
        Diagnosis: 'Recurring allergic dermatitis',
        TreatmentPlan: 'Adjusted medication, stronger topical cream',
        Notes: 'Patient needs to be more careful with allergen avoidance',
        VitalSigns: { bloodPressure: '120/78', temperature: '98.2', pulse: '72', weight: '62kg', height: '165cm' }
      },

      // Nov 12 - Patient 7 prenatal
      {
        PatientID: patients[7].PatientID,
        DoctorID: doctors[2].DoctorID,
        VisitDate: nov12 + ' 10:00:00',
        Symptoms: 'Third trimester, routine checkup',
        Diagnosis: 'Healthy pregnancy progression',
        TreatmentPlan: 'Continue prenatal vitamins, prepare for delivery',
        Notes: 'Baby development normal, estimated delivery in 6 weeks',
        VitalSigns: { bloodPressure: '122/78', temperature: '98.4', pulse: '80', weight: '65kg', height: '162cm' }
      },

      // Nov 12 - Patient 8 orthopedic
      {
        PatientID: patients[8].PatientID,
        DoctorID: doctors[3].DoctorID,
        VisitDate: nov12 + ' 09:00:00',
        Symptoms: 'Back pain significantly improved',
        Diagnosis: 'Lumbar disc herniation - responding well to treatment',
        TreatmentPlan: 'Continue physiotherapy, reduce medication gradually',
        Notes: 'Patient making excellent progress',
        VitalSigns: { bloodPressure: '128/80', temperature: '98.6', pulse: '70', weight: '80kg', height: '180cm' }
      },

      // Nov 12 - Patient 3 orthopedic
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        VisitDate: nov12 + ' 15:00:00',
        Symptoms: 'Knee pain much better, minimal discomfort',
        Diagnosis: 'Knee healing well, almost fully recovered',
        TreatmentPlan: 'Continue exercises, can resume light jogging',
        Notes: 'Patient ready to increase activity level',
        VitalSigns: { bloodPressure: '124/80', temperature: '98.4', pulse: '68', weight: '58kg', height: '168cm' }
      },

      // Nov 12 - Patient 4 neurology
      {
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        VisitDate: nov12 + ' 09:30:00',
        Symptoms: 'Migraine frequency down to 1 per week',
        Diagnosis: 'Chronic migraine well controlled',
        TreatmentPlan: 'Continue current dosage, maintain headache diary',
        Notes: 'Excellent response to treatment',
        VitalSigns: { bloodPressure: '126/82', temperature: '98.4', pulse: '68', weight: '70kg', height: '175cm' }
      },

      // Nov 12 - Patient 10 neurology
      {
        PatientID: patients[10].PatientID,
        DoctorID: doctors[4].DoctorID,
        VisitDate: nov12 + ' 13:00:00',
        Symptoms: 'Memory and concentration improving',
        Diagnosis: 'Stress-related cognitive issues improving',
        TreatmentPlan: 'Continue stress management techniques, sleep hygiene',
        Notes: 'Patient reports significant improvement',
        VitalSigns: { bloodPressure: '132/86', temperature: '98.6', pulse: '74', weight: '85kg', height: '182cm' }
      }
    ]);
    console.log(`✅ Created ${medicalRecords.length} medical records\n`);

    // 8. Create Prescriptions
    console.log('💊 Creating prescriptions...');
    const prescriptions = await Prescription.bulkCreate([
      // Prescription for Patient 0 (Arun) - Cardiac medication
      {
        MedicalRecordID: medicalRecords[0].RecordID,
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        Medications: [
          { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '90 days' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '90 days' },
          { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '90 days' }
        ],
        Instructions: 'Take medications as prescribed. Avoid fatty foods. Regular exercise recommended.',
        PrescriptionDate: '2025-09-10',
        ValidUntil: '2025-12-10',
        Status: 'Active'
      },
      {
        MedicalRecordID: medicalRecords[1].RecordID,
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        Medications: [
          { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '90 days' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '90 days' },
          { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '90 days' }
        ],
        Instructions: 'Dosage reduced. Continue lifestyle modifications.',
        PrescriptionDate: '2025-10-10',
        ValidUntil: '2026-01-10',
        Status: 'Active'
      },

      // Prescription for Patient 1 (Meera) - Skin treatment
      {
        MedicalRecordID: medicalRecords[3].RecordID,
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        Medications: [
          { name: 'Hydrocortisone Cream 1%', dosage: 'Apply thin layer', frequency: 'Twice daily', duration: '14 days' },
          { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
        ],
        Instructions: 'Apply cream to affected areas. Avoid scratching. Take antihistamine if itching persists.',
        PrescriptionDate: '2025-09-25',
        ValidUntil: '2025-11-25',
        Status: 'Completed'
      },
      {
        MedicalRecordID: medicalRecords[4].RecordID,
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        Medications: [
          { name: 'Mometasone Cream', dosage: 'Apply thin layer', frequency: 'Once daily', duration: '21 days' },
          { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily as needed', duration: '30 days' }
        ],
        Instructions: 'Continue avoiding nickel. Apply cream only to affected areas.',
        PrescriptionDate: '2025-10-28',
        ValidUntil: '2025-12-28',
        Status: 'Active'
      },

      // Prescription for Patient 3 (Divya) - Knee pain
      {
        MedicalRecordID: medicalRecords[6].RecordID,
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        Medications: [
          { name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily after meals', duration: '10 days' },
          { name: 'Diclofenac Gel', dosage: 'Apply to knee', frequency: 'Twice daily', duration: '14 days' }
        ],
        Instructions: 'Rest the knee. Apply ice 3-4 times daily. Start physiotherapy after 1 week.',
        PrescriptionDate: '2025-10-28',
        ValidUntil: '2025-11-28',
        Status: 'Active'
      },

      // Prescription for Patient 4 (Rahul) - Migraine
      {
        MedicalRecordID: medicalRecords[7].RecordID,
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        Medications: [
          { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '90 days' },
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed during migraine', duration: '30 days' }
        ],
        Instructions: 'Take propranolol daily for prevention. Use sumatriptan at onset of migraine. Maintain headache diary.',
        PrescriptionDate: '2025-09-10',
        ValidUntil: '2025-12-10',
        Status: 'Active'
      },
      {
        MedicalRecordID: medicalRecords[8].RecordID,
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        Medications: [
          { name: 'Propranolol', dosage: '60mg', frequency: 'Twice daily', duration: '90 days' },
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed during migraine', duration: '30 days' }
        ],
        Instructions: 'Increased propranolol dosage. Continue migraine diary.',
        PrescriptionDate: '2025-10-10',
        ValidUntil: '2026-01-10',
        Status: 'Active'
      },

      // Prescription for Patient 5 (Pooja) - Fever
      {
        MedicalRecordID: medicalRecords[9].RecordID,
        PatientID: patients[5].PatientID,
        DoctorID: doctors[5].DoctorID,
        Medications: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours as needed', duration: '5 days' },
          { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days' }
        ],
        Instructions: 'Take paracetamol for fever. Rest and drink plenty of fluids. Return if fever persists beyond 5 days.',
        PrescriptionDate: '2025-10-10',
        ValidUntil: '2025-11-10',
        Status: 'Completed'
      },

      // Prescription for Patient 6 (Sanjay) - Cardiac
      {
        MedicalRecordID: medicalRecords[12].RecordID,
        PatientID: patients[6].PatientID,
        DoctorID: doctors[0].DoctorID,
        Medications: [
          { name: 'Magnesium Supplement', dosage: '400mg', frequency: 'Once daily', duration: '60 days' }
        ],
        Instructions: 'Reduce caffeine and alcohol. Take magnesium supplement daily.',
        PrescriptionDate: '2025-10-20',
        ValidUntil: '2025-12-20',
        Status: 'Active'
      },

      // Prescription for Patient 7 (Neha) - Prenatal
      {
        MedicalRecordID: medicalRecords[14].RecordID,
        PatientID: patients[7].PatientID,
        DoctorID: doctors[2].DoctorID,
        Medications: [
          { name: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Once daily', duration: '90 days' },
          { name: 'Folic Acid', dosage: '5mg', frequency: 'Once daily', duration: '90 days' },
          { name: 'Iron Supplement', dosage: '100mg', frequency: 'Once daily', duration: '90 days' }
        ],
        Instructions: 'Take all prenatal supplements regularly. Maintain healthy diet. Attend all scheduled checkups.',
        PrescriptionDate: '2025-09-10',
        ValidUntil: '2026-05-30',
        Status: 'Active'
      },

      // Prescription for Patient 8 (Ravi) - Back pain
      {
        MedicalRecordID: medicalRecords[16].RecordID,
        PatientID: patients[8].PatientID,
        DoctorID: doctors[3].DoctorID,
        Medications: [
          { name: 'Ibuprofen', dosage: '600mg', frequency: 'Three times daily', duration: '14 days' },
          { name: 'Cyclobenzaprine', dosage: '10mg', frequency: 'Once at bedtime', duration: '14 days' },
          { name: 'Methylcobalamin', dosage: '1500mcg', frequency: 'Once daily', duration: '60 days' }
        ],
        Instructions: 'Take muscle relaxant at night. Start physiotherapy exercises as demonstrated. Avoid heavy lifting.',
        PrescriptionDate: '2025-09-25',
        ValidUntil: '2025-12-25',
        Status: 'Active'
      },

      // Prescription for Patient 9 (Priya) - Acne
      {
        MedicalRecordID: medicalRecords[18].RecordID,
        PatientID: patients[9].PatientID,
        DoctorID: doctors[1].DoctorID,
        Medications: [
          { name: 'Tretinoin Cream 0.025%', dosage: 'Apply pea-sized amount', frequency: 'Once at night', duration: '60 days' },
          { name: 'Benzoyl Peroxide Gel 2.5%', dosage: 'Apply to affected areas', frequency: 'Once in morning', duration: '60 days' },
          { name: 'Clindamycin Gel', dosage: 'Apply to affected areas', frequency: 'Twice daily', duration: '60 days' }
        ],
        Instructions: 'Use tretinoin at night, benzoyl peroxide in morning. Wash face gently twice daily. Use sunscreen.',
        PrescriptionDate: '2025-10-10',
        ValidUntil: '2025-12-10',
        Status: 'Active'
      },

      // Prescription for Patient 10 (Vijay) - Shoulder pain
      {
        MedicalRecordID: medicalRecords[22].RecordID,
        PatientID: patients[10].PatientID,
        DoctorID: doctors[3].DoctorID,
        Medications: [
          { name: 'Naproxen', dosage: '500mg', frequency: 'Twice daily', duration: '10 days' },
          { name: 'Diclofenac Gel', dosage: 'Apply to shoulder', frequency: 'Twice daily', duration: '14 days' }
        ],
        Instructions: 'Rest shoulder. Apply ice for 15 minutes 3 times daily. Start gentle exercises after pain subsides.',
        PrescriptionDate: '2025-11-05',
        ValidUntil: '2025-12-05',
        Status: 'Active'
      },

      // Prescription for Patient 11 (Ananya) - Flu
      {
        MedicalRecordID: medicalRecords[23].RecordID,
        PatientID: patients[11].PatientID,
        DoctorID: doctors[2].DoctorID,
        Medications: [
          { name: 'Oseltamivir', dosage: '75mg', frequency: 'Twice daily', duration: '5 days' },
          { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours as needed', duration: '7 days' },
          { name: 'Cough Syrup', dosage: '10ml', frequency: 'Three times daily', duration: '7 days' }
        ],
        Instructions: 'Complete full course of antiviral. Rest and isolate for 5 days. Drink plenty of fluids.',
        PrescriptionDate: '2025-11-10',
        ValidUntil: '2025-11-20',
        Status: 'Active'
      }
    ]);
    console.log(`✅ Created ${prescriptions.length} prescriptions\n`);

    // 9. Create Billing Records
    console.log('💰 Creating billing records...');
    const billings = await Billing.bulkCreate([
      // Billing for completed appointments
      {
        PatientID: patients[0].PatientID,
        AppointmentID: appointments[0].AppointmentID,
        BillingDate: '2025-09-10 10:00:00',
        TotalAmount: 1500,
        DiscountAmount: 0,
        TaxAmount: 150,
        NetAmount: 1650,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Cardiology', amount: 1000 },
          { description: 'ECG Test', amount: 500 }
        ]
      },
      {
        PatientID: patients[0].PatientID,
        AppointmentID: appointments[1].AppointmentID,
        BillingDate: '2025-10-10 11:00:00',
        TotalAmount: 1000,
        DiscountAmount: 100,
        TaxAmount: 90,
        NetAmount: 990,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Cardiology', amount: 1000 }
        ]
      },
      {
        PatientID: patients[1].PatientID,
        AppointmentID: appointments[8].AppointmentID,
        BillingDate: '2025-09-25 11:00:00',
        TotalAmount: 1500,
        DiscountAmount: 0,
        TaxAmount: 150,
        NetAmount: 1650,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Dermatology', amount: 800 },
          { description: 'Allergy Testing', amount: 700 }
        ]
      },
      {
        PatientID: patients[1].PatientID,
        AppointmentID: appointments[9].AppointmentID,
        BillingDate: '2025-10-28 12:00:00',
        TotalAmount: 800,
        DiscountAmount: 0,
        TaxAmount: 80,
        NetAmount: 880,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Dermatology', amount: 800 }
        ]
      },
      {
        PatientID: patients[2].PatientID,
        AppointmentID: appointments[18].AppointmentID,
        BillingDate: '2025-10-20 14:30:00',
        TotalAmount: 1000,
        DiscountAmount: 0,
        TaxAmount: 100,
        NetAmount: 1100,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Pediatrics', amount: 700 },
          { description: 'MMR Vaccine', amount: 300 }
        ]
      },
      {
        PatientID: patients[3].PatientID,
        AppointmentID: appointments[26].AppointmentID,
        BillingDate: '2025-10-28 15:30:00',
        TotalAmount: 1400,
        DiscountAmount: 0,
        TaxAmount: 140,
        NetAmount: 1540,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Orthopedics', amount: 900 },
          { description: 'X-Ray - Knee', amount: 500 }
        ]
      },
      {
        PatientID: patients[4].PatientID,
        AppointmentID: appointments[32].AppointmentID,
        BillingDate: '2025-09-10 10:00:00',
        TotalAmount: 2700,
        DiscountAmount: 200,
        TaxAmount: 250,
        NetAmount: 2750,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Neurology', amount: 1200 },
          { description: 'MRI Brain', amount: 1500 }
        ]
      },
      {
        PatientID: patients[4].PatientID,
        AppointmentID: appointments[33].AppointmentID,
        BillingDate: '2025-10-10 11:30:00',
        TotalAmount: 1200,
        DiscountAmount: 0,
        TaxAmount: 120,
        NetAmount: 1320,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Neurology', amount: 1200 }
        ]
      },
      {
        PatientID: patients[5].PatientID,
        AppointmentID: appointments[40].AppointmentID,
        BillingDate: '2025-10-10 10:30:00',
        TotalAmount: 900,
        DiscountAmount: 0,
        TaxAmount: 90,
        NetAmount: 990,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - General Medicine', amount: 600 },
          { description: 'Blood Test - Complete Count', amount: 300 }
        ]
      },
      {
        PatientID: patients[5].PatientID,
        AppointmentID: appointments[41].AppointmentID,
        BillingDate: '2025-10-20 14:30:00',
        TotalAmount: 600,
        DiscountAmount: 50,
        TaxAmount: 55,
        NetAmount: 605,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - General Medicine', amount: 600 }
        ]
      },
      {
        PatientID: patients[6].PatientID,
        AppointmentID: appointments[2].AppointmentID,
        BillingDate: '2025-10-20 12:00:00',
        TotalAmount: 1800,
        DiscountAmount: 0,
        TaxAmount: 180,
        NetAmount: 1980,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Cardiology', amount: 1000 },
          { description: 'Holter Monitor Test', amount: 800 }
        ]
      },
      {
        PatientID: patients[7].PatientID,
        AppointmentID: appointments[15].AppointmentID,
        BillingDate: '2025-09-10 11:30:00',
        TotalAmount: 1200,
        DiscountAmount: 100,
        TaxAmount: 110,
        NetAmount: 1210,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Pediatrics', amount: 700 },
          { description: 'Prenatal Blood Tests', amount: 500 }
        ]
      },
      {
        PatientID: patients[7].PatientID,
        AppointmentID: appointments[16].AppointmentID,
        BillingDate: '2025-10-10 10:00:00',
        TotalAmount: 1500,
        DiscountAmount: 0,
        TaxAmount: 150,
        NetAmount: 1650,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Pediatrics', amount: 700 },
          { description: 'Ultrasound - Prenatal', amount: 800 }
        ]
      },
      {
        PatientID: patients[8].PatientID,
        AppointmentID: appointments[23].AppointmentID,
        BillingDate: '2025-09-25 10:30:00',
        TotalAmount: 2400,
        DiscountAmount: 0,
        TaxAmount: 240,
        NetAmount: 2640,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Orthopedics', amount: 900 },
          { description: 'MRI - Lumbar Spine', amount: 1500 }
        ]
      },
      {
        PatientID: patients[8].PatientID,
        AppointmentID: appointments[24].AppointmentID,
        BillingDate: '2025-10-20 14:30:00',
        TotalAmount: 900,
        DiscountAmount: 0,
        TaxAmount: 90,
        NetAmount: 990,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Orthopedics', amount: 900 }
        ]
      },
      {
        PatientID: patients[9].PatientID,
        AppointmentID: appointments[10].AppointmentID,
        BillingDate: '2025-10-10 09:30:00',
        TotalAmount: 800,
        DiscountAmount: 0,
        TaxAmount: 80,
        NetAmount: 880,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Dermatology', amount: 800 }
        ]
      },
      {
        PatientID: patients[9].PatientID,
        AppointmentID: appointments[11].AppointmentID,
        BillingDate: '2025-11-05 15:30:00',
        TotalAmount: 800,
        DiscountAmount: 80,
        TaxAmount: 72,
        NetAmount: 792,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Dermatology', amount: 800 }
        ]
      },
      {
        PatientID: patients[10].PatientID,
        AppointmentID: appointments[34].AppointmentID,
        BillingDate: '2025-10-20 13:30:00',
        TotalAmount: 2000,
        DiscountAmount: 0,
        TaxAmount: 200,
        NetAmount: 2200,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Neurology', amount: 1200 },
          { description: 'Cognitive Assessment Tests', amount: 800 }
        ]
      },
      {
        PatientID: patients[10].PatientID,
        AppointmentID: appointments[27].AppointmentID,
        BillingDate: '2025-11-05 11:30:00',
        TotalAmount: 1400,
        DiscountAmount: 0,
        TaxAmount: 140,
        NetAmount: 1540,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Orthopedics', amount: 900 },
          { description: 'X-Ray - Shoulder', amount: 500 }
        ]
      },
      {
        PatientID: patients[11].PatientID,
        AppointmentID: appointments[19].AppointmentID,
        BillingDate: '2025-11-10 16:00:00',
        TotalAmount: 1000,
        DiscountAmount: 0,
        TaxAmount: 100,
        NetAmount: 1100,
        Status: 'Pending',
        Items: [
          { description: 'Consultation Fee - Pediatrics', amount: 700 },
          { description: 'Flu Test', amount: 300 }
        ]
      },
      {
        PatientID: patients[5].PatientID,
        AppointmentID: appointments[3].AppointmentID,
        BillingDate: '2025-11-05 14:30:00',
        TotalAmount: 1000,
        DiscountAmount: 0,
        TaxAmount: 100,
        NetAmount: 1100,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Cardiology', amount: 1000 }
        ]
      },
      {
        PatientID: patients[6].PatientID,
        AppointmentID: appointments[35].AppointmentID,
        BillingDate: '2025-11-05 14:30:00',
        TotalAmount: 1200,
        DiscountAmount: 0,
        TaxAmount: 120,
        NetAmount: 1320,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - Neurology', amount: 1200 }
        ]
      },
      {
        PatientID: patients[0].PatientID,
        AppointmentID: appointments[39].AppointmentID,
        BillingDate: '2025-09-25 09:30:00',
        TotalAmount: 1100,
        DiscountAmount: 0,
        TaxAmount: 110,
        NetAmount: 1210,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - General Medicine', amount: 600 },
          { description: 'Complete Health Screening', amount: 500 }
        ]
      },
      {
        PatientID: patients[9].PatientID,
        AppointmentID: appointments[42].AppointmentID,
        BillingDate: '2025-10-28 11:30:00',
        TotalAmount: 600,
        DiscountAmount: 0,
        TaxAmount: 60,
        NetAmount: 660,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee - General Medicine', amount: 600 }
        ]
      }
    ], { individualHooks: true });
    console.log(`✅ Created ${billings.length} billing records\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Summary:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ ${specializations.length} Specializations`);
    console.log(`✅ ${departments.length} Departments`);
    console.log(`✅ ${doctors.length} Doctors`);
    console.log(`✅ ${staff.length} Staff Members`);
    console.log(`✅ ${patients.length} Patients`);
    console.log(`✅ ${appointments.length} Appointments`);
    console.log(`✅ ${medicalRecords.length} Medical Records`);
    console.log(`✅ ${prescriptions.length} Prescriptions`);
    console.log(`✅ ${billings.length} Billing Records`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📅 Appointments for November 13, 2025:');
    console.log('═══════════════════════════════════════════════════════');
    const nov13Appointments = appointments.filter(apt => apt.AppointmentDate === nov13);
    nov13Appointments.forEach(apt => {
      const patient = patients.find(p => p.PatientID === apt.PatientID);
      const doctor = doctors.find(d => d.DoctorID === apt.DoctorID);
      console.log(`   ${apt.AppointmentTime} | ${patient.FirstName} ${patient.LastName} → Dr. ${doctor.FirstName} ${doctor.LastName}`);
    });
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📝 System Access:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔐 Admin Password: admin123');
    console.log('');
    console.log('👨‍⚕️ Doctors (Select by Name/ID):');
    doctors.forEach((doc, index) => {
      console.log(`   ID: ${doc.DoctorID} | Dr. ${doc.FirstName} ${doc.LastName} (${specializations[index].SpecializationName})`);
    });
    console.log('');
    console.log('👥 Patients (Select by Name/ID):');
    patients.forEach((pat) => {
      console.log(`   ID: ${pat.PatientID} | ${pat.FirstName} ${pat.LastName} (${pat.PatientNumber})`);
    });
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seed();
