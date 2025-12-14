require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    // Ensure default admin exists
    try {
      const adminEmail = 'admin@example.com';
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const hashed = await bcrypt.hash('admin123', 10);
        await User.create({ email: adminEmail, password: hashed, role: 'admin' });
        console.log('✅ Default admin created: admin@example.com / admin123');
      }
    } catch (e) {
      console.warn('⚠️ Admin seeding failed:', e.message);
    }
    const server = app.listen(Number(PORT), () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(
          `❌ Port ${PORT} is already in use. Stop the other running backend, or change PORT in backend/.env and frontend/.env.`
        );
        process.exit(1);
      }
      console.error('❌ Failed to start server:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
