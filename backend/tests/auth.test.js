const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  const user = { email: 'alice@example.com', password: 'Passw0rd!' };

  it('registers a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.role).toBe('user');
  });

  it('rejects missing email or password', async () => {
    const missingEmail = await request(app).post('/api/auth/register').send({ password: '12345678' });
    expect(missingEmail.status).toBe(400);
    const missingPassword = await request(app).post('/api/auth/register').send({ email: 'ok@example.com' });
    expect(missingPassword.status).toBe(400);
    const missing = await request(app).post('/api/auth/register').send({});
    expect(missing.status).toBe(400);
  });

  it('prevents duplicate registration by email', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials and returns token', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(user.email);
  });

  it('rejects login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(400);
  });

  it('rejects login when missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: '' });
    expect(res.status).toBe(400);
  });
});

describe('Auth Routes', () => {
  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});
