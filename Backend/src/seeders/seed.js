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
    ]);
    console.log(`✅ Created ${patients.length} patients\n`);

    // 6. Create Appointments (Simplified - No Clinics)
    console.log('📅 Creating appointments...');
    const nov12 = '2025-11-12';
    const nov13 = '2025-11-13';
    const nov14 = '2025-11-14';
    const nov15 = '2025-11-15';
    const nov10 = '2025-11-10';
    const nov11 = '2025-11-11';
    const nov05 = '2025-11-05';
    const oct28 = '2025-10-28';
    const oct20 = '2025-10-20';
    const oct10 = '2025-10-10';
    const sep25 = '2025-09-25';
    const sep10 = '2025-09-10';

    const appointments = await Appointment.bulkCreate([
      // Dr. Rajesh Kumar (Cardiologist) - 8 appointments
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: sep10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Initial cardiac consultation', Notes: 'First visit - chest pain complaints' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Follow-up ECG results', Notes: 'Monitoring progress' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: oct20, AppointmentTime: '11:30:00', Status: 'Completed', Reason: 'Heart palpitations', Notes: 'Regular heart checkup' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov05, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Hypertension check', Notes: 'Blood pressure monitoring' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:00:00', Status: 'Scheduled', Reason: 'Monthly cardiac checkup', Notes: 'Regular monitoring - 3rd visit' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov12, AppointmentTime: '11:00:00', Status: 'Scheduled', Reason: 'Chest discomfort', Notes: 'New patient consultation' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:00:00', Status: 'Scheduled', Reason: 'Follow-up palpitations', Notes: 'Second visit - review medication' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[0].DoctorID, AppointmentDate: nov13, AppointmentTime: '14:30:00', Status: 'Scheduled', Reason: 'Cardiac screening', Notes: 'Family history of heart disease' },

      // Dr. Priya Sharma (Dermatologist) - 8 appointments
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: sep25, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Initial skin consultation', Notes: 'First visit for skin rash' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: oct28, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'Skin allergy test follow-up', Notes: 'Second visit - reviewing test results' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: oct10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Acne consultation', Notes: 'Initial visit for acne treatment' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov05, AppointmentTime: '15:00:00', Status: 'Completed', Reason: 'Acne treatment follow-up', Notes: 'Second visit - progress check' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:30:00', Status: 'Scheduled', Reason: 'Skin rash recurrence', Notes: 'Third visit - rash returned' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov12, AppointmentTime: '13:00:00', Status: 'Scheduled', Reason: 'Eczema consultation', Notes: 'New patient' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:00:00', Status: 'Scheduled', Reason: 'Acne progress review', Notes: 'Third visit - treatment effectiveness' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[1].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Skin mole examination', Notes: 'Routine skin check' },

      // Dr. Amit Patel (Pediatrician) - 7 appointments
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: sep10, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'First prenatal visit', Notes: 'Initial pregnancy consultation' },
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: oct10, AppointmentTime: '09:30:00', Status: 'Completed', Reason: 'Second prenatal checkup', Notes: 'Regular monitoring' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Child vaccination', Notes: 'Routine immunization' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov10, AppointmentTime: '15:30:00', Status: 'Completed', Reason: 'Flu symptoms', Notes: 'Fever and cold for 3 days' },
      { PatientID: patients[7].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov12, AppointmentTime: '10:00:00', Status: 'Scheduled', Reason: 'Third trimester checkup', Notes: 'Regular prenatal monitoring' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov13, AppointmentTime: '11:00:00', Status: 'Scheduled', Reason: 'Follow-up vaccination', Notes: 'Second vaccination appointment' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[2].DoctorID, AppointmentDate: nov13, AppointmentTime: '14:00:00', Status: 'Scheduled', Reason: 'Flu follow-up', Notes: 'Check recovery progress' },

      // Dr. Sneha Reddy (Orthopedics) - 8 appointments
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: sep25, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Initial back pain consultation', Notes: 'First visit - chronic pain' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Back pain follow-up', Notes: 'MRI results review' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: oct28, AppointmentTime: '15:00:00', Status: 'Completed', Reason: 'Knee pain initial visit', Notes: 'Jogging injury' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov05, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'Shoulder pain', Notes: 'Sports injury consultation' },
      { PatientID: patients[8].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:00:00', Status: 'Scheduled', Reason: 'Physiotherapy review', Notes: 'Third visit - progress evaluation' },
      { PatientID: patients[3].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov12, AppointmentTime: '15:00:00', Status: 'Scheduled', Reason: 'Knee pain follow-up', Notes: 'Second visit - check healing' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov13, AppointmentTime: '10:30:00', Status: 'Scheduled', Reason: 'Shoulder physiotherapy', Notes: 'Second visit - treatment plan' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[3].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Hip pain consultation', Notes: 'New patient' },

      // Dr. Vikram Singh (Neurology) - 8 appointments
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: sep10, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Initial migraine consultation', Notes: 'First visit - frequent headaches' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:30:00', Status: 'Completed', Reason: 'Migraine medication review', Notes: 'Second visit - treatment adjustment' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: oct20, AppointmentTime: '13:00:00', Status: 'Completed', Reason: 'Memory issues consultation', Notes: 'Initial cognitive assessment' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov05, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Dizziness episodes', Notes: 'Neurological examination' },
      { PatientID: patients[4].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov12, AppointmentTime: '09:30:00', Status: 'Scheduled', Reason: 'Monthly migraine follow-up', Notes: 'Third visit - progress check' },
      { PatientID: patients[10].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov12, AppointmentTime: '13:00:00', Status: 'Scheduled', Reason: 'Memory test results', Notes: 'Second visit - discuss findings' },
      { PatientID: patients[6].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov13, AppointmentTime: '11:00:00', Status: 'Scheduled', Reason: 'Dizziness follow-up', Notes: 'Second visit - medication review' },
      { PatientID: patients[2].PatientID, DoctorID: doctors[4].DoctorID, AppointmentDate: nov13, AppointmentTime: '15:30:00', Status: 'Scheduled', Reason: 'Seizure consultation', Notes: 'New patient - urgent' },

      // Dr. Anjali Verma (General Medicine) - 8 appointments
      { PatientID: patients[0].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: sep25, AppointmentTime: '09:00:00', Status: 'Completed', Reason: 'Annual health screening', Notes: 'Routine checkup' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct10, AppointmentTime: '10:00:00', Status: 'Completed', Reason: 'Fever and fatigue', Notes: 'Viral infection symptoms' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct20, AppointmentTime: '14:00:00', Status: 'Completed', Reason: 'Fever follow-up', Notes: 'Second visit - recovery check' },
      { PatientID: patients[9].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: oct28, AppointmentTime: '11:00:00', Status: 'Completed', Reason: 'General health checkup', Notes: 'Wellness visit' },
      { PatientID: patients[0].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov12, AppointmentTime: '08:30:00', Status: 'Scheduled', Reason: 'Follow-up health screening', Notes: 'Second visit - blood test results' },
      { PatientID: patients[11].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov12, AppointmentTime: '14:30:00', Status: 'Scheduled', Reason: 'Abdominal pain', Notes: 'New patient consultation' },
      { PatientID: patients[5].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov13, AppointmentTime: '09:00:00', Status: 'Scheduled', Reason: 'Post-recovery checkup', Notes: 'Third visit - final assessment' },
      { PatientID: patients[1].PatientID, DoctorID: doctors[5].DoctorID, AppointmentDate: nov13, AppointmentTime: '16:00:00', Status: 'Scheduled', Reason: 'Diabetes screening', Notes: 'Preventive care' }
    ]);
    console.log(`✅ Created ${appointments.length} appointments\n`);

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
