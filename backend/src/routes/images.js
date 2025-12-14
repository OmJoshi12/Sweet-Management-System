const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/upload', async (req, res) => {
  try {
    const { filename, data } = req.body || {};
    if (!filename || !data || typeof data !== 'string') {
      return res.status(400).json({ error: 'filename and base64 data are required' });
    }
    const safeName = path.basename(filename).replace(/[^a-zA-Z0-9_.-]/g, '');
    const ext = (safeName.split('.').pop() || '').toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return res.status(400).json({ error: 'Only jpg, jpeg, png, webp allowed' });
    }
    const b64 = data.split(',').pop();
    const buf = Buffer.from(b64, 'base64');
    if (buf.length > 3 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large (max 3MB)' });
    }
    const uploadsDir = path.join(__dirname, '..', 'assets', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const stamp = Date.now();
    const finalName = `${stamp}-${safeName}`;
    const outPath = path.join(uploadsDir, finalName);
    await fs.promises.writeFile(outPath, buf);
    const publicPath = `/static/uploads/${finalName}`;
    const absoluteUrl = `${req.protocol}://${req.get('host')}${publicPath}`;
    res.json({ url: absoluteUrl });
  } catch (e) {
    console.error('Image upload error:', e.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
