require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./db');

// Import all models
const User = require('./models/user');
const Patient = require('./models/Patient');
const Specialization = require('./models/Specialization');
const Doctor = require('./models/Doctor');
const Clinic = require('./models/Clinic');
const Appointment = require('./models/Appointment');
const DoctorClinic = require('./models/DoctorClinic');
const MedicalRecord = require('./models/medicalRecord');

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
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/clinics', clinicsRouter);
app.use('/api/specializations', specsRouter);
app.use('/api/appointments', apptsRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;

async function start(){
  try{
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }catch(e){
    console.error('❌ Error:', e);
    process.exit(1);
  }
}

start();
