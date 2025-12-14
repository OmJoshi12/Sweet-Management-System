const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'admin123';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('\nAdmin user already exists!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      mongoose.connection.close();
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({
      email,
      password: hashed,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\nYou can now login at http://localhost:3000/login');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin:', err);
    mongoose.connection.close();
  }
}

createAdmin();
