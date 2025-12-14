const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetshop';
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      attempt++;
      console.warn(`⚠️  MongoDB connection attempt ${attempt}/${maxRetries} failed`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${err.message}`);
      }
    }
  }
};

module.exports = connectDB;
