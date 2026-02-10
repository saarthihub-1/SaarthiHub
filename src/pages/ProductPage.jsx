import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjects, getSubjectById } from '../data/mindmaps'; // Keep for metadata
import { productService } from '../services/api'; // Dynamic data
import PaymentButton from '../components/PaymentButton';

function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasPurchased, isBookmarked, toggleBookmark } = useAuth();

    const [mindmap, setMindmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // If it's a legacy static ID, api might fail if not in DB, but we seeded it.
                // However seeder uses 'physics-low' etc.
                const product = await productService.getById(id);
                setMindmap(product);
            } catch (err) {
                console.error("Product fetch error:", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="page text-center pt-3xl">Loading...</div>;

    if (!mindmap || error) {
        return (
            <div className="page">
                <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>😕</div>
                    <h1>Product Not Found</h1>
                    <p className="text-secondary mb-xl">
                        The mind map you're looking for doesn't exist.
                    </p>
                    <Link to="/store" className="btn btn-primary">
                        Browse Store
                    </Link>
                </div>
            </div>
        );
    }

    // Adapt DB data to UI props
    const subject = getSubjectById(mindmap.subject);
    // Metadata like color/icon comes from static `subjects` list in mindmaps.js 
    // based on 'subject' string stored in DB

    // Check if high weightage based on title (since seeder didn't explicitly have weightage field)
    const isHighWeightage = mindmap.title.toLowerCase().includes('high weightage');

    // Bundle handling: UI wants to show "Upgrade to Bundle".
    // We need to know which bundle contains this mindmap.
    // In static data, we had `getSubjectBundle`.
    // In DB, bundles have `subject`.
    // We can't easily query "get bundle for this subject" without another API call or storing bundles in state.
    // For now, let's skip the bundle upsell box OR fetch all products to find it (inefficient but works for small app).
    // Or just look at static data purely for cross-linking? No, prices might differ.
    // Let's hide bundle upsell for MVP phase 2 integration to avoid complexity, 
    // OR just use static definition for the LINK_ID but fetch price? 
    // Let's skip bundle upsell for now.

    const isPurchased = hasPurchased(mindmap.id);
    const bookmarked = isBookmarked(mindmap.id);

    const handleSuccess = () => {
        navigate(`/payment-success?product=${mindmap.id}`);
    };

    const handleFailure = () => {
        navigate('/payment-failure');
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                {/* Breadcrumb */}
                <div className="mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                    <Link to="/store" className="text-muted">Store</Link>
                    <span className="text-muted" style={{ margin: '0 0.5rem' }}>/</span>
                    <Link to={`/store?subject=${mindmap.subject}`} className="text-muted">
                        {subject?.name || mindmap.subject}
                    </Link>
                    <span className="text-muted" style={{ margin: '0 0.5rem' }}>/</span>
                    <span className="text-secondary">{isHighWeightage ? 'High Weightage' : 'Low Weightage'}</span>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        {/* Preview Image */}
                        <div
                            className="card"
                            style={{
                                padding: 0,
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img
                                src={mindmap.previewUrl || `https://via.placeholder.com/800x500/${subject?.color?.replace('#', '') || '6366f1'}/ffffff?text=${encodeURIComponent(mindmap.title)}`}
                                alt={mindmap.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    filter: isPurchased ? 'none' : 'blur(5px)',
                                }}
                            />
                            {!isPurchased && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <div className="text-center">
                                        <div style={{ fontSize: '4rem' }}>🔒</div>
                                        <p style={{ color: 'white', marginTop: 'var(--space-md)' }}>
                                            Purchase to unlock full content
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="card mt-xl">
                            <h2 className="mb-lg">About This Mind Map</h2>
                            <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                                {mindmap.description}
                            </p>

                            {/* Chapters List */}
                            <div className="mt-xl">
                                <h4 className="mb-md">📚 Chapters Covered ({mindmap.chapters?.length || 0}):</h4>
                                <div className="grid grid-2" style={{ gap: 'var(--space-sm)' }}>
                                    {mindmap.chapters?.map((chapter, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-sm p-sm"
                                            style={{
                                                background: 'var(--bg-glass)',
                                                borderRadius: 'var(--radius-md)',
                                            }}
                                        >
                                            <span style={{ color: 'var(--success)' }}>✓</span>
                                            <span style={{ fontSize: 'var(--font-size-sm)' }}>{chapter}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-xl">
                                <h4 className="mb-md">What's Included:</h4>
                                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                                    <li style={{ marginBottom: 'var(--space-sm)' }}>
                                        Complete chapter coverage with visual diagrams
                                    </li>
                                    <li style={{ marginBottom: 'var(--space-sm)' }}>
                                        All important formulas and concepts
                                    </li>
                                    <li style={{ marginBottom: 'var(--space-sm)' }}>
                                        Quick revision friendly format
                                    </li>
                                    <li style={{ marginBottom: 'var(--space-sm)' }}>
                                        Lifetime access (view-only)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '100px' }}>
                            {/* Weightage Badge */}
                            <div
                                className={`badge mb-md ${isHighWeightage ? 'badge-primary' : ''}`}
                                style={!isHighWeightage ? { background: 'var(--bg-glass)' } : {}}
                            >
                                {isHighWeightage ? '⭐ High Weightage' : 'Low Weightage'}
                            </div>

                            <span
                                className="product-subject mb-md"
                                style={{
                                    background: `${subject?.color}20`,
                                    color: subject?.color
                                }}
                            >
                                {subject?.icon} {subject?.name || mindmap.subject}
                            </span>

                            <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-md)' }}>
                                {mindmap.title}
                            </h1>

                            <p className="text-secondary mb-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
                                {mindmap.chapters?.length} chapters covered
                            </p>

                            {isPurchased ? (
                                <div className="alert alert-success">
                                    <span>✓</span>
                                    <span>You own this mind map!</span>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-lg)',
                                        marginBottom: 'var(--space-lg)',
                                    }}
                                >
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                        One-time purchase • Lifetime access
                                    </p>
                                </div>
                            )}

                            {isPurchased ? (
                                <Link
                                    to={`/viewer/${mindmap.id}`}
                                    className="btn btn-success w-full btn-lg"
                                >
                                    View Mind Map →
                                </Link>
                            ) : (
                                <>
                                    {user ? (
                                        <PaymentButton
                                            amount={mindmap.price}
                                            productName={mindmap.title}
                                            productId={mindmap.id}
                                            onSuccess={handleSuccess}
                                            onFailure={handleFailure}
                                            buttonText="Buy Now"
                                            className="btn btn-primary w-full btn-lg"
                                        />
                                    ) : (
                                        <Link
                                            to="/login"
                                            state={{ from: { pathname: `/product/${mindmap.id}` } }}
                                            className="btn btn-primary w-full btn-lg"
                                        >
                                            Login to Purchase
                                        </Link>
                                    )}
                                </>
                            )}

                            {user && (
                                <button
                                    className={`btn btn-secondary w-full mt-md ${bookmarked ? 'active' : ''}`}
                                    onClick={() => toggleBookmark(mindmap.id)}
                                    style={bookmarked ? {
                                        background: 'rgba(245, 158, 11, 0.2)',
                                        borderColor: 'var(--warning)',
                                        color: 'var(--warning)'
                                    } : {}}
                                >
                                    {bookmarked ? '★ Bookmarked' : '☆ Add to Bookmarks'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
            </div>
        </div>
    );
}

export default ProductPage;
