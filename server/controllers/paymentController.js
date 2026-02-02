const Razorpay = require('razorpay');
const crypto = require('crypto');
const jsonDb = require('../utils/jsonDb');

const ORDER_COLLECTION = 'orders';
const USER_COLLECTION = 'users';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
const createOrder = async (req, res) => {
    const { amount, currency, items } = req.body;

    const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    try {
        // Create order in Razorpay
        // In Lite Mode with placeholder keys, this might fail if keys are invalid.
        // We wrap it to allow "fake" success if keys are dummies.
        let response;
        if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
            response = await razorpay.orders.create(options);
        } else {
            // Fake response for demo
            response = {
                id: `order_fake_${Date.now()}`,
                currency: currency,
                amount: amount * 100
            };
        }

        // Create order in DB
        const order = jsonDb.create(ORDER_COLLECTION, {
            userId: req.user.id,
            items,
            totalAmount: amount,
            currency,
            razorpayOrderId: response.id,
            status: 'created'
        });

        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            orderId: order._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // In Lite Mode/Demo, strict signature verification is tricky without real keys.
    // If we used fake order, we skip verification or allow it.

    let isAuthentic = false;

    if (razorpay_order_id.startsWith('order_fake_')) {
        isAuthentic = true; // Allow fake orders
    } else {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');
        isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
        // Update order status
        const order = jsonDb.update(
            ORDER_COLLECTION,
            { razorpayOrderId: razorpay_order_id },
            {
                status: 'paid',
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Add items/credits to user
        const user = jsonDb.findById(USER_COLLECTION, req.user.id);

        if (user) {
            // Need to update user. We'll modify a copy and save it.
            let updatedUser = { ...user };
            // Ensure arrays exist
            if (!updatedUser.purchasedItems) updatedUser.purchasedItems = [];

            for (const item of order.items) {
                if (item.title.toLowerCase().includes('credits')) {
                    let creditsToAdd = 0;
                    if (item.title.includes('3')) creditsToAdd = 3;
                    else if (item.title.includes('10')) creditsToAdd = 10;

                    // Logic: predictorUsage decreases when buying credits (more available)
                    const currentUsage = updatedUser.predictorUsage || 0;
                    updatedUser.predictorUsage = Math.max(0, currentUsage - creditsToAdd);
                } else {
                    if (!updatedUser.purchasedItems.includes(item.productId)) {
                        updatedUser.purchasedItems.push(item.productId);
                    }
                }
            }

            jsonDb.findByIdAndUpdate(USER_COLLECTION, req.user.id, updatedUser);
        }

        res.json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
