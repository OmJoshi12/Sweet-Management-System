const mongoose = require('mongoose');

jest.setTimeout(30000);

beforeAll(async () => {
  const uri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetshop_test';
  await mongoose.connect(uri, { dbName: 'sweetshop_test' });
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
