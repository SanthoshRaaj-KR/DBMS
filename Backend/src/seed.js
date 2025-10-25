require('dotenv').config();
const sequelize = require('./db');
const bcrypt = require('bcrypt');

// Import all models
const User = require('./models/User');
const Patient = require('./models/Patient');
const Specialization = require('./models/Specialization');
const Doctor = require('./models/Doctor');
const Clinic = require('./models/Clinic');
const Appointment = require('./models/Appointment');
const DoctorClinic = require('./models/DoctorClinic');
const MedicalRecord = require('./models/MedicalRecord');

// Set up associations
DoctorClinic.belongsTo(Doctor, { foreignKey: 'DoctorID' });
DoctorClinic.belongsTo(Clinic, { foreignKey: 'ClinicID' });
Doctor.hasMany(DoctorClinic, { foreignKey: 'DoctorID' });
Clinic.hasMany(DoctorClinic, { foreignKey: 'ClinicID' });

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database schema created');

    // 1. Create Specializations
    console.log('📋 Creating specializations...');
    const specializations = await Specialization.bulkCreate([
      { SpecializationName: 'Cardiology' },
      { SpecializationName: 'Dermatology' },
      { SpecializationName: 'Pediatrics' },
      { SpecializationName: 'Orthopedics' },
      { SpecializationName: 'Neurology' },
      { SpecializationName: 'General Medicine' },
      { SpecializationName: 'Gynecology' },
      { SpecializationName: 'Ophthalmology' }
    ]);
    console.log(`✅ Created ${specializations.length} specializations`);

    // 2. Create Clinics
    console.log('🏥 Creating clinics...');
    const clinics = await Clinic.bulkCreate([
      {
        ClinicName: 'City General Hospital',
        Address: '123 Main Street, Chennai, Tamil Nadu 600001',
        ContactNumber: '044-12345678',
        Email: 'info@citygeneral.com'
      },
      {
        ClinicName: 'Sunrise Medical Center',
        Address: '456 Park Avenue, Bangalore, Karnataka 560001',
        ContactNumber: '080-87654321',
        Email: 'contact@sunrisemedical.com'
      },
      {
        ClinicName: 'Apollo Clinic - Vellore',
        Address: 'VIT Campus Road, Vellore, Tamil Nadu 632014',
        ContactNumber: '0416-2243232',
        Email: 'vellore@apolloclinic.com'
      },
      {
        ClinicName: 'HealthCare Plus',
        Address: '789 MG Road, Mumbai, Maharashtra 400001',
        ContactNumber: '022-33445566',
        Email: 'info@healthcareplus.com'
      }
    ]);
    console.log(`✅ Created ${clinics.length} clinics`);

    // 3. Create Doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctors = await Doctor.bulkCreate([
      {
        FirstName: 'Arjun',
        LastName: 'Kumar',
        ContactNumber: '9876543210',
        SpecializationID: specializations[0].SpecializationID // Cardiology
      },
      {
        FirstName: 'Priya',
        LastName: 'Sharma',
        ContactNumber: '9876543211',
        SpecializationID: specializations[1].SpecializationID // Dermatology
      },
      {
        FirstName: 'Rajesh',
        LastName: 'Patel',
        ContactNumber: '9876543212',
        SpecializationID: specializations[2].SpecializationID // Pediatrics
      },
      {
        FirstName: 'Anita',
        LastName: 'Desai',
        ContactNumber: '9876543213',
        SpecializationID: specializations[3].SpecializationID // Orthopedics
      },
      {
        FirstName: 'Vikram',
        LastName: 'Singh',
        ContactNumber: '9876543214',
        SpecializationID: specializations[4].SpecializationID // Neurology
      },
      {
        FirstName: 'Meera',
        LastName: 'Iyer',
        ContactNumber: '9876543215',
        SpecializationID: specializations[5].SpecializationID // General Medicine
      }
    ]);
    console.log(`✅ Created ${doctors.length} doctors`);

    // 4. Associate Doctors with Clinics
    console.log('🔗 Associating doctors with clinics...');
    const doctorClinicData = [
      { DoctorID: doctors[0].DoctorID, ClinicID: clinics[0].ClinicID },
      { DoctorID: doctors[0].DoctorID, ClinicID: clinics[2].ClinicID },
      { DoctorID: doctors[1].DoctorID, ClinicID: clinics[1].ClinicID },
      { DoctorID: doctors[2].DoctorID, ClinicID: clinics[0].ClinicID },
      { DoctorID: doctors[2].DoctorID, ClinicID: clinics[2].ClinicID },
      { DoctorID: doctors[3].DoctorID, ClinicID: clinics[1].ClinicID },
      { DoctorID: doctors[4].DoctorID, ClinicID: clinics[3].ClinicID },
      { DoctorID: doctors[5].DoctorID, ClinicID: clinics[0].ClinicID },
      { DoctorID: doctors[5].DoctorID, ClinicID: clinics[1].ClinicID }
    ];
    await DoctorClinic.bulkCreate(doctorClinicData);
    console.log(`✅ Created ${doctorClinicData.length} doctor-clinic associations`);

    // 5. Create Patients
    console.log('👥 Creating patients...');
    const patients = await Patient.bulkCreate([
      {
        FirstName: 'Ravi',
        LastName: 'Patel',
        DateOfBirth: '1990-05-15',
        ContactNumber: '9123456780',
        Email: 'ravi.patel@example.com'
      },
      {
        FirstName: 'Sneha',
        LastName: 'Reddy',
        DateOfBirth: '1985-08-22',
        ContactNumber: '9123456781',
        Email: 'sneha.reddy@example.com'
      },
      {
        FirstName: 'Amit',
        LastName: 'Verma',
        DateOfBirth: '1992-03-10',
        ContactNumber: '9123456782',
        Email: 'amit.verma@example.com'
      },
      {
        FirstName: 'Pooja',
        LastName: 'Nair',
        DateOfBirth: '1988-11-30',
        ContactNumber: '9123456783',
        Email: 'pooja.nair@example.com'
      },
      {
        FirstName: 'Karthik',
        LastName: 'Krishnan',
        DateOfBirth: '1995-07-18',
        ContactNumber: '9123456784',
        Email: 'karthik.k@example.com'
      }
    ]);
    console.log(`✅ Created ${patients.length} patients`);

    // 6. Create Users (for authentication)
    console.log('🔐 Creating user accounts...');
    
    // Admin user
    const adminUser = await User.create({
      Email: 'admin@clinic.com',
      Password: 'admin123', // Will be hashed automatically
      Role: 'admin'
    });
    console.log('✅ Admin user created: admin@clinic.com / admin123');

    // Doctor users
    const doctorUsers = [];
    for (let i = 0; i < 3; i++) {
      const doctorUser = await User.create({
        Email: `doctor${i + 1}@clinic.com`,
        Password: 'doctor123',
        Role: 'doctor',
        RefID: doctors[i].DoctorID
      });
      doctorUsers.push(doctorUser);
    }
    console.log(`✅ Created ${doctorUsers.length} doctor accounts`);

    // Patient users
    const patientUsers = [];
    for (let i = 0; i < patients.length; i++) {
      const patientUser = await User.create({
        Email: patients[i].Email,
        Password: 'patient123',
        Role: 'patient',
        RefID: patients[i].PatientID
      });
      patientUsers.push(patientUser);
    }
    console.log(`✅ Created ${patientUsers.length} patient accounts`);

    // 7. Create Appointments
    console.log('📅 Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointments = await Appointment.bulkCreate([
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[0].DoctorID,
        ClinicID: clinics[0].ClinicID,
        AppointmentDate: tomorrow.toISOString().split('T')[0],
        AppointmentTime: '10:00:00',
        Status: 'Scheduled'
      },
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        ClinicID: clinics[1].ClinicID,
        AppointmentDate: tomorrow.toISOString().split('T')[0],
        AppointmentTime: '14:30:00',
        Status: 'Scheduled'
      },
      {
        PatientID: patients[2].PatientID,
        DoctorID: doctors[2].DoctorID,
        ClinicID: clinics[0].ClinicID,
        AppointmentDate: nextWeek.toISOString().split('T')[0],
        AppointmentTime: '11:00:00',
        Status: 'Scheduled'
      },
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        ClinicID: clinics[0].ClinicID,
        AppointmentDate: '2025-10-20',
        AppointmentTime: '09:00:00',
        Status: 'Completed'
      },
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        ClinicID: clinics[1].ClinicID,
        AppointmentDate: '2025-10-15',
        AppointmentTime: '15:00:00',
        Status: 'Completed'
      }
    ]);
    console.log(`✅ Created ${appointments.length} appointments`);

    // 8. Create Medical Records
    console.log('📋 Creating medical records...');
    const medicalRecords = await MedicalRecord.bulkCreate([
      {
        PatientID: patients[0].PatientID,
        DoctorID: doctors[5].DoctorID,
        Diagnosis: 'Common cold with mild fever',
        Prescription: 'Paracetamol 500mg - 3 times daily for 3 days, Rest and fluids',
        Notes: 'Patient reported symptoms for 2 days. Temperature: 99.5°F. Advised to return if symptoms persist beyond 5 days.',
        VisitDate: '2025-10-20'
      },
      {
        PatientID: patients[3].PatientID,
        DoctorID: doctors[3].DoctorID,
        Diagnosis: 'Sprained ankle (Grade 1)',
        Prescription: 'Ibuprofen 400mg - twice daily for 5 days, Ice packs, Compression bandage',
        Notes: 'Injury occurred during sports. RICE protocol advised. Follow-up in 2 weeks.',
        VisitDate: '2025-10-15'
      },
      {
        PatientID: patients[1].PatientID,
        DoctorID: doctors[1].DoctorID,
        Diagnosis: 'Mild eczema',
        Prescription: 'Hydrocortisone cream 1% - Apply twice daily, Moisturizer',
        Notes: 'Avoid harsh soaps and hot water. Patch test performed. No allergies detected.',
        VisitDate: '2025-10-10'
      }
    ]);
    console.log(`✅ Created ${medicalRecords.length} medical records`);

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Summary:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ ${specializations.length} Specializations`);
    console.log(`✅ ${clinics.length} Clinics`);
    console.log(`✅ ${doctors.length} Doctors`);
    console.log(`✅ ${patients.length} Patients`);
    console.log(`✅ ${appointments.length} Appointments`);
    console.log(`✅ ${medicalRecords.length} Medical Records`);
    console.log(`✅ ${1 + doctorUsers.length + patientUsers.length} User Accounts`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🔑 Test Credentials:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('👑 Admin:');
    console.log('   Email: admin@clinic.com');
    console.log('   Password: admin123\n');
    console.log('👨‍⚕️ Doctors:');
    console.log('   Email: doctor1@clinic.com | Password: doctor123');
    console.log('   Email: doctor2@clinic.com | Password: doctor123');
    console.log('   Email: doctor3@clinic.com | Password: doctor123\n');
    console.log('👥 Patients:');
    console.log('   Email: ravi.patel@example.com | Password: patient123');
    console.log('   Email: sneha.reddy@example.com | Password: patient123');
    console.log('   Email: amit.verma@example.com | Password: patient123');
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
