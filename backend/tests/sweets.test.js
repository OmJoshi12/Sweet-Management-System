const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerAndLogin(email, password = 'StrongP@ss1') {
  await request(app).post('/api/auth/register').send({ email, password });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

async function createAdminAndLogin(email, password = 'AdminP@ss1') {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    role: 'admin',
  });
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
  return token;
}

describe('Sweets API', () => {
  let userToken;
  let adminToken;
  beforeEach(async () => {
    const timestamp = Date.now();
    userToken = await registerAndLogin(`user${timestamp}@example.com`);
    adminToken = await createAdminAndLogin(`admin${timestamp}@example.com`);
  });

  it('rejects listing sweets without auth', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.status).toBe(401);
  });

  it('lists sweets with auth token', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin can add a sweet', async () => {
    const ts = Date.now();
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Ladoo${ts}`, category: 'Indian', price: 5.5, quantity: 10, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(`Ladoo${ts}`);
  });

  it('rejects invalid sweet payloads', async () => {
    const missingFields = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '', category: '', price: -1, quantity: -2 });
    expect(missingFields.status).toBe(400);
    const badTypes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', category: 'Cat', price: 'x', quantity: 1.2 });
    expect(badTypes.status).toBe(400);
  });

  it('user cannot add a sweet', async () => {
    const ts = Date.now();
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: `Barfi${ts}`, category: 'Indian', price: 4, quantity: 5, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    expect(res.status).toBe(403);
  });

  it('lists sweets and supports search', async () => {
    const ts = Date.now();
    await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Rasgulla${ts}`, category: 'Bengali', price: 3, quantity: 20, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `GulamJamun${ts}`, category: 'Indian', price: 2.5, quantity: 15, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    const res = await request(app)
      .get('/api/sweets/search?category=Indian&minPrice=2&maxPrice=5')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin can update a sweet', async () => {
    const ts = Date.now();
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Peda${ts}`, category: 'Indian', price: 3, quantity: 8, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    const res = await request(app)
      .put(`/api/sweets/${create.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 3.5 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(3.5);
  });

  it('user cannot update a sweet', async () => {
    const ts = Date.now();
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Jalebi${ts}`, category: 'Indian', price: 2, quantity: 12, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    const res = await request(app)
      .put(`/api/sweets/${create.body._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 2.5 });
    expect(res.status).toBe(403);
  });

  it('purchase decreases quantity and prevents purchasing when quantity is zero', async () => {
    const ts = Date.now();
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Sandesh${ts}`, category: 'Bengali', price: 4, quantity: 1, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    const purchase = await request(app)
      .post(`/api/sweets/${create.body._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 1 });
    expect(purchase.status).toBe(200);
    expect(purchase.body.quantity).toBe(0);
    const fail = await request(app)
      .post(`/api/sweets/${create.body._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 1 });
    expect(fail.status).toBe(400);
    const invalidAmount = await request(app)
      .post(`/api/sweets/${create.body._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 0 });
    expect(invalidAmount.status).toBe(400);
  });

  it('admin can restock and admin-only delete', async () => {
    const ts = Date.now();
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `KajuKatli${ts}`, category: 'Indian', price: 6, quantity: 0, imageUrl: `https://source.unsplash.com/featured/800x600/?sweet,${ts}` });
    const restock = await request(app)
      .post(`/api/sweets/${create.body._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    expect(restock.status).toBe(200);
    expect(restock.body.quantity).toBe(5);
    const delUser = await request(app)
      .delete(`/api/sweets/${create.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(delUser.status).toBe(403);
    const delAdmin = await request(app)
      .delete(`/api/sweets/${create.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delAdmin.status).toBe(204);
  });
});
