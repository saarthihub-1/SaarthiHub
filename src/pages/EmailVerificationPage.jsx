import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmailVerificationPage() {
    const { user, resendVerificationEmail, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const [resendTimer, setResendTimer] = useState(0);
    const [message, setMessage] = useState('');
    const [checking, setChecking] = useState(false);

    // Countdown timer for resend button
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Auto-check verification status periodically
    useEffect(() => {
        const interval = setInterval(async () => {
            await refreshUser();
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [refreshUser]);

    // Redirect to dashboard if verified
    useEffect(() => {
        if (user?.emailVerified) {
            navigate('/dashboard');
        }
    }, [user?.emailVerified, navigate]);

    const handleResend = async () => {
        try {
            await resendVerificationEmail();
            setMessage('Verification email sent! Check your inbox.');
            setResendTimer(60);
        } catch (err) {
            // Handle Firebase rate limiting
            if (err.code === 'auth/too-many-requests') {
                setMessage('Too many requests. Please wait a few minutes before trying again.');
                setResendTimer(120);
            } else {
                setMessage('Email already sent. Check your inbox and spam folder. Wait a minute before resending.');
                setResendTimer(60);
            }
        }
    };

    const handleCheckVerification = async () => {
        setChecking(true);
        try {
            await refreshUser();
            if (!user?.emailVerified) {
                setMessage('Email not verified yet. Please check your inbox and click the verification link.');
            }
        } catch (err) {
            setMessage('Error checking verification status.');
        } finally {
            setChecking(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/signup');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="container container-sm">
                <div className="card animate-fade-in-up" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>📧</div>

                    <h1 style={{ marginBottom: 'var(--space-md)' }}>
                        Verify Your Email
                    </h1>

                    <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
                        We've sent a verification link to:
                    </p>

                    <div style={{
                        background: 'var(--bg-glass)',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-xl)',
                        fontWeight: 600
                    }}>
                        {user.email}
                    </div>

                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xl)' }}>
                        Click the link in the email to verify your account.
                        If you don't see it, check your spam folder.
                    </p>

                    {message && (
                        <div className="alert alert-info mb-lg">
                            <span>ℹ️</span>
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="flex gap-md" style={{ flexDirection: 'column' }}>
                        <button
                            onClick={handleCheckVerification}
                            className="btn btn-primary w-full"
                            disabled={checking}
                        >
                            {checking ? (
                                <>
                                    <span className="spinner" style={{ width: 16, height: 16 }}></span>
                                    Checking...
                                </>
                            ) : (
                                "I've Verified My Email"
                            )}
                        </button>

                        <button
                            onClick={handleResend}
                            className="btn btn-secondary w-full"
                            disabled={resendTimer > 0}
                        >
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Verification Email'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="btn btn-outline w-full"
                        >
                            Use Different Email
                        </button>
                    </div>

                    <p className="text-muted mt-xl" style={{ fontSize: 'var(--font-size-xs)' }}>
                        Having trouble? Contact support at support@saarthihub.com
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationPage;
