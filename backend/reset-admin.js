const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'admin123';

    // Delete existing admin
    const deleted = await User.deleteOne({ email });
    console.log(`Deleted ${deleted.deletedCount} existing admin user(s)`);

    // Create new admin
    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({
      email,
      password: hashed,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('========================================');
    console.log('LOGIN CREDENTIALS:');
    console.log('========================================');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('========================================\n');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Enter email: admin@example.com');
    console.log('3. Enter password: admin123');
    console.log('4. Click Login\n');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    mongoose.connection.close();
  }
}

resetAdmin();
