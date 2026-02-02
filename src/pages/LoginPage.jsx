import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container container-sm">
                <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)' }}>
                    <div className="text-center mb-xl">
                        <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>
                            Welcome Back! 👋
                        </h1>
                        <p className="text-secondary mt-sm">
                            Login to continue your preparation
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
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center mb-lg">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" />
                                <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Remember me
                                </span>
                            </label>
                            <a href="#forgot" className="text-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: 16, height: 16 }}></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-xl">
                        <p className="text-secondary">
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ fontWeight: 600 }}>
                                Sign up for free
                            </Link>
                        </p>
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
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
            }} />
            <div style={{
                position: 'fixed',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
            }} />
        </div>
    );
}

export default LoginPage;
