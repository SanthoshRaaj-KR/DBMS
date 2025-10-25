require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./db');

// Import all models
const User = require('./models/User');
const Patient = require('./models/Patient');
const Specialization = require('./models/Specialization');
const Doctor = require('./models/Doctor');
const Clinic = require('./models/Clinic');
const Appointment = require('./models/Appointment');
const DoctorClinic = require('./models/DoctorClinic');
const MedicalRecord = require('./models/MedicalRecord'); // ✅ Fixed capitalization

// Set up DoctorClinic associations
DoctorClinic.belongsTo(Doctor, { foreignKey: 'DoctorID' });
DoctorClinic.belongsTo(Clinic, { foreignKey: 'ClinicID' });
Doctor.hasMany(DoctorClinic, { foreignKey: 'DoctorID' });
Clinic.hasMany(DoctorClinic, { foreignKey: 'ClinicID' });

// Import routes
const authRouter = require('./routes/auth');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const clinicsRouter = require('./routes/clinics');
const specsRouter = require('./routes/specializations');
const apptsRouter = require('./routes/appointments');
const medicalRecordsRouter = require('./routes/medicalRecords');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // ✅ More secure CORS
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/clinics', clinicsRouter);
app.use('/api/specializations', specsRouter);
app.use('/api/appointments', apptsRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ DB connected');
    
    // Sync models (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (e) {
    console.error('❌ Error starting server:', e);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await sequelize.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

start();
