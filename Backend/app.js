// ============================================
// src/app.js
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const patientRoutes = require('./src/routes/patients');
const doctorRoutes = require('./src/routes/doctors');
const staffRoutes = require('./src/routes/staff');
const appointmentRoutes = require('./src/routes/appointments');
const medicalRecordRoutes = require('./src/routes/medicalRecords');
const prescriptionRoutes = require('./src/routes/prescriptions');
const billingRoutes = require('./src/routes/billing');
const dashboardRoutes = require('./src/routes/dashboard');
const specializationRoutes = require('./src/routes/specialization');
const clinicRoutes = require('./src/routes/clinics');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/src/api/auth', authRoutes);
app.use('/src/api/patients', patientRoutes);
app.use('/src/api/doctors', doctorRoutes);
app.use('/src/api/staff', staffRoutes);
app.use('/src/api/appointments', appointmentRoutes);
app.use('/src/api/medical-records', medicalRecordRoutes);
app.use('/src/api/prescriptions', prescriptionRoutes);
app.use('/src/api/billing', billingRoutes);
app.use('/src/api/dashboard', dashboardRoutes);
app.use('/src/api/specialization', specializationRoutes);
app.use('/src/api/clinics', clinicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;