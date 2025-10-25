require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════════');
      console.log(`🚀 Hospital Management System Server`);
      console.log('═══════════════════════════════════════════════════════');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════════');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
      await sequelize.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM received, shutting down...');
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
      await sequelize.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();