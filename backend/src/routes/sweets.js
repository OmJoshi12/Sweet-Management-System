const express = require('express');
const router = express.Router();
const sweetCtrl = require('../controllers/sweetController');
const { auth, adminOnly } = require('../middleware/auth');

// Protected routes (JWT required)
router.get('/', auth, sweetCtrl.listSweets);
router.get('/search', auth, sweetCtrl.searchSweets);
router.get('/:id', auth, sweetCtrl.getSweet);

// Admin-only create/update/delete
router.post('/', auth, adminOnly, sweetCtrl.createSweet);
router.put('/:id', auth, adminOnly, sweetCtrl.updateSweet);
router.delete('/:id', auth, adminOnly, sweetCtrl.deleteSweet);

// Purchase and restock (authenticated)
router.post('/:id/purchase', auth, sweetCtrl.purchaseSweet);
router.post('/:id/restock', auth, adminOnly, sweetCtrl.restockSweet);

module.exports = router;
