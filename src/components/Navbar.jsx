import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/predictor', label: 'Predictor' },
        { path: '/store', label: 'Store' },
        { path: '/profile', label: '🤖 AI Counseling', badge: 'Coming Soon' },
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.jpg" alt="SaarthiHub" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
                    <span>SaarthiHub</span>
                </Link>

                <ul className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
                    {navLinks.map(link => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                {link.label}
                                {link.badge && (
                                    <span style={{
                                        fontSize: '9px',
                                        background: 'var(--warning)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        marginLeft: '4px',
                                    }}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                    {user && (
                        <li className="mobile-only">
                            <Link
                                to="/dashboard"
                                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/profile" className="btn btn-secondary btn-sm desktop-only">
                                👤 {(user.name || user.email || 'User').split(' ')[0]}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                <div
                    className="navbar-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <style>{`
        .mobile-only {
          display: none;
        }
        .desktop-only {
          display: inline-flex;
        }
        @media (max-width: 768px) {
          .mobile-only {
            display: block;
          }
          .desktop-only {
            display: none;
          }
          .navbar-actions {
            gap: 0.5rem;
          }
          .navbar-actions .btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
        </nav>
    );
}

export default Navbar;
