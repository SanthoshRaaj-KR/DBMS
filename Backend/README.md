# Hospital Management System - Backend

A comprehensive hospital management system built with Node.js, Express, PostgreSQL, and Sequelize.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 Patient Management
- 👨‍⚕️ Doctor Management
- 👔 Staff Management
- 📅 Appointment Scheduling
- 📋 Medical Records
- 💊 Prescription Management
- 💰 Billing & Payment System
- 📊 Dashboard & Analytics

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hospital-management-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up PostgreSQL database
```bash
createdb hospital_db
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. Seed the database (optional)
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Medical Records
- `GET /api/medical-records/patient/:patientId` - Get patient records
- `POST /api/medical-records` - Create medical record
- `PUT /api/medical-records/:id` - Update medical record

### Prescriptions
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription

### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing/:id` - Get bill by ID
- `POST /api/billing` - Create bill
- `POST /api/billing/:id/payment` - Record payment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/appointments/today` - Get today's appointments
- `GET /api/dashboard/revenue` - Get revenue statistics

## User Roles

- **admin** - Full system access
- **doctor** - Manage appointments, medical records, prescriptions
- **staff** - Manage patients, appointments, billing
- **patient** - View own data

## Database Schema

The system uses 11 main tables:
- Users
- Patients
- Doctors
- Staff
- Specializations
- Departments
- Appointments
- MedicalRecords
- Prescriptions
- Billing
- Payments

## Testing

Use the seed script to populate the database with test data:
```bash
npm run seed
```

Test credentials will be displayed after seeding.

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
