import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjects } from '../data/mindmaps';
import { productService } from '../services/api';

function StorePage() {
    const [activeTab, setActiveTab] = useState('all'); // 'all' or subject id
    const { hasPurchased } = useAuth();

    // State for data fetched from API
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products', error);
                // Fallback to empty or error state
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Derived state helpers
    const getMindmaps = () => products.filter(p => p.type === 'mindmap');
    const getBundles = () => products.filter(p => p.type === 'bundle');
    const getSubjectBundle = (subjectId) => getBundles().find(b => b.subject === subjectId);

    const mindmaps = getMindmaps();
    const completePack = getBundles().find(b => b.id === 'complete-pack');

    const renderMindmapCard = (mindmap) => {
        const isPurchased = hasPurchased(mindmap.id);
        const subject = subjects.find(s => s.id === mindmap.subject);
        // "high" weightage check might depend on ID or title if not explicitly in API field yet.
        // The seeder had "physics-high", "physics-low". Or let's just check ID string?
        // Actually seeder used "type": "mindmap", but didn't explicitly store weightage field?
        // Wait, looking at seeder... "physics-high" object didn't have "weightage" field explicitly, 
        // but 'low' had "Low Weightage Chapters" title.
        // Let's assume based on ID containing 'high' or title.
        const isHighWeightage = mindmap.title.toLowerCase().includes('high weightage');

        return (
            <div
                key={mindmap.id}
                className="card animate-fade-in-up"
                style={{
                    border: `2px solid ${isHighWeightage ? subject?.color : 'var(--border-color)'}`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Weightage Badge */}
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: isHighWeightage ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                        color: isHighWeightage ? 'white' : 'var(--text-muted)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                    }}
                >
                    {isHighWeightage ? '⭐ High Weightage' : 'Low Weightage'}
                </div>

                {/* Subject Icon */}
                <div
                    style={{
                        fontSize: '3rem',
                        marginBottom: 'var(--space-md)',
                        marginTop: 'var(--space-sm)',
                    }}
                >
                    {subject?.icon}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    marginBottom: 'var(--space-sm)',
                    color: subject?.color
                }}>
                    {mindmap.title}
                </h3>

                {/* Description */}
                <p
                    className="text-secondary"
                    style={{
                        fontSize: 'var(--font-size-sm)',
                        marginBottom: 'var(--space-md)',
                        minHeight: '60px',
                    }}
                >
                    {mindmap.description.slice(0, 120)}...
                </p>

                {/* Chapters Preview */}
                <div className="mb-lg">
                    <p className="text-muted mb-sm" style={{ fontSize: 'var(--font-size-xs)' }}>
                        Chapters Covered:
                    </p>
                    <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                        {mindmap.chapters?.slice(0, 4).map((chapter, i) => (
                            <span
                                key={i}
                                className="badge"
                                style={{
                                    background: 'var(--bg-glass)',
                                    fontSize: '10px',
                                }}
                            >
                                {chapter}
                            </span>
                        ))}
                        {(mindmap.chapters?.length || 0) > 4 && (
                            <span
                                className="badge"
                                style={{
                                    background: 'var(--bg-glass)',
                                    fontSize: '10px',
                                }}
                            >
                                +{(mindmap.chapters?.length || 0) - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex justify-between items-center mt-auto">
                    <div style={{ visibility: 'hidden' }}>
                        <span
                            style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 800,
                                color: 'var(--success)'
                            }}
                        >
                            ₹{mindmap.price}
                        </span>
                    </div>

                    {isPurchased ? (
                        <Link
                            to={`/viewer/${mindmap.id}`}
                            className="btn btn-success"
                        >
                            ✓ View Now
                        </Link>
                    ) : (
                        <Link
                            to={`/product/${mindmap.id}`} // Assuming ProductPage still works or needs update
                            // Ideally pass state or fetch fresh there.
                            className="btn btn-primary"
                        >
                            View Details →
                        </Link>
                    )}
                </div>

                {isPurchased && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'var(--gradient-success)',
                        }}
                    />
                )}
            </div>
        );
    };

    const renderSubjectBundle = (subject) => {
        const bundle = getSubjectBundle(subject.id);
        const subjectMaps = mindmaps.filter(m => m.subject === subject.id);

        if (!bundle) return null;

        const allPurchased = subjectMaps.length > 0 && subjectMaps.every(m => hasPurchased(m.id));
        // Or check if bundle itself is purchased? Seeder treats bundle as separate product ID.
        // User purchases bundle ID. 
        const bundlePurchased = hasPurchased(bundle.id);

        return (
            <div
                key={bundle.id}
                className="card"
                style={{
                    background: `linear-gradient(135deg, ${subject.color}15, ${subject.color}05)`,
                    border: `2px solid ${subject.color}40`,
                }}
            >
                <div className="flex items-center gap-md mb-md">
                    <span style={{ fontSize: '2rem' }}>{subject.icon}</span>
                    <div>
                        <span className="badge" style={{ background: subject.color, color: 'white' }}>
                            BUNDLE OFFER
                        </span>
                    </div>
                </div>

                <h3 style={{ color: subject.color, marginBottom: 'var(--space-sm)' }}>
                    {bundle.title}
                </h3>

                <p className="text-secondary mb-md" style={{ fontSize: 'var(--font-size-sm)' }}>
                    {bundle.description}
                </p>

                <div className="mb-lg p-md" style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <p className="text-muted mb-sm" style={{ fontSize: 'var(--font-size-xs)' }}>Includes:</p>
                    <div className="flex gap-sm">
                        <span className="badge badge-outline">Low Weightage</span>
                        <span style={{ color: 'var(--text-muted)' }}>+</span>
                        <span className="badge badge-outline">High Weightage</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        {/* Prices hidden as request */}
                    </div>
                    {bundlePurchased || allPurchased ? (
                        <span className="badge badge-success">✓ Owned</span>
                    ) : (
                        <Link to={`/checkout?type=bundle&id=${bundle.id}&product=${encodeURIComponent(bundle.title)}&amount=${bundle.price}`} className="btn btn-primary">
                            Buy Bundle
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="page"><div className="container text-center pt-3xl">Loading Store...</div></div>;
    }

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                {/* Header */}
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        🧠 Mind Maps <span className="gradient-text">Store</span>
                    </h1>
                    <p className="text-secondary">
                        Premium visual study materials for JEE & CET preparation
                    </p>
                </div>

                {/* Complete Pack - Featured */}
                {completePack && (
                    <div
                        className="card mb-2xl animate-fade-in"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                            border: '2px solid rgba(99, 102, 241, 0.4)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Featured Badge */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                padding: '6px 16px',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 700,
                                fontSize: 'var(--font-size-sm)',
                            }}
                        >
                            🏆 BEST VALUE
                        </div>

                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📦</div>

                        <h2 className="mb-sm">{completePack?.title}</h2>
                        <p className="text-secondary mb-lg">{completePack?.description}</p>

                        {/* What's Included */}
                        <div
                            className="flex justify-center gap-lg mb-xl"
                            style={{ flexWrap: 'wrap' }}
                        >
                            {subjects.map(subject => (
                                <div
                                    key={subject.id}
                                    className="flex items-center gap-sm p-md"
                                    style={{
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{subject.icon}</span>
                                    <span>{subject.name}</span>
                                    <span className="text-muted">(2 mind maps)</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Hidden */}
                        <div className="flex justify-center items-center gap-lg mb-lg">
                            <span className="badge badge-success" style={{ fontSize: 'var(--font-size-md)', padding: '8px 16px' }}>
                                Best Deal!
                            </span>
                        </div>

                        <Link to={`/checkout?type=bundle&id=complete-pack&product=${encodeURIComponent(completePack.title)}&amount=${completePack.price}`} className="btn btn-primary btn-lg animate-glow">
                            🛒 Get Complete Pack
                        </Link>
                    </div>
                )}

                {/* Subject Tabs */}
                <div className="tabs mb-xl">
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        📚 All Subjects
                    </button>
                    {subjects.map(subject => (
                        <button
                            key={subject.id}
                            className={`tab ${activeTab === subject.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(subject.id)}
                            style={activeTab === subject.id ? { background: subject.color } : {}}
                        >
                            {subject.icon} {subject.name}
                        </button>
                    ))}
                </div>

                {/* Mind Maps Grid */}
                {activeTab === 'all' ? (
                    // All subjects view
                    subjects.map(subject => {
                        const subjectMaps = mindmaps.filter(m => m.subject === subject.id);

                        return (
                            <div key={subject.id} className="mb-3xl">
                                {/* Subject Header */}
                                <div
                                    className="flex items-center gap-md mb-xl p-md"
                                    style={{
                                        background: `${subject.color}15`,
                                        borderRadius: 'var(--radius-lg)',
                                        borderLeft: `4px solid ${subject.color}`,
                                    }}
                                >
                                    <span style={{ fontSize: '2rem' }}>{subject.icon}</span>
                                    <h2 style={{ margin: 0, color: subject.color }}>{subject.name}</h2>
                                    <span className="text-muted">({subjectMaps.length} mind maps)</span>
                                </div>

                                {/* Mind Map Cards */}
                                <div className="grid grid-3 mb-xl">
                                    {subjectMaps.map(mindmap => renderMindmapCard(mindmap))}
                                    {/* Subject Bundle Card */}
                                    {renderSubjectBundle(subject)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Single subject view
                    <div>
                        {(() => {
                            const subject = subjects.find(s => s.id === activeTab);
                            const subjectMaps = mindmaps.filter(m => m.subject === activeTab);

                            return (
                                <div className="grid grid-3">
                                    {subjectMaps.map(mindmap => renderMindmapCard(mindmap))}
                                    {renderSubjectBundle(subject)}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Info Section */}
                <div className="card mt-2xl" style={{ textAlign: 'center' }}>
                    <h3 className="mb-md">Why Buy Mind Maps? 🤔</h3>
                    <div className="grid grid-4" style={{ textAlign: 'left', gap: 'var(--space-lg)' }}>
                        <div>
                            <span style={{ fontSize: '1.5rem' }}>📖</span>
                            <h4 style={{ fontSize: 'var(--font-size-md)', margin: 'var(--space-sm) 0' }}>Visual Learning</h4>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Understand complex concepts through visual diagrams
                            </p>
                        </div>
                        <div>
                            <span style={{ fontSize: '1.5rem' }}>⚡</span>
                            <h4 style={{ fontSize: 'var(--font-size-md)', margin: 'var(--space-sm) 0' }}>Quick Revision</h4>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Revise entire chapters in minutes before exams
                            </p>
                        </div>
                        <div>
                            <span style={{ fontSize: '1.5rem' }}>🎯</span>
                            <h4 style={{ fontSize: 'var(--font-size-md)', margin: 'var(--space-sm) 0' }}>Exam Focus</h4>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Curated for JEE Main, JEE Advanced & MHT-CET
                            </p>
                        </div>
                        <div>
                            <span style={{ fontSize: '1.5rem' }}>♾️</span>
                            <h4 style={{ fontSize: 'var(--font-size-md)', margin: 'var(--space-sm) 0' }}>Lifetime Access</h4>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Buy once, access forever
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StorePage;
