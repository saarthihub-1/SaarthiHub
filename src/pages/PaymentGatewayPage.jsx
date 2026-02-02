import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';

function PaymentGatewayPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, purchaseItem, addPredictorCredits } = useAuth(); // kept for optimistic updates if needed

    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    // Get order details from URL params
    const amount = parseInt(searchParams.get('amount')) || 0;
    const productName = searchParams.get('product') || 'Order';
    const productId = searchParams.get('id') || '';
    const productType = searchParams.get('type') || 'mindmap'; // mindmap, bundle, credits
    const credits = parseInt(searchParams.get('credits')) || 0;

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!amount) {
        return (
            <div className="page">
                <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>⚠️</div>
                    <h1>Invalid Order</h1>
                    <p className="text-secondary mb-xl">No order details found.</p>
                    <button onClick={() => navigate('/store')} className="btn btn-primary">
                        Go to Store
                    </button>
                </div>
            </div>
        );
    }

    const handleRazorpayPayment = async () => {
        setError('');
        setProcessing(true);

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
            setError('Razorpay SDK failed to load. Please check your internet connection.');
            setProcessing(false);
            return;
        }

        try {
            // 1. Create Order on Backend
            const orderData = await paymentService.createOrder({
                amount,
                currency: 'INR',
                items: [{
                    productId: productId,
                    title: productName,
                    price: amount
                }]
            });

            // 2. Initialize Razorpay
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual key or env var
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SaarthiHub',
                description: productName,
                image: '/logo.jpg',
                order_id: orderData.id, // Order ID from backend
                handler: async function (response) {
                    try {
                        // 3. Verify Payment on Backend
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderData.orderId
                        });

                        handlePaymentSuccess(response);
                    } catch (verifyError) {
                        console.error('Payment Verification Failed:', verifyError);
                        setError('Payment verification failed. It might take a few minutes to reflect.');
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || '',
                },
                notes: {
                    product_id: productId,
                    product_type: productType,
                },
                theme: {
                    color: '#6366f1',
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error('Payment Initialization Failed:', err);
            setError('Failed to initiate payment. Please try again.');
            setProcessing(false);
        }
    };

    const handlePaymentSuccess = (response) => {
        // Process successful payment

        // Optimistically update context to reflect purchase immediately
        // (Though backend persists it, context needs to know without refresh if not refetching)
        if (productType === 'credits') {
            addPredictorCredits(credits);
        } else {
            purchaseItem(productId, productName);
        }

        // Redirect to success page
        navigate(`/payment-success?product=${encodeURIComponent(productName)}&amount=${amount}&txn=${response.razorpay_payment_id || 'demo'}`);
    };

    return (
        <div className="page">
            <div className="container container-sm" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        💳 <span className="gradient-text">Secure Payment</span>
                    </h1>
                    <p className="text-secondary">Complete your purchase securely</p>
                </div>

                {/* Order Summary */}
                <div className="card mb-xl">
                    <h3 className="mb-lg">Order Summary</h3>

                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <span className="text-muted">Product</span>
                        <strong>{productName}</strong>
                    </div>

                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <span className="text-muted">Type</span>
                        <span className="badge badge-primary">
                            {productType === 'credits' ? 'Predictor Credits' :
                                productType === 'bundle' ? 'Bundle' : 'Mind Map'}
                        </span>
                    </div>

                    <div className="flex justify-between py-md">
                        <span className="text-muted">Amount</span>
                        <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--success)' }}>
                            ₹{amount}
                        </span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="card mb-xl">
                    <h3 className="mb-lg">Payment Method</h3>

                    <div
                        className={`card mb-md ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('razorpay')}
                        style={{
                            cursor: 'pointer',
                            border: paymentMethod === 'razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            padding: 'var(--space-lg)',
                        }}
                    >
                        <div className="flex items-center gap-md">
                            <input
                                type="radio"
                                checked={paymentMethod === 'razorpay'}
                                onChange={() => setPaymentMethod('razorpay')}
                            />
                            <div className="flex items-center gap-md" style={{ flex: 1 }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: '#2563eb',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700,
                                }}>
                                    R
                                </div>
                                <div>
                                    <strong>Razorpay</strong>
                                    <p className="text-muted" style={{ marginBottom: 0, fontSize: 'var(--font-size-sm)' }}>
                                        UPI, Cards, Net Banking, Wallets
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-xs">
                                <span style={{ fontSize: '1.2rem' }}>💳</span>
                                <span style={{ fontSize: '1.2rem' }}>🏦</span>
                                <span style={{ fontSize: '1.2rem' }}>📱</span>
                            </div>
                        </div>
                    </div>

                    {/* UPI Info */}
                    <div
                        className="p-md"
                        style={{
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            marginTop: 'var(--space-md)',
                        }}
                    >
                        <div className="flex items-center gap-sm mb-sm">
                            <span>📱</span>
                            <strong style={{ fontSize: 'var(--font-size-sm)' }}>Supported Payment Options:</strong>
                        </div>
                        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                            <span className="badge">UPI</span>
                            <span className="badge">GPay</span>
                            <span className="badge">PhonePe</span>
                            <span className="badge">Paytm</span>
                            <span className="badge">Credit Card</span>
                            <span className="badge">Debit Card</span>
                            <span className="badge">Net Banking</span>
                        </div>
                    </div>
                </div>

                {/* Security Info */}
                <div className="card mb-xl" style={{ background: 'var(--bg-glass)' }}>
                    <div className="flex items-center gap-md">
                        <span style={{ fontSize: '2rem' }}>🔒</span>
                        <div>
                            <strong>100% Secure Payment</strong>
                            <p className="text-muted" style={{ marginBottom: 0, fontSize: 'var(--font-size-sm)' }}>
                                Your payment is secured by Razorpay with 256-bit SSL encryption
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger mb-lg">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Pay Button */}
                <button
                    className="btn btn-primary btn-lg w-full"
                    onClick={handleRazorpayPayment}
                    disabled={processing}
                    style={{ fontSize: 'var(--font-size-lg)' }}
                >
                    {processing ? (
                        <>
                            <span className="spinner" style={{ width: 20, height: 20 }}></span>
                            Processing...
                        </>
                    ) : (
                        <>Pay ₹{amount} Securely</>
                    )}
                </button>

                {/* Cancel Link */}
                <div className="text-center mt-lg">
                    <button
                        className="text-muted"
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        ← Cancel and go back
                    </button>
                </div>
            </div>

            <style>{`
        .py-md {
          padding-top: var(--space-md);
          padding-bottom: var(--space-md);
        }
      `}</style>
        </div>
    );
}

export default PaymentGatewayPage;
