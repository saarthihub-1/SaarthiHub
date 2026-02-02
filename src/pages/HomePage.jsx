import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjects, mindmaps, bundles } from '../data/mindmaps';

function HomePage() {
    const { user } = useAuth();

    const features = [
        {
            icon: '🎯',
            title: 'Percentile Predictor',
            description: 'Get accurate percentile predictions based on your marks and paper difficulty.',
        },
        {
            icon: '🧠',
            title: 'Mind Maps',
            description: 'Visual learning with comprehensive chapter-wise mind maps for quick revision.',
        },
        {
            icon: '🤖',
            title: 'AI Counseling',
            description: 'Get personalized guidance on study strategies, stress management, and career advice.',
            comingSoon: true,
        },
        {
            icon: '📊',
            title: 'Performance Tracking',
            description: 'Track your progress with study streaks, chapter ratings, and activity history.',
        },
    ];

    const completePack = bundles.find(b => b.id === 'complete-pack');

    return (
        <div className="page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title animate-fade-in-up">
                        Ace Your <span className="gradient-text">JEE & CET</span> Exams
                    </h1>
                    <p className="hero-subtitle animate-fade-in-up stagger-1">
                        Premium mind maps, accurate percentile predictions, and personalized tracking
                        to help you crack the toughest entrance exams.
                    </p>
                    <div className="hero-actions animate-fade-in-up stagger-2">
                        <Link to="/predictor" className="btn btn-primary btn-lg">
                            🎯 Try Predictor Free
                        </Link>
                        <Link to="/store" className="btn btn-secondary btn-lg">
                            🛒 Browse Mind Maps
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid mt-2xl animate-fade-in-up stagger-3">
                        <div className="stat-card">
                            <div className="stat-value">6</div>
                            <div className="stat-label">Mind Maps</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">3</div>
                            <div className="stat-label">Subjects</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">₹249</div>
                            <div className="stat-label">Complete Pack</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: 'var(--space-3xl) 0' }}>
                <div className="container">
                    <h2 className="text-center mb-2xl">
                        Why Choose <span className="gradient-text">SaarthiHub?</span>
                    </h2>
                    <div className="grid grid-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {feature.comingSoon && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '-30px',
                                        background: 'var(--warning)',
                                        color: 'white',
                                        padding: '4px 35px',
                                        transform: 'rotate(45deg)',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                    }}>
                                        COMING SOON
                                    </div>
                                )}
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>
                                    {feature.icon}
                                </div>
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="card-body">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mind Maps Pricing */}
            <section style={{ padding: 'var(--space-3xl) 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="text-center mb-xl">
                        Simple <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-center text-secondary mb-2xl" style={{ maxWidth: '600px', margin: '0 auto var(--space-2xl)' }}>
                        Choose individual mind maps or get the complete pack for maximum savings.
                    </p>

                    {/* Pricing Cards */}
                    <div className="grid grid-3">
                        {/* Individual Cards */}
                        <div className="card">
                            <div className="badge mb-md">LOW WEIGHTAGE</div>
                            <h3>Low Weightage Mind Map</h3>
                            <p className="text-secondary mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Mind maps for less frequently asked chapters
                            </p>
                            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--success)', marginBottom: 'var(--space-lg)' }}>
                                ₹49 <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 400 }}>per subject</span>
                            </div>
                            <Link to="/store" className="btn btn-outline w-full">View Options</Link>
                        </div>

                        <div className="card" style={{ border: '2px solid var(--primary)', transform: 'scale(1.05)' }}>
                            <div className="badge badge-primary mb-md">⭐ HIGH WEIGHTAGE</div>
                            <h3>High Weightage Mind Map</h3>
                            <p className="text-secondary mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Mind maps for most important, high-scoring chapters
                            </p>
                            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--success)', marginBottom: 'var(--space-lg)' }}>
                                ₹69 <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 400 }}>per subject</span>
                            </div>
                            <Link to="/store" className="btn btn-primary w-full">View Options</Link>
                        </div>

                        <div className="card">
                            <div className="badge mb-md">SUBJECT BUNDLE</div>
                            <h3>Subject Complete Bundle</h3>
                            <p className="text-secondary mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Both Low + High Weightage mind maps for one subject
                            </p>
                            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--success)', marginBottom: 'var(--space-lg)' }}>
                                ₹99 <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 400 }}>per subject</span>
                            </div>
                            <Link to="/store" className="btn btn-outline w-full">View Bundles</Link>
                        </div>
                    </div>

                    {/* Complete Pack CTA */}
                    <div
                        className="card mt-2xl"
                        style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                            border: '2px solid rgba(99, 102, 241, 0.4)',
                        }}
                    >
                        <div className="badge badge-primary mb-md">🏆 BEST VALUE</div>
                        <h2 className="mb-sm">Complete JEE/CET Mind Map Pack</h2>
                        <p className="text-secondary mb-lg">
                            All 6 mind maps (Physics + Chemistry + Mathematics) - Low & High Weightage
                        </p>
                        <div className="flex justify-center items-center gap-md mb-lg">
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: 'var(--font-size-xl)' }}>
                                ₹{completePack?.originalPrice}
                            </span>
                            <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--success)' }}>
                                ₹{completePack?.price}
                            </span>
                            <span className="badge badge-success">Save ₹{completePack?.savings}!</span>
                        </div>
                        <Link to="/store" className="btn btn-primary btn-lg animate-glow">
                            Get Complete Pack →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Subjects Preview */}
            <section style={{ padding: 'var(--space-3xl) 0' }}>
                <div className="container">
                    <h2 className="text-center mb-xl">
                        Mind Maps for All <span className="gradient-text">Subjects</span>
                    </h2>

                    <div className="grid grid-3">
                        {subjects.map((subject, index) => {
                            const subjectMaps = mindmaps.filter(m => m.subject === subject.id);
                            return (
                                <Link
                                    key={subject.id}
                                    to={`/store?subject=${subject.id}`}
                                    className="card"
                                    style={{
                                        textDecoration: 'none',
                                        borderColor: subject.color,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }}>
                                        {subject.icon}
                                    </div>
                                    <h3 className="card-title" style={{ color: subject.color }}>
                                        {subject.name}
                                    </h3>
                                    <p className="text-secondary">
                                        {subjectMaps.length} Mind Maps (Low + High Weightage)
                                    </p>
                                    <div className="mt-md">
                                        <span className="badge badge-primary">
                                            Explore →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Predictor CTA */}
            <section style={{ padding: 'var(--space-3xl) 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="card" style={{
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
                        border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}>
                        <h2 className="mb-md">🎯 Check Your Expected Percentile</h2>
                        <p className="text-secondary mb-xl" style={{ maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                            Enter your marks and get an instant percentile prediction.
                            First 3 uses are <strong style={{ color: 'var(--success)' }}>FREE!</strong>
                        </p>
                        <Link to="/predictor" className="btn btn-primary btn-lg animate-glow">
                            Try Percentile Predictor
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section style={{ padding: 'var(--space-3xl) 0' }}>
                    <div className="container text-center">
                        <h2 className="mb-md">Ready to Start Your Preparation?</h2>
                        <p className="text-secondary mb-xl">
                            Join thousands of students who are already using SaarthiHub.
                        </p>
                        <div className="flex justify-center gap-md">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Create Free Account
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Login
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default HomePage;
