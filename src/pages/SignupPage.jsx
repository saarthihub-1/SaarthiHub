import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup: initiateSignup } = useAuth();
    const navigate = useNavigate();

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
            await initiateSignup(formData.email, formData.password, formData.name, formData.phone);
            navigate('/verify-email');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
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
