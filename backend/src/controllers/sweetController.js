const Sweet = require('../models/Sweet');
const { isValidStaticImageUrl, isAllowedImageHost } = require('../services/imageService');

const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, imageUrl } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        error: 'name, category, price and quantity are required',
      });
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    const p = Number(price);
    const q = Number(quantity);

    if (isNaN(p) || p < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }

    if (!Number.isInteger(q) || q < 0) {
      return res.status(400).json({ error: 'quantity must be a non-negative integer' });
    }

    const uCreate = imageUrl.trim();
    const isLocalStaticCreate = uCreate.startsWith('/static/');
    const okRemote = isValidStaticImageUrl(uCreate) && isAllowedImageHost(uCreate);
    if (!isLocalStaticCreate && !okRemote) {
      return res.status(400).json({ error: 'Invalid imageUrl. Select one of the 5 fixed images or upload a local image.' });
    }
    const finalImageUrl = uCreate;
    const payload = { name, category, price: p, quantity: q, imageUrl: finalImageUrl };
    const sweet = await Sweet.create(payload);

    res.status(201).json(sweet);
  } catch (err) {
    console.error('Create sweet error:', err);
    res.status(500).json({ error: 'Failed to create sweet' });
  }
};

const listSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    console.error('List sweets error:', err);
    res.status(500).json({ error: 'Failed to list sweets' });
  }
};

const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    console.error('Search sweets error:', err);
    res.status(500).json({ error: 'Failed to search sweets' });
  }
};
const getSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (err) {
    console.error('Get sweet error:', err);
    res.status(500).json({ error: 'Failed to get sweet' });
  }
};

const updateSweet = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.category) updates.category = req.body.category;

    if (req.body.price !== undefined) {
      const p = Number(req.body.price);
      if (isNaN(p) || p < 0) {
        return res.status(400).json({ error: 'Invalid price' });
      }
      updates.price = p;
    }

    if (req.body.quantity !== undefined) {
      const q = Number(req.body.quantity);
      if (!Number.isInteger(q) || q < 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }
      updates.quantity = q;
    }

    if (req.body.imageUrl !== undefined) {
      const u = String(req.body.imageUrl || '').trim();

      if (u.length === 0) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }

      const isLocalStatic = u.startsWith('/static/');
      const okRemote = isValidStaticImageUrl(u) && isAllowedImageHost(u);
      if (!isLocalStatic && !okRemote) {
        return res.status(400).json({ error: 'Invalid imageUrl. Select one of the 5 fixed images or upload a local image.' });
      }

      updates.imageUrl = u;
    }

    const sweet = await Sweet.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (err) {
    console.error('Update sweet error:', err);
    res.status(500).json({ error: 'Failed to update sweet' });
  }
};

const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Delete sweet error:', err);
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
};

const purchaseSweet = async (req, res) => {
  try {
    const id = req.params.id;
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return res
        .status(400)
        .json({ error: 'amount must be a positive integer' });
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < amount) {
      return res.status(400).json({ error: 'Insufficient quantity' });
    }

    sweet.quantity -= amount;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    console.error('Purchase sweet error:', err);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

const restockSweet = async (req, res) => {
  try {
    const id = req.params.id;
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return res
        .status(400)
        .json({ error: 'amount must be a positive integer' });
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += amount;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    console.error('Restock sweet error:', err);
    res.status(500).json({ error: 'Restock failed' });
  }
};

module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  getSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
