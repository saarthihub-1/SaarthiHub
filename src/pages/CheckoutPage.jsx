import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMindmapById, getBundleById, subjects } from '../data/mindmaps';
import PaymentButton from '../components/PaymentButton';

function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const type = searchParams.get('type'); // 'mindmap' or 'bundle'
    const id = searchParams.get('id');

    if (!user) {
        navigate('/login');
        return null;
    }

    const item = type === 'bundle' ? getBundleById(id) : getMindmapById(id);

    if (!item) {
        return (
            <div className="page">
                <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
                    <h1>Product Not Found</h1>
                    <Link to="/store" className="btn btn-primary mt-lg">
                        Browse Store
                    </Link>
                </div>
            </div>
        );
    }

    const subject = type === 'bundle'
        ? (item.subject === 'all' ? null : subjects.find(s => s.id === item.subject))
        : subjects.find(s => s.id === item.subject);

    const handleSuccess = () => {
        navigate(`/payment-success?type=${type}&id=${id}`);
    };

    const handleFailure = () => {
        navigate('/payment-failure');
    };

    return (
        <div className="page">
            <div className="container container-sm" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        💳 <span className="gradient-text">Checkout</span>
                    </h1>
                </div>

                <div className="card">
                    {/* Order Summary */}
                    <h3 className="mb-lg">Order Summary</h3>

                    <div
                        className="p-lg mb-lg"
                        style={{
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <div className="flex gap-lg items-start">
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: subject ? `${subject.color}20` : 'var(--bg-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    flexShrink: 0,
                                }}
                            >
                                {subject?.icon || '📦'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <span className="badge badge-primary mb-sm">
                                    {type === 'bundle' ? 'BUNDLE' : 'MIND MAP'}
                                </span>
                                <h4 style={{ marginBottom: 'var(--space-xs)' }}>
                                    {type === 'bundle' ? item.name : item.title}
                                </h4>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 0 }}>
                                    {type === 'bundle' ? item.description : item.chapter}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mb-xl">
                        <div className="flex justify-between mb-sm">
                            <span className="text-secondary">Subtotal</span>
                            <span>
                                {type === 'bundle' && (
                                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: 'var(--space-sm)' }}>
                                        ₹{item.originalPrice}
                                    </span>
                                )}
                                ₹{item.price}
                            </span>
                        </div>
                        {type === 'bundle' && (
                            <div className="flex justify-between mb-sm text-success">
                                <span>Bundle Discount</span>
                                <span>-₹{item.originalPrice - item.price}</span>
                            </div>
                        )}
                        <div className="flex justify-between mb-sm">
                            <span className="text-secondary">GST (Included)</span>
                            <span className="text-muted">₹0</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 'var(--space-md) 0' }} />
                        <div className="flex justify-between">
                            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>Total</span>
                            <span style={{ fontWeight: 800, fontSize: 'var(--font-size-2xl)', color: 'var(--success)' }}>
                                ₹{item.price}
                            </span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div
                        className="mb-xl p-lg"
                        style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}
                    >
                        <h4 className="mb-sm">🔒 Secure Payment</h4>
                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 0 }}>
                            Your payment is processed securely through Razorpay. We never store your card details.
                        </p>
                    </div>

                    {/* Billing Info */}
                    <div className="mb-xl">
                        <h4 className="mb-md">Billing Details</h4>
                        <div
                            className="p-lg"
                            style={{
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-lg)',
                            }}
                        >
                            <div className="flex justify-between mb-sm">
                                <span className="text-muted">Name</span>
                                <span>{user.name}</span>
                            </div>
                            <div className="flex justify-between mb-sm">
                                <span className="text-muted">Email</span>
                                <span>{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Phone</span>
                                <span>{user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <PaymentButton
                        amount={item.price}
                        productName={type === 'bundle' ? item.name : item.title}
                        productId={type === 'bundle' ? item.items : id}
                        onSuccess={handleSuccess}
                        onFailure={handleFailure}
                        buttonText="Complete Purchase"
                        className="btn btn-primary w-full btn-lg"
                    />

                    {/* Terms */}
                    <p className="text-center text-muted mt-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                        By completing this purchase, you agree to our{' '}
                        <a href="#terms">Terms of Service</a> and <a href="#refund">Refund Policy</a>.
                    </p>
                </div>

                {/* Back to Store */}
                <div className="text-center mt-xl">
                    <Link to="/store" className="text-secondary">
                        ← Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
