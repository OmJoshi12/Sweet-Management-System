const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

const SEED_IMAGE_URLS = [
  'https://t3.ftcdn.net/jpg/08/90/02/30/240_F_890023062_ty9ZsOIEqlEDAH37Hgo4771Y2zmUd12V.jpg',
  'https://t4.ftcdn.net/jpg/16/46/57/59/240_F_1646575973_nMFe3pOTs5KZ5vWtGhL8jT4qIJSNK2Z6.jpg',
  'https://t3.ftcdn.net/jpg/08/31/16/46/240_F_831164686_pUWy1nbkh8NCbw2S1GrBQnqs5Uyk4Ijf.jpg',
  'https://t3.ftcdn.net/jpg/15/85/29/96/240_F_1585299670_DuPeMCihred0bmUka9tgBqfAPBqQwQ5y.jpg',
  'https://t3.ftcdn.net/jpg/06/29/98/58/240_F_629985879_GJNIb1gJlZnbJ003toSHzuIRkoEQBC3M.jpg',
];

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      role: 'user',
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Ensure at least 10 sweets exist for a new environment
    try {
      const count = await Sweet.countDocuments();
      if (count < 10) {
        const base = [
          { name: 'Chocolate Bar', category: 'Chocolate', price: 120.0, quantity: 20 },
          { name: 'Gummy Bears', category: 'Gummy', price: 80.0, quantity: 30 },
          { name: 'Lollipop', category: 'Candy', price: 30.0, quantity: 50 },
          { name: 'Donut', category: 'Donut', price: 60.0, quantity: 25 },
          { name: 'Cupcake', category: 'Cake', price: 75.0, quantity: 15 },
          { name: 'Cookie', category: 'Cookie', price: 40.0, quantity: 40 },
          { name: 'Ice Cream', category: 'Icecream', price: 90.0, quantity: 35 },
          { name: 'Caramel Toffee', category: 'Caramel', price: 55.0, quantity: 45 },
          { name: 'Fudge Brownie', category: 'Fudge', price: 110.0, quantity: 22 },
          { name: 'Macaron', category: 'Cookie', price: 95.0, quantity: 18 },
        ];
        const toInsert = await Promise.all(
          base.slice(count).map(async (item, idx) => {
            const imageUrl = SEED_IMAGE_URLS[idx % SEED_IMAGE_URLS.length];
            return { ...item, imageUrl };
          })
        );
        if (toInsert.length > 0) {
          await Sweet.insertMany(toInsert);
          console.log(`✅ Seeded ${toInsert.length} sweets to ensure minimum listing`);
        }
      }
    } catch (seedErr) {
      console.warn('⚠️ Sweet seeding on register failed:', seedErr.message);
    }

    res.status(201).json({
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
