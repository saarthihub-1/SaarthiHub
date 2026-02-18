const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { firebaseProtect } = require('../middleware/firebaseAuthMiddleware');

// Protected by Firebase authentication
router.post('/order', firebaseProtect, createOrder);
router.post('/verify', firebaseProtect, verifyPayment);

module.exports = router;
