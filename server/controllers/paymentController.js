const Razorpay = require('razorpay');
const crypto = require('crypto');
const { db, isInitialized, admin } = require('../config/firebaseAdmin');

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

                // Process each item in the order
                for (const item of orderData.items) {
                    await processOrderItem(req.user.uid, item, razorpay_payment_id, orderData.totalAmount);
                }
            }
        }

        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

/**
 * Process a single order item after payment verification.
 * Handles: mindmaps, bundles (expand to individual items), credits
 */
async function processOrderItem(userId, item, razorpayPaymentId, amount) {
    const productId = item.productId;

    // Check if this is a credit purchase
    if (productId.startsWith('credits-')) {
        // Get credit amount from products collection
        const productDoc = await db.collection('products').doc(productId).get();
        const credits = productDoc.exists ? productDoc.data().credits : 0;

        if (credits > 0) {
            // Add credits to user profile
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
                predictorCredits: admin.firestore.FieldValue.increment(credits),
            });
            console.log(`✅ Added ${credits} predictor credits for user ${userId}`);
        }

        // Record purchase
        await recordPurchaseIfNew(userId, productId, item.title, amount, razorpayPaymentId);
        return;
    }

    // Check if this is a bundle
    const productDoc = await db.collection('products').doc(productId).get();
    if (productDoc.exists && productDoc.data().type === 'bundle') {
        const bundleData = productDoc.data();
        const includes = bundleData.includes || [];

        // Record purchase for the bundle itself
        await recordPurchaseIfNew(userId, productId, item.title, amount, razorpayPaymentId);

        // Also record purchase for each individual item in the bundle
        for (const includedId of includes) {
            const includedDoc = await db.collection('products').doc(includedId).get();
            const includedTitle = includedDoc.exists ? includedDoc.data().title : includedId;
            await recordPurchaseIfNew(userId, includedId, includedTitle, 0, razorpayPaymentId);
        }

        console.log(`✅ Bundle ${productId} purchased - ${includes.length} items unlocked for user ${userId}`);
        return;
    }

    // Regular mindmap purchase
    await recordPurchaseIfNew(userId, productId, item.title, amount, razorpayPaymentId);
    console.log(`✅ Product ${productId} purchased for user ${userId}`);
}

/**
 * Record a purchase in Firestore if it doesn't already exist
 */
async function recordPurchaseIfNew(userId, productId, productName, amount, razorpayPaymentId) {
    const existingPurchase = await db.collection('purchases')
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .get();

    if (existingPurchase.empty) {
        await db.collection('purchases').add({
            userId,
            productId,
            productName: productName || productId,
            amount,
            razorpayPaymentId,
            paid: true,
            purchasedAt: new Date(),
        });
    }
}

module.exports = {
    createOrder,
    verifyPayment,
};
