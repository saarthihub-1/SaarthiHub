const Razorpay = require('razorpay');
const crypto = require('crypto');
const { db, isInitialized } = require('../config/firebaseAdmin');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private (Firebase Auth)
const createOrder = async (req, res) => {
    const { amount, currency, items } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
        amount: amount * 100, // Amount in paise
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        // Create real Razorpay order
        const razorpayOrder = await razorpay.orders.create(options);

        // Store order in Firestore
        if (isInitialized && db) {
            await db.collection('orders').add({
                userId: req.user.uid,
                userEmail: req.user.email,
                items,
                totalAmount: amount,
                currency: currency || 'INR',
                razorpayOrderId: razorpayOrder.id,
                status: 'created',
                createdAt: new Date(),
            });
        }

        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private (Firebase Auth)
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        return res.status(400).json({ message: 'Payment verification failed - invalid signature' });
    }

    try {
        if (isInitialized && db) {
            // Update order status in Firestore
            const ordersRef = db.collection('orders');
            const orderQuery = ordersRef
                .where('razorpayOrderId', '==', razorpay_order_id)
                .where('userId', '==', req.user.uid);

            const orderSnapshot = await orderQuery.get();

            if (!orderSnapshot.empty) {
                const orderDoc = orderSnapshot.docs[0];
                const orderData = orderDoc.data();

                await orderDoc.ref.update({
                    status: 'paid',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    paidAt: new Date(),
                });

                // Record purchase for each item
                for (const item of orderData.items) {
                    if (!item.title?.toLowerCase().includes('credits')) {
                        // Record product purchase
                        const existingPurchase = await db.collection('purchases')
                            .where('userId', '==', req.user.uid)
                            .where('productId', '==', item.productId)
                            .get();

                        if (existingPurchase.empty) {
                            await db.collection('purchases').add({
                                userId: req.user.uid,
                                productId: item.productId,
                                productName: item.title,
                                amount: item.price,
                                razorpayPaymentId: razorpay_payment_id,
                                paid: true,
                                purchasedAt: new Date(),
                            });
                        }
                    }
                }
            }
        }

        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
