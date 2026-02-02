import { useSearchParams, Link } from 'react-router-dom';
import { getMindmapById, getBundleById } from '../data/mindmaps';

function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const product = searchParams.get('product'); // For direct product purchase

    const productId = product || id;
    const item = type === 'bundle'
        ? getBundleById(productId)
        : getMindmapById(productId);

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container container-sm text-center">
                <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)' }}>
                    {/* Success Animation */}
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto var(--space-xl)',
                            background: 'var(--gradient-success)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'pop 0.5s ease',
                        }}
                    >
                        <span style={{ fontSize: '3rem' }}>✓</span>
                    </div>

                    <h1 style={{ color: 'var(--success)', marginBottom: 'var(--space-md)' }}>
                        Payment Successful! 🎉
                    </h1>

                    <p className="text-secondary mb-xl">
                        Thank you for your purchase. You now have full access to your content.
                    </p>

                    {/* Order Details */}
                    <div
                        className="p-lg mb-xl"
                        style={{
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'left',
                        }}
                    >
                        <div className="flex justify-between mb-sm">
                            <span className="text-muted">Order ID</span>
                            <span>#{Date.now().toString().slice(-8)}</span>
                        </div>
                        {item && (
                            <div className="flex justify-between mb-sm">
                                <span className="text-muted">Product</span>
                                <span>{type === 'bundle' ? item.name : item.title}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted">Amount Paid</span>
                            <span className="text-success" style={{ fontWeight: 700 }}>
                                ₹{item?.price || '—'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
                        {productId && type !== 'bundle' ? (
                            <Link to={`/viewer/${productId}`} className="btn btn-success btn-lg">
                                View Mind Map →
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="btn btn-success btn-lg">
                                Go to Dashboard →
                            </Link>
                        )}
                        <Link to="/store" className="btn btn-secondary btn-lg">
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Receipt Info */}
                    <p className="text-muted mt-xl" style={{ fontSize: 'var(--font-size-sm)' }}>
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
}

export default PaymentSuccessPage;
