/**
 * Development server with in-memory MongoDB
 * No MongoDB installation required!
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CU Lost & Found server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start with in-memory MongoDB
async function startServer() {
  try {
    console.log('🔄 Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
    console.log('✅ Connected to in-memory MongoDB');
    console.log('📦 Database URI:', uri);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
      console.log('');
      console.log('🚀 ================================');
      console.log(`🚀  CU Lost & Found Server`);
      console.log(`🚀  Running on port ${PORT}`);
      console.log('🚀 ================================');
      console.log('');
      console.log('📡 API Endpoints:');
      console.log(`   POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/api/items`);
      console.log(`   POST http://localhost:${PORT}/api/items`);
      console.log('');
      console.log('⚠️  Note: In-memory DB resets on server restart.');
      console.log('   For persistent data, set MONGODB_URI in .env');
      console.log('');

      // Auto-create admin account on startup
      const User = require('./models/User');
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@stu.cu.edu.ng';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        await User.create({
          email: adminEmail,
          password: adminPassword,
          fullName: 'CU Admin',
          phoneNumber: '00000000000',
          department: 'Administration',
          level: 'Staff',
          verified: true,
          role: 'admin'
        });
        console.log('👤 Admin account created:');
        console.log(`   Email:    ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log('   ⚠️  Change these in .env for production!\n');
      }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.disconnect();
      await mongod.stop();
      console.log('\n👋 Server stopped gracefully');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
