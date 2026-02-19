import { useSearchParams, Link } from 'react-router-dom';

function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'mindmap';
    const id = searchParams.get('id') || '';
    const productName = searchParams.get('product') || '';
    const amount = searchParams.get('amount') || '0';
    const txn = searchParams.get('txn') || '';
    const credits = searchParams.get('credits') || '0';

    const isCredits = type === 'credits';
    const isBundle = type === 'bundle';

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
                        <span style={{ fontSize: '3rem' }}>
                            {isCredits ? '🎟️' : '✓'}
                        </span>
                    </div>

                    <h1 style={{ color: 'var(--success)', marginBottom: 'var(--space-md)' }}>
                        Payment Successful! 🎉
                    </h1>

                    <p className="text-secondary mb-xl">
                        {isCredits
                            ? `${credits} predictor credit${credits !== '1' ? 's' : ''} added to your account!`
                            : isBundle
                                ? 'All mind maps in this bundle are now unlocked!'
                                : 'You now have full access to your mind map.'
                        }
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
                        {txn && (
                            <div className="flex justify-between mb-sm">
                                <span className="text-muted">Transaction ID</span>
                                <span style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'monospace' }}>
                                    {txn}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between mb-sm">
                            <span className="text-muted">Product</span>
                            <span>{productName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Amount Paid</span>
                            <span className="text-success" style={{ fontWeight: 700 }}>
                                ₹{amount}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
                        {isCredits ? (
                            <Link to="/predictor" className="btn btn-success btn-lg">
                                Use Predictor →
                            </Link>
                        ) : isBundle ? (
                            <Link to="/dashboard" className="btn btn-success btn-lg">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <Link to={`/viewer/${id}`} className="btn btn-success btn-lg">
                                View Mind Map →
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
