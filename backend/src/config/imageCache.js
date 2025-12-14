const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Sweet = require('../models/Sweet');
const PORT = process.env.PORT || 4000;
const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;

const CATEGORIES = [
  'Chocolate',
  'Candy',
  'Gummy',
  'Lollipop',
  'Donut',
  'Cake',
  'Cookie',
  'Icecream',
  'Caramel',
  'Fudge',
];

const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, '');

const assetsDir = path.join(__dirname, '..', 'assets');
const customDir = path.join(assetsDir, 'custom');

const ensureCategoryAssets = () => {
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  for (const cat of CATEGORIES) {
    const cDir = path.join(assetsDir, normalize(cat));
    if (!fs.existsSync(cDir)) {
      fs.mkdirSync(cDir, { recursive: true });
    }
    for (let i = 1; i <= 3; i++) {
      const file = path.join(cDir, `${i}.svg`);
      if (!fs.existsSync(file)) {
        const svg = buildCategorySVG(cat, i);
        fs.writeFileSync(file, svg, 'utf8');
      }
    }
  }
};

const buildCategorySVG = (category, variant) => {
  const palettes = [
    { a: '#a78bfa', b: '#ec4899' },
    { a: '#06b6d4', b: '#a78bfa' },
    { a: '#f59e0b', b: '#ef4444' },
  ];
  const p = palettes[(variant - 1) % palettes.length];
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.a}" />
      <stop offset="100%" stop-color="${p.b}" />
    </linearGradient>
    <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="150" cy="150" r="90" fill="#ffffff20" filter="url(#blur)"/>
  <circle cx="650" cy="450" r="110" fill="#00000020" filter="url(#blur)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, Arial" font-size="64" font-weight="800" fill="#ffffffdd">
    ${category}
  </text>
  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, Arial" font-size="24" font-weight="600" fill="#ffffffaa">
    Variant ${variant}
  </text>
</svg>
`.trim();
};

const localStaticUrl = (category, index) =>
  `${PUBLIC_BASE}/static/${normalize(category)}/${index}.svg`;

const pickIndex = (seed) => {
  const s = String(seed || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 3) + 1;
};

const assignLocalImagesToSweets = async () => {
  await ensureCategoryAssets();
  const sweets = await Sweet.find({});
  const ops = sweets.map((s) => {
    const idx = pickIndex(s._id);
    const url = localStaticUrl(s.category || 'Candy', idx);
    if (s.imageUrl !== url) {
      return Sweet.updateOne({ _id: s._id }, { $set: { imageUrl: url } });
    }
    return null;
  }).filter(Boolean);
  if (ops.length > 0) {
    await Promise.all(ops);
    console.log(`✅ Assigned local images to ${ops.length} sweets`);
  } else {
    console.log('ℹ️ Sweets already using local images');
  }
};

// Custom image mapping based on provided links
const CUSTOM_IMAGES = {
  'Ice Cream': 'https://images.pexels.com/photos/7144269/pexels-photo-7144269.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Dark Candy': 'https://images.pexels.com/photos/6291521/pexels-photo-6291521.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Caramel Toffee': 'https://images.pexels.com/photos/128399/pexels-photo-128399.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Fudge Brownie': 'https://images.pexels.com/photos/5386671/pexels-photo-5386671.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Macaron': 'https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Cupcake': 'https://images.pexels.com/photos/1546892/pexels-photo-1546892.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Cookie': 'https://images.pexels.com/photos/4110528/pexels-photo-4110528.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Dark Chocolate': 'https://images.pexels.com/photos/6261618/pexels-photo-6261618.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Gummy Bears': 'https://images.pexels.com/photos/7667728/pexels-photo-7667728.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Lollipop': 'https://images.pexels.com/photos/1540408/pexels-photo-1540408.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
  'Chocolate Bar': 'https://images.pexels.com/photos/9045849/pexels-photo-9045849.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000',
};

const ensureCustomDir = () => {
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  if (!fs.existsSync(customDir)) fs.mkdirSync(customDir, { recursive: true });
};

const filenameFor = (name) => `${normalize(name)}.jpg`;
const localCustomUrl = (name) => `${PUBLIC_BASE}/static/custom/${filenameFor(name)}`;

const downloadCustomImages = async () => {
  ensureCustomDir();
  const entries = Object.entries(CUSTOM_IMAGES);
  for (const [name, url] of entries) {
    const file = path.join(customDir, filenameFor(name));
    if (fs.existsSync(file)) continue;
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
      fs.writeFileSync(file, res.data);
      console.log(`✅ Downloaded image for "${name}"`);
    } catch (e) {
      console.warn(`⚠️ Failed to download image for "${name}": ${e.message}`);
    }
  }
};

const assignCustomImagesToSweets = async () => {
  const names = Object.keys(CUSTOM_IMAGES);
  for (const n of names) {
    const sweet = await Sweet.findOne({ name: new RegExp(`^${n}$`, 'i') });
    if (sweet) {
      const remoteUrl = CUSTOM_IMAGES[n];
      if (sweet.imageUrl !== remoteUrl) {
        await Sweet.updateOne({ _id: sweet._id }, { $set: { imageUrl: remoteUrl } });
        console.log(`✅ Set custom image for "${n}"`);
      }
    }
  }
  await Sweet.updateMany(
    { name: { $nin: names } },
    { $unset: { imageUrl: "" } }
  );
  console.log('ℹ️ Cleared imageUrl for non-listed sweets');
};

module.exports = {
  ensureCategoryAssets,
  assignLocalImagesToSweets,
  localStaticUrl,
  downloadCustomImages,
  assignCustomImagesToSweets,
};
