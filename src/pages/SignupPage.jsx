import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
    const [step, setStep] = useState('form'); // 'form' or 'verify'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');
    const [demoOtp, setDemoOtp] = useState(''); // For demo display
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { initiateSignup, verifyEmailOTP, resendOTP, cancelVerification, pendingVerification } = useAuth();
    const navigate = useNavigate();

    // Check if there's pending verification
    useEffect(() => {
        if (pendingVerification) {
            setStep('verify');
            setFormData(prev => ({ ...prev, email: pendingVerification.email }));
        }
    }, [pendingVerification]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const result = await initiateSignup(formData.name, formData.email, formData.phone, formData.password);
            setDemoOtp(result.otp); // For demo - show OTP
            setStep('verify');
            setResendTimer(60);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            await verifyEmailOTP(otp);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        try {
            const result = await resendOTP();
            setDemoOtp(result.otp);
            setResendTimer(60);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        cancelVerification();
        setStep('form');
        setOtp('');
        setDemoOtp('');
    };

    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', 'var(--danger)', 'var(--warning)', 'var(--warning)', 'var(--success)', 'var(--success)'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength();

    // OTP Verification Step
    if (step === 'verify') {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container container-sm">
                    <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)' }}>
                        <div className="text-center mb-xl">
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📧</div>
                            <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>
                                Verify Your Email
                            </h1>
                            <p className="text-secondary mt-sm">
                                We've sent a 6-digit OTP to <strong>{pendingVerification?.email || formData.email}</strong>
                            </p>
                        </div>

                        {/* Demo OTP Display */}
                        {demoOtp && (
                            <div
                                className="alert alert-info mb-lg"
                                style={{ textAlign: 'center' }}
                            >
                                <div>
                                    <strong>Demo Mode:</strong> Your OTP is <span style={{
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 800,
                                        letterSpacing: '3px',
                                        color: 'var(--accent)'
                                    }}>{demoOtp}</span>
                                </div>
                                <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', marginBottom: 0 }}>
                                    (In production, this would be sent to your email)
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger mb-lg">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP}>
                            <div className="form-group">
                                <label className="form-label text-center" style={{ display: 'block' }}>
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    style={{
                                        fontSize: 'var(--font-size-2xl)',
                                        textAlign: 'center',
                                        letterSpacing: '10px',
                                        fontWeight: 700
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full btn-lg"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" style={{ width: 16, height: 16 }}></span>
                                        Verifying...
                                    </>
                                ) : (
                                    '✓ Verify Email'
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-xl">
                            <p className="text-secondary mb-md">
                                Didn't receive the OTP?
                            </p>
                            {resendTimer > 0 ? (
                                <p className="text-muted">
                                    Resend OTP in <strong>{resendTimer}s</strong>
                                </p>
                            ) : (
                                <button
                                    className="btn btn-outline"
                                    onClick={handleResendOTP}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <div className="text-center mt-lg">
                            <button
                                className="text-muted"
                                onClick={handleCancel}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                ← Back to Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div style={{
                    position: 'fixed',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: -1,
                }} />
            </div>
        );
    }

    // Sign Up Form Step
    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '40px' }}>
            <div className="container container-sm">
                <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)' }}>
                    <div className="text-center mb-xl">
                        <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>
                            Create Account 🚀
                        </h1>
                        <p className="text-secondary mt-sm">
                            Start your JEE & CET preparation journey
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-lg">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <span className="form-hint">You'll need to verify this email</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                placeholder="Enter 10-digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {formData.password && (
                                <div style={{ marginTop: 'var(--space-sm)' }}>
                                    <div className="progress-bar" style={{ height: '4px' }}>
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(passwordStrength.strength / 5) * 100}%`,
                                                background: passwordStrength.color,
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: 'var(--font-size-xs)',
                                        color: passwordStrength.color,
                                        marginTop: 'var(--space-xs)',
                                        display: 'block'
                                    }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <span className="form-error">Passwords do not match</span>
                            )}
                        </div>

                        <div className="mb-lg">
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" required style={{ marginTop: '4px' }} />
                                <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: 16, height: 16 }}></span>
                                    Sending verification code...
                                </>
                            ) : (
                                'Continue → Verify Email'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-xl">
                        <p className="text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" style={{ fontWeight: 600 }}>
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div style={{
                position: 'fixed',
                top: '10%',
                right: '5%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
            }} />
            <div style={{
                position: 'fixed',
                bottom: '20%',
                left: '5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
            }} />
        </div>
    );
}

export default SignupPage;
