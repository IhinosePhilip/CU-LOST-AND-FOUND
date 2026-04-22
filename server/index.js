const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Startup check
console.log('🔄 Starting CU Lost & Found server...');
console.log('📦 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 MONGODB_URI set:', !!process.env.MONGODB_URI);
console.log('🔑 JWT_SECRET set:', !!process.env.JWT_SECRET);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Check your environment variables on Render.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Check your environment variables on Render.');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/items',    require('./routes/items'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin',    require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CU Lost & Found server is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Auto-create admin on first run
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
      console.log(`👤 Admin created: ${adminEmail}`);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
