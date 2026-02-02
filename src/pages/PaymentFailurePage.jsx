import { Link, useNavigate } from 'react-router-dom';

function PaymentFailurePage() {
    const navigate = useNavigate();

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container container-sm text-center">
                <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)' }}>
                    {/* Failure Icon */}
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto var(--space-xl)',
                            background: 'var(--gradient-danger)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span style={{ fontSize: '3rem' }}>✗</span>
                    </div>

                    <h1 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>
                        Payment Failed 😕
                    </h1>

                    <p className="text-secondary mb-xl">
                        Your payment could not be processed. Don't worry, no amount has been deducted from your account.
                    </p>

                    {/* Common Issues */}
                    <div
                        className="p-lg mb-xl text-left"
                        style={{
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <h4 className="mb-md">Common reasons for failure:</h4>
                        <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>Insufficient funds in your account</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>Card limit exceeded</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>Network connectivity issues</li>
                            <li style={{ marginBottom: 'var(--space-sm)' }}>Bank server temporarily unavailable</li>
                            <li>Incorrect card details</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate(-1)}
                        >
                            🔄 Try Again
                        </button>
                        <Link to="/store" className="btn btn-secondary btn-lg">
                            Browse Store
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="mt-xl p-lg" style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                    }}>
                        <h4 className="mb-sm">Need Help?</h4>
                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 0 }}>
                            If the issue persists, please contact our support team at{' '}
                            <a href="mailto:support@jeeprep.com" style={{ color: 'var(--accent)' }}>
                                support@jeeprep.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailurePage;
