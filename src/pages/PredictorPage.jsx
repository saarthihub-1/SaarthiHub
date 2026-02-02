import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PredictorPage() {
    const [marks, setMarks] = useState('');
    const [difficulty, setDifficulty] = useState(50);
    const [result, setResult] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [error, setError] = useState('');
    const [examType, setExamType] = useState('JEE'); // 'JEE' or 'CET'

    const { user, usePredictor, canUsePredictor, getRemainingPredictorUses } = useAuth();
    const navigate = useNavigate();

    const getDifficultyLabel = () => {
        if (difficulty < 33) return 'Easy';
        if (difficulty < 66) return 'Moderate';
        return 'Difficult';
    };

    const getDifficultyColor = () => {
        if (difficulty < 33) return 'var(--success)';
        if (difficulty < 66) return 'var(--warning)';
        return 'var(--danger)';
    };

    const calculatePercentile = (marksValue, difficultyValue) => {
        // Convert slider to string category
        let diffCategory = "moderate";
        if (difficultyValue < 33) diffCategory = "easy";
        if (difficultyValue > 66) diffCategory = "tough";

        if (examType === 'JEE') {
            // JEE Logic (ML-inspired non-linear regression)
            let diffFactor = 1.0;
            if (diffCategory === "easy") diffFactor = 0.97;
            if (diffCategory === "tough") diffFactor = 1.03;

            let base;
            if (marksValue >= 280) base = 99.95;
            else if (marksValue >= 250) base = 99.7 + (marksValue - 250) * 0.01;
            else if (marksValue >= 200) base = 99.0 + (marksValue - 200) * 0.014;
            else if (marksValue >= 160) base = 97.0 + (marksValue - 160) * 0.05;
            else if (marksValue >= 120) base = 94.0 + (marksValue - 120) * 0.075;
            else if (marksValue >= 80) base = 90.0 + (marksValue - 80) * 0.1;
            else base = 70 + marksValue * 0.25;

            base *= diffFactor;

            // Clamp base
            base = Math.min(base, 99.99);

            // Percentile range
            let minP = Math.max(base - 0.35, 0).toFixed(2);
            let maxP = Math.min(base + 0.35, 99.99).toFixed(2);
            let avgP = ((parseFloat(minP) + parseFloat(maxP)) / 2).toFixed(2);

            // Rank range (Total candidates approx 9,00,000)
            const totalCandidates = 900000;
            let maxRank = Math.round(totalCandidates * (1 - minP / 100));
            let minRank = Math.round(totalCandidates * (1 - maxP / 100));
            // Ensure rank is at least 1
            minRank = Math.max(1, minRank);
            maxRank = Math.max(1, maxRank);

            return {
                value: avgP,
                min: minP,
                max: maxP,
                rankMin: minRank,
                rankMax: maxRank
            };
        } else {
            // CET Logic (Version 3 - Final)
            let base;
            if (marksValue >= 170) base = 99.3;
            else if (marksValue >= 160) base = 98.5;
            else if (marksValue >= 150) base = 97.5;
            else if (marksValue >= 140) base = 96.5;
            else if (marksValue >= 130) base = 95.5;
            else if (marksValue >= 120) base = 94.5;
            else if (marksValue >= 110) base = 93.5;
            else if (marksValue >= 100) base = 92.0;
            else if (marksValue >= 90) base = 90.0;
            else if (marksValue >= 80) base = 87.0;
            else if (marksValue >= 70) base = 82.0;
            else if (marksValue >= 60) base = 75.0;
            else if (marksValue >= 50) base = 65.0;
            else base = 55.0;

            // Difficulty adjustment
            if (diffCategory === "easy") base += 1;
            if (diffCategory === "tough") base -= 1;

            let minP = Math.max(base - 1, 0).toFixed(2);
            let maxP = Math.min(base + 1, 100).toFixed(2);
            let avgP = ((parseFloat(minP) + parseFloat(maxP)) / 2).toFixed(2);

            return {
                value: avgP,
                min: minP,
                max: maxP,
                rankMin: null,
                rankMax: null
            };
        }
    };

    const getPerformanceLevel = (percentile) => {
        if (percentile >= 99) return { label: 'Exceptional! 🏆', color: 'var(--success)', emoji: '🔥' };
        if (percentile >= 95) return { label: 'Excellent! ⭐', color: 'var(--success)', emoji: '✨' };
        if (percentile >= 90) return { label: 'Very Good! 👏', color: 'var(--accent)', emoji: '💪' };
        if (percentile >= 80) return { label: 'Good! 👍', color: 'var(--primary)', emoji: '📈' };
        if (percentile >= 60) return { label: 'Average', color: 'var(--warning)', emoji: '📊' };
        return { label: 'Needs Improvement', color: 'var(--danger)', emoji: '📚' };
    };

    const handlePredict = () => {
        setError('');

        // Check if user is logged in first
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/predictor' } } });
            return;
        }

        // Validate marks
        const maxMarks = examType === 'JEE' ? 300 : 200;
        if (!marks || marks < 0 || marks > maxMarks) {
            setError(`Please enter valid marks between 0 and ${maxMarks}`);
            return;
        }

        // Check usage limit
        if (!canUsePredictor()) {
            setShowPaywall(true);
            return;
        }

        // Use predictor and calculate
        usePredictor();
        const prediction = calculatePercentile(parseFloat(marks), difficulty);
        setResult(prediction);
    };

    const remainingUses = user ? getRemainingPredictorUses() : 3;
    const performance = result ? getPerformanceLevel(parseFloat(result.value)) : null;

    return (
        <div className="page">
            <div className="container container-sm" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        🎯 Percentile <span className="gradient-text">Predictor</span>
                    </h1>
                    <p className="text-secondary">
                        Enter your marks to predict your JEE/CET percentile
                    </p>
                </div>

                {/* Login Prompt for guests */}
                {!user && (
                    <div className="card mb-xl" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                        <div className="flex justify-center items-center gap-md">
                            <span style={{ fontSize: '1.5rem' }}>🔐</span>
                            <span>Please login to use the Percentile Predictor</span>
                        </div>
                        <div className="flex justify-center gap-md mt-lg">
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-secondary">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}

                {/* Usage Counter for logged in users */}
                {user && (
                    <div className="card mb-xl" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                        <div className="flex justify-center items-center gap-md">
                            <span style={{ fontSize: '1.5rem' }}>🎟️</span>
                            <span>
                                Free uses remaining:
                                <strong style={{
                                    color: remainingUses > 0 ? 'var(--success)' : 'var(--danger)',
                                    marginLeft: '0.5rem',
                                    fontSize: 'var(--font-size-xl)'
                                }}>
                                    {remainingUses}/3
                                </strong>
                            </span>
                        </div>
                        {remainingUses === 0 && (
                            <Link to="/purchase-credits" className="btn btn-sm btn-primary mt-md">
                                Buy More Credits
                            </Link>
                        )}
                    </div>
                )}

                {/* Input Form */}
                <div className="card animate-fade-in-up">
                    {/* Exam Type Selector */}
                    <div className="flex justify-center gap-lg mb-lg">
                        <label className={`btn ${examType === 'JEE' ? 'btn-primary' : 'btn-outline'}`} style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="examType"
                                value="JEE"
                                checked={examType === 'JEE'}
                                onChange={() => setExamType('JEE')}
                                style={{ display: 'none' }}
                            />
                            JEE (300 Marks)
                        </label>
                        <label className={`btn ${examType === 'CET' ? 'btn-primary' : 'btn-outline'}`} style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="examType"
                                value="CET"
                                checked={examType === 'CET'}
                                onChange={() => setExamType('CET')}
                                style={{ display: 'none' }}
                            />
                            CET (200 Marks)
                        </label>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-lg">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Marks Input */}
                    <div className="form-group">
                        <label className="form-label">
                            Your Marks (out of {examType === 'JEE' ? 300 : 200}) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder={`Enter marks (0-${examType === 'JEE' ? 300 : 200})`}
                            value={marks}
                            onChange={(e) => {
                                setMarks(e.target.value);
                                setError('');
                            }}
                            min="0"
                            max={examType === 'JEE' ? "300" : "200"}
                            style={{ fontSize: 'var(--font-size-xl)', textAlign: 'center' }}
                        />
                    </div>

                    {/* Difficulty Slider */}
                    <div className="form-group">
                        <label className="form-label">
                            Paper Difficulty: <strong style={{ color: getDifficultyColor() }}>{getDifficultyLabel()}</strong>
                        </label>
                        <input
                            type="range"
                            className="slider"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            min="0"
                            max="100"
                            style={{
                                background: `linear-gradient(to right, var(--success) 0%, var(--warning) 50%, var(--danger) 100%)`
                            }}
                        />
                        <div className="flex justify-between text-muted mt-sm" style={{ fontSize: 'var(--font-size-sm)' }}>
                            <span>Easy</span>
                            <span>Moderate</span>
                            <span>Difficult</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary w-full btn-lg mt-lg"
                        onClick={handlePredict}
                    >
                        {user ? '🔮 Predict Percentile' : '🔐 Login to Predict'}
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="card mt-xl animate-slide-up" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
                            {performance.emoji}
                        </div>
                        <h2 style={{ color: performance.color, marginBottom: 'var(--space-sm)' }}>
                            {performance.label}
                        </h2>

                        <div style={{
                            fontSize: 'var(--font-size-5xl)',
                            fontWeight: 800,
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: 'var(--space-lg) 0'
                        }}>
                            {result.value}%
                        </div>

                        <p className="text-secondary mb-lg">
                            Expected Percentile Range: <strong>{result.min}% - {result.max}%</strong>
                        </p>

                        {/* Rank Display (JEE Only) */}
                        {result.rankMin && (
                            <div className="mb-lg p-md" style={{ background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)' }}>
                                <div className="text-muted mb-xs" style={{ fontSize: 'var(--font-size-sm)' }}>EXPECTED RANK</div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {result.rankMin.toLocaleString()} - {result.rankMax.toLocaleString()}
                                </div>
                                <div className="text-muted mt-xs" style={{ fontSize: 'var(--font-size-xs)' }}>
                                    Based on ~9 Lakh Candidates
                                </div>
                            </div>
                        )}

                        {/* Performance Bar */}
                        <div style={{ marginTop: 'var(--space-xl)' }}>
                            <div className="progress-bar" style={{ height: '20px' }}>
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${result.value}%`,
                                        background: `linear-gradient(90deg, var(--danger) 0%, var(--warning) 50%, var(--success) 100%)`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-sm text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Tips based on result */}
                        <div className="mt-xl p-lg" style={{
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'left'
                        }}>
                            <h4 className="mb-md">💡 Tips to Improve</h4>
                            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                                {parseFloat(result.value) < 90 && (
                                    <>
                                        <li>Focus on high-weightage chapters</li>
                                        <li>Practice previous year questions</li>
                                        <li>Use our <Link to="/store">Mind Maps</Link> for quick revision</li>
                                    </>
                                )}
                                {parseFloat(result.value) >= 90 && (
                                    <>
                                        <li>Maintain consistency in practice</li>
                                        <li>Focus on solving advanced problems</li>
                                        <li>Work on time management</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <button
                            className="btn btn-secondary mt-lg"
                            onClick={() => {
                                setResult(null);
                                setMarks('');
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Paywall Modal */}
                {showPaywall && (
                    <div className="modal-overlay" onClick={() => setShowPaywall(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header text-center">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔒</div>
                                <h2 className="modal-title">Free Uses Exhausted</h2>
                            </div>
                            <div className="modal-body text-center">
                                <p className="text-secondary">
                                    You've used all 3 free predictions. Purchase more credits to continue using the predictor.
                                </p>
                                <div className="mt-lg">
                                    <div className="card" style={{ background: 'var(--bg-glass)' }}>
                                        <div className="flex justify-between items-center">
                                            <span>1 Prediction</span>
                                            <span className="price-badge">₹10</span>
                                        </div>
                                    </div>
                                    <div className="card mt-md" style={{
                                        background: 'var(--bg-glass)',
                                        border: '2px solid var(--primary)'
                                    }}>
                                        <div className="badge badge-primary mb-sm">BEST VALUE</div>
                                        <div className="flex justify-between items-center">
                                            <span>3 Predictions</span>
                                            <span className="price-badge">₹25</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPaywall(false)}
                                >
                                    Cancel
                                </button>
                                <Link
                                    to="/purchase-credits"
                                    className="btn btn-primary"
                                >
                                    Buy Credits
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PredictorPage;
