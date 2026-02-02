import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <img src="/logo.jpg" alt="SaarthiHub" style={{ height: '28px', borderRadius: '4px' }} />
                            <h4 style={{ marginBottom: 0 }}>SaarthiHub</h4>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            Your guide to JEE & CET success.
                            Premium mind maps and percentile predictor.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/predictor">Percentile Predictor</Link></li>
                            <li><Link to="/store">Mind Maps Store</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Subjects</h4>
                        <ul>
                            <li><Link to="/store?subject=physics">Physics</Link></li>
                            <li><Link to="/store?subject=chemistry">Chemistry</Link></li>
                            <li><Link to="/store?subject=mathematics">Mathematics</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="#faq">FAQs</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} SaarthiHub. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
                        Made with ❤️ for JEE & CET Aspirants
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
