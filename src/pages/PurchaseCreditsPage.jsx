import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictorCredits } from '../data/mindmaps';
import PaymentButton from '../components/PaymentButton';

function PurchaseCreditsPage() {
    const { user, getRemainingPredictorUses } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/predictor', { state: { purchased: true } });
    };

    const handleFailure = () => {
        navigate('/payment-failure');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const remainingUses = getRemainingPredictorUses();

    return (
        <div className="page">
            <div className="container container-sm" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        🎟️ Purchase <span className="gradient-text">Predictor Credits</span>
                    </h1>
                    <p className="text-secondary">
                        Get more predictions to track your progress
                    </p>
                </div>

                {/* Current Status */}
                <div className="card mb-xl text-center" style={{ padding: 'var(--space-lg)' }}>
                    <p className="text-secondary mb-sm">Current Credits</p>
                    <div style={{
                        fontSize: 'var(--font-size-4xl)',
                        fontWeight: 800,
                        color: remainingUses > 0 ? 'var(--success)' : 'var(--danger)'
                    }}>
                        {remainingUses}
                    </div>
                    <p className="text-muted">predictions remaining</p>
                </div>

                {/* Credit Packages */}
                <div className="grid" style={{ gap: 'var(--space-lg)' }}>
                    {predictorCredits.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="card"
                            style={{
                                position: 'relative',
                                border: pkg.popular ? '2px solid var(--primary)' : undefined,
                            }}
                        >
                            {pkg.popular && (
                                <div
                                    className="badge badge-primary"
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '20px',
                                    }}
                                >
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 style={{ marginBottom: 'var(--space-xs)' }}>{pkg.name}</h3>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                        ₹{(pkg.price / pkg.credits).toFixed(0)} per prediction
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div style={{
                                        fontSize: 'var(--font-size-2xl)',
                                        fontWeight: 800,
                                        color: 'var(--success)'
                                    }}>
                                        ₹{pkg.price}
                                    </div>
                                </div>
                            </div>

                            <PaymentButton
                                amount={pkg.price}
                                productName={pkg.name}
                                productId={pkg.id}
                                type="credits"
                                credits={pkg.credits}
                                onSuccess={handleSuccess}
                                onFailure={handleFailure}
                                buttonText="Purchase"
                                className="btn btn-primary w-full mt-lg"
                            />
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="card mt-xl" style={{ background: 'var(--bg-glass)' }}>
                    <h4 className="mb-md">🎯 Why Use Percentile Predictor?</h4>
                    <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                        <li style={{ marginBottom: 'var(--space-sm)' }}>
                            Get accurate predictions based on paper difficulty
                        </li>
                        <li style={{ marginBottom: 'var(--space-sm)' }}>
                            Track your improvement over time
                        </li>
                        <li style={{ marginBottom: 'var(--space-sm)' }}>
                            Set realistic goals for your preparation
                        </li>
                        <li>
                            Compare with previous years' trends
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PurchaseCreditsPage;
