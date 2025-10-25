// ============================================
// src/seeders/seed.js
// ============================================
require('dotenv').config();
const { 
  sequelize, 
  User, 
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
      { SpecializationName: 'General Medicine', Description: 'General medical care' },
      { SpecializationName: 'Gynecology', Description: 'Female reproductive system' },
      { SpecializationName: 'Ophthalmology', Description: 'Eyes and vision' },
      { SpecializationName: 'Psychiatry', Description: 'Mental health' },
      { SpecializationName: 'ENT', Description: 'Ear, Nose, and Throat' }
    ]);
    console.log(`✅ Created ${specializations.length} specializations\n`);

    // 2. Create Departments
    console.log('🏥 Creating departments...');
    const departments = await Department.bulkCreate([
      { DepartmentName: 'Emergency', Description: 'Emergency medical services' },
      { DepartmentName: 'Outpatient', Description: 'Outpatient consultation' },
      { DepartmentName: 'Inpatient', Description: 'Inpatient care' },
      { DepartmentName: 'Radiology', Description: 'Medical imaging' },
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
        DepartmentID: departments[6].DepartmentID,
        Position: 'Receptionist',
        JoiningDate: '2020-01-15'
      },
      {
        FirstName: 'Lakshmi',
        LastName: 'Iyer',
        ContactNumber: '9123456781',
        Email: 'lakshmi.iyer@hospital.com',
        DepartmentID: departments[6].DepartmentID,
        Position: 'Accountant',
        JoiningDate: '2019-06-10'
      },
      {
        FirstName: 'Suresh',
        LastName: 'Menon',
        ContactNumber: '9123456782',
        Email: 'suresh.menon@hospital.com',
        DepartmentID: departments[5].DepartmentID,
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
      }
    ]);
    console.log(`✅ Created ${patients.length} patients\n`);

    // 6. Create Users
    console.log('🔐 Creating user accounts...');
    
    // Admin user
    await User.create({
      Email: 'admin@hospital.com',
      Password: 'admin123',
      Role: 'admin',
      IsActive: true
    });
    console.log('   ✓ Admin user created');

    // Doctor users
    for (let i = 0; i < doctors.length; i++) {
      await User.create({
        Email: doctors[i].Email,
        Password: 'doctor123',
        Role: 'doctor',
        RefID: doctors[i].DoctorID,
        IsActive: true
      });
    }
    console.log(`   ✓ Created ${doctors.length} doctor accounts`);

    // Staff users
    for (let i = 0; i < staff.length; i++) {
      await User.create({
        Email: staff[i].Email,
        Password: 'staff123',
        Role: 'staff',
        RefID: staff[i].StaffID,
        IsActive: true
      });
    }
    console.log(`   ✓ Created ${staff.length} staff accounts`);

    // Patient users
    for (let i = 0; i < patients.length; i++) {
      await User.create({
        Email: patients[i].Email,
        Password: 'patient123',
        Role: 'patient',
        RefID: patients[i].PatientID,
        IsActive: true
      });
    }
    console.log(`   ✓ Created ${patients.length} patient accounts\n`);

    // 7. Create Appointments
    console.log('📅 Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const appointments = await Appointment.bulkCreate([
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentDate: tomorrow.toISOString().split('T')[0],
        AppointmentTime: '10:00:00',
        Status: 'Scheduled',
        Reason: 'Chest pain and discomfort',
        Notes: 'Patient reports irregular heartbeat'
      },
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        AppointmentDate: tomorrow.toISOString().split('T')[0],
        AppointmentTime: '14:30:00',
        Status: 'Confirmed',
        Reason: 'Skin rash on arms',
        Notes: 'Rash appeared 3 days ago'
      },
      {
        PatientID: patients[2].PatientID,
        DoctorID: doctors[2].DoctorID,
        AppointmentDate: nextWeek.toISOString().split('T')[0],
        AppointmentTime: '11:00:00',
        Status: 'Scheduled',
        Reason: 'Child vaccination',
        Notes: 'Regular checkup for 2-year-old'
      },
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentDate: lastWeek.toISOString().split('T')[0],
        AppointmentTime: '09:00:00',
        Status: 'Completed',
        Reason: 'General checkup',
        Notes: 'Annual health screening'
      },
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentDate: yesterday.toISOString().split('T')[0],
        AppointmentTime: '15:00:00',
        Status: 'Completed',
        Reason: 'Knee pain',
        Notes: 'Pain after jogging injury'
      },
      {
        PatientID: patients[4].PatientID,
        DoctorID: doctors[4].DoctorID,
        AppointmentDate: today.toISOString().split('T')[0],
        AppointmentTime: '10:30:00',
        Status: 'Confirmed',
        Reason: 'Frequent headaches',
        Notes: 'Headaches for past 2 weeks'
      },
      {
        PatientID: patients[5].PatientID,
        DoctorID: doctors[0].DoctorID,
        AppointmentDate: today.toISOString().split('T')[0],
        AppointmentTime: '16:00:00',
        Status: 'Scheduled',
        Reason: 'Follow-up consultation',
        Notes: 'Post-surgery checkup'
      }
    ]);
    console.log(`✅ Created ${appointments.length} appointments\n`);

    // 8. Create Medical Records
    console.log('📋 Creating medical records...');
    const medicalRecords = await MedicalRecord.bulkCreate([
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        AppointmentID: appointments[3].AppointmentID,
        VisitDate: lastWeek.toISOString().split('T')[0],
        Symptoms: 'Fever, body ache, fatigue',
        Diagnosis: 'Viral fever with mild dehydration',
        TreatmentPlan: 'Rest, adequate hydration, and medication',
        Notes: 'Patient advised to return if symptoms persist beyond 5 days',
        VitalSigns: {
          bloodPressure: '120/80',
          temperature: '99.5°F',
          pulse: '78 bpm',
          respiratoryRate: '16/min',
          oxygenSaturation: '98%'
        }
      },
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        AppointmentID: appointments[4].AppointmentID,
        VisitDate: yesterday.toISOString().split('T')[0],
        Symptoms: 'Knee pain, swelling, difficulty walking',
        Diagnosis: 'Sprained knee ligament (Grade 1)',
        TreatmentPlan: 'RICE protocol, pain management, physiotherapy',
        Notes: 'Injury occurred during morning jog. X-ray shows no fracture. Follow-up in 2 weeks.',
        VitalSigns: {
          bloodPressure: '118/76',
          temperature: '98.4°F',
          pulse: '72 bpm',
          respiratoryRate: '15/min'
        }
      },
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        VisitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        Symptoms: 'Itchy skin rash, redness',
        Diagnosis: 'Contact dermatitis',
        TreatmentPlan: 'Topical corticosteroid cream, antihistamine',
        Notes: 'Patch test performed. Allergic to certain detergents. Advised to use hypoallergenic products.',
        VitalSigns: {
          bloodPressure: '115/75',
          temperature: '98.6°F',
          pulse: '70 bpm'
        }
      }
    ]);
    console.log(`✅ Created ${medicalRecords.length} medical records\n`);

    // 9. Create Prescriptions
    console.log('💊 Creating prescriptions...');
    const prescriptions = await Prescription.bulkCreate([
      {
        MedicalRecordID: medicalRecords[0].RecordID,
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        PrescriptionDate: lastWeek.toISOString().split('T')[0],
        ValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        Status: 'Active',
        Medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '5 days',
            instructions: 'Take after meals'
          },
          {
            name: 'Electrolyte Solution',
            dosage: '200ml',
            frequency: 'Twice daily',
            duration: '3 days',
            instructions: 'Mix with water'
          }
        ],
        Instructions: 'Complete the full course. Drink plenty of fluids. Rest adequately.'
      },
      {
        MedicalRecordID: medicalRecords[1].RecordID,
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        PrescriptionDate: yesterday.toISOString().split('T')[0],
        ValidUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        Status: 'Active',
        Medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Twice daily',
            duration: '7 days',
            instructions: 'Take with food'
          },
          {
            name: 'Muscle Relaxant',
            dosage: '10mg',
            frequency: 'Once at bedtime',
            duration: '5 days',
            instructions: 'May cause drowsiness'
          }
        ],
        Instructions: 'Apply ice pack 3-4 times daily. Keep leg elevated. Start physiotherapy after 3 days.'
      },
      {
        MedicalRecordID: medicalRecords[2].RecordID,
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        PrescriptionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ValidUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        Status: 'Active',
        Medications: [
          {
            name: 'Hydrocortisone Cream',
            dosage: '1%',
            frequency: 'Apply twice daily',
            duration: '14 days',
            instructions: 'Apply thin layer on affected area'
          },
          {
            name: 'Cetirizine',
            dosage: '10mg',
            frequency: 'Once daily at night',
            duration: '7 days',
            instructions: 'Take before bedtime'
          }
        ],
        Instructions: 'Avoid contact with irritants. Use fragrance-free moisturizer. Do not scratch affected areas.'
      }
    ]);
    console.log(`✅ Created ${prescriptions.length} prescriptions\n`);

    // 10. Create Billing Records
    console.log('💰 Creating billing records...');
    const billings = await Billing.bulkCreate([
      {
        PatientID: patients[0].PatientID,
        AppointmentID: appointments[3].AppointmentID,
        BillingDate: lastWeek.toISOString().split('T')[0],
        TotalAmount: 1200.00,
        DiscountAmount: 120.00,
        TaxAmount: 97.20,
        NetAmount: 1177.20,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee', price: 600, quantity: 1 },
          { description: 'Medical Tests', price: 400, quantity: 1 },
          { description: 'Medicines', price: 200, quantity: 1 }
        ]
      },
      {
        PatientID: patients[3].PatientID,
        AppointmentID: appointments[4].AppointmentID,
        BillingDate: yesterday.toISOString().split('T')[0],
        TotalAmount: 2500.00,
        DiscountAmount: 0.00,
        TaxAmount: 225.00,
        NetAmount: 2725.00,
        Status: 'Partial',
        Items: [
          { description: 'Consultation Fee', price: 900, quantity: 1 },
          { description: 'X-Ray', price: 800, quantity: 1 },
          { description: 'Physiotherapy Session', price: 600, quantity: 1 },
          { description: 'Medicines', price: 200, quantity: 1 }
        ]
      },
      {
        PatientID: patients[1].PatientID,
        BillingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        TotalAmount: 950.00,
        DiscountAmount: 50.00,
        TaxAmount: 81.00,
        NetAmount: 981.00,
        Status: 'Paid',
        Items: [
          { description: 'Consultation Fee', price: 800, quantity: 1 },
          { description: 'Medicines', price: 150, quantity: 1 }
        ]
      },
      {
        PatientID: patients[4].PatientID,
        BillingDate: today.toISOString().split('T')[0],
        TotalAmount: 1800.00,
        DiscountAmount: 180.00,
        TaxAmount: 145.80,
        NetAmount: 1765.80,
        Status: 'Pending',
        Items: [
          { description: 'Consultation Fee', price: 1200, quantity: 1 },
          { description: 'MRI Scan', price: 600, quantity: 1 }
        ]
      }
    ]);
    console.log(`✅ Created ${billings.length} billing records\n`);

    // 11. Create Payments
    console.log('💳 Creating payment records...');
    const payments = await Payment.bulkCreate([
      {
        BillingID: billings[0].BillingID,
        Amount: 1177.20,
        PaymentDate: lastWeek.toISOString().split('T')[0],
        PaymentMethod: 'Card',
        TransactionID: 'TXN' + Date.now() + '001',
        Notes: 'Full payment via debit card'
      },
      {
        BillingID: billings[1].BillingID,
        Amount: 1500.00,
        PaymentDate: yesterday.toISOString().split('T')[0],
        PaymentMethod: 'UPI',
        TransactionID: 'TXN' + Date.now() + '002',
        Notes: 'Partial payment via UPI. Balance pending.'
      },
      {
        BillingID: billings[2].BillingID,
        Amount: 981.00,
        PaymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        PaymentMethod: 'Cash',
        TransactionID: null,
        Notes: 'Full payment in cash'
      }
    ]);
    console.log(`✅ Created ${payments.length} payment records\n`);

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
    console.log(`✅ ${payments.length} Payment Records`);
    console.log(`✅ ${1 + doctors.length + staff.length + patients.length} User Accounts`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('🔑 Test Credentials:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('👑 Admin:');
    console.log('   Email: admin@hospital.com');
    console.log('   Password: admin123\n');
    
    console.log('👨‍⚕️ Doctors:');
    doctors.forEach((doc, index) => {
      console.log(`   Email: ${doc.Email} | Password: doctor123`);
    });
    
    console.log('\n👔 Staff:');
    staff.forEach((s, index) => {
      console.log(`   Email: ${s.Email} | Password: staff123`);
    });
    
    console.log('\n👥 Patients:');
    patients.forEach((pat, index) => {
      console.log(`   Email: ${pat.Email} | Password: patient123`);
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