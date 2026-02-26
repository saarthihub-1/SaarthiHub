import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMindmapById, subjects } from '../data/mindmaps';
import { pcmMindmapsService } from '../services/api';
import Watermark from '../components/Watermark';

function ViewerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasPurchased, isBookmarked, toggleBookmark, setChapterRating, addActivity } = useAuth();

    const [currentPage, setCurrentPage] = useState(0);
    const [showToolbar, setShowToolbar] = useState(true);
    const [pdfPages, setPdfPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [productInfo, setProductInfo] = useState(null);

    const mindmap = getMindmapById(id);

    // Fetch PDF URLs from the API
    useEffect(() => {
        const fetchPdfs = async () => {
            if (!user || !id) return;

            try {
                setLoading(true);
                setFetchError(null);
                const data = await pcmMindmapsService.getPdfUrls(id);

                if (data.success && data.pdfs && data.pdfs.length > 0) {
                    setPdfPages(data.pdfs.map(p => p.url));
                    setProductInfo(data.product);
                } else if (data.success && (!data.pdfs || data.pdfs.length === 0)) {
                    // No PDFs configured yet
                    setPdfPages([]);
                    setProductInfo(data.product);
                } else if (data.requiresPurchase) {
                    navigate(`/product/${id}`);
                    return;
                } else {
                    setFetchError(data.message || 'Failed to load content');
                }
            } catch (err) {
                console.error('Error fetching PDFs:', err);
                setFetchError('Failed to load mind map content. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPdfs();
    }, [id, user]);

    // Disable right-click
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        document.addEventListener('contextmenu', handleContextMenu);

        // Log view activity
        if (mindmap && user) {
            addActivity('view', `Viewed ${mindmap.title}`);
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevPage();
            } else if (e.key === 'ArrowRight') {
                nextPage();
            } else if (e.key === 'Escape') {
                navigate('/dashboard');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, pdfPages]);

    if (!mindmap) {
        return (
            <div className="page">
                <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
                    <h1>Mind Map Not Found</h1>
                    <Link to="/store" className="btn btn-primary mt-lg">
                        Browse Store
                    </Link>
                </div>
            </div>
        );
    }

    // Check access
    if (!user) {
        navigate('/login');
        return null;
    }

    if (!hasPurchased(mindmap.id)) {
        navigate(`/product/${mindmap.id}`);
        return null;
    }

    const subject = subjects.find(s => s.id === mindmap.subject);
    const bookmarked = isBookmarked(mindmap.id);
    const rating = user.chapterRatings?.[mindmap.id];

    const nextPage = () => {
        if (currentPage < pdfPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleRating = (newRating) => {
        setChapterRating(mindmap.id, newRating);
    };

    // Loading state
    if (loading) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>📄</div>
                    <h2>Loading Mind Map...</h2>
                    <p className="text-secondary">Preparing your content</p>
                </div>
            </div>
        );
    }

    // No PDFs available yet
    if (pdfPages.length === 0 && !fetchError) {
        const chapters = productInfo?.chapters || mindmap.chapters || [];
        return (
            <div className="page">
                <div className="container container-sm" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🚧</div>
                        <h2 style={{ marginBottom: 'var(--space-md)' }}>Content Being Prepared</h2>
                        <p className="text-secondary mb-xl">
                            Your purchase of <strong>{mindmap.title}</strong> is confirmed!
                            The mind map content is being finalized and will be available here shortly.
                        </p>

                        {chapters.length > 0 && (
                            <div className="mb-xl" style={{ textAlign: 'left' }}>
                                <h4 className="mb-md">📚 Chapters Included:</h4>
                                <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                                    {chapters.map((ch, i) => (
                                        <span
                                            key={i}
                                            className="badge"
                                            style={{ background: 'var(--bg-glass)', marginBottom: '4px' }}
                                        >
                                            {ch}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-md justify-center">
                            <Link to="/dashboard" className="btn btn-primary">
                                ← Go to Dashboard
                            </Link>
                            <Link to="/store" className="btn btn-secondary">
                                Browse Store
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (fetchError) {
        return (
            <div className="page">
                <div className="container container-sm text-center" style={{ paddingTop: 'var(--space-2xl)' }}>
                    <div className="card" style={{ padding: 'var(--space-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>⚠️</div>
                        <h2 style={{ marginBottom: 'var(--space-md)' }}>Something Went Wrong</h2>
                        <p className="text-secondary mb-xl">{fetchError}</p>
                        <div className="flex gap-md justify-center">
                            <button className="btn btn-primary" onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                            <Link to="/dashboard" className="btn btn-secondary">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="viewer-container"
            onMouseMove={() => setShowToolbar(true)}
        >
            {/* Watermark */}
            <Watermark />

            {/* Toolbar */}
            <div
                className="navbar"
                style={{
                    opacity: showToolbar ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <div className="container navbar-container">
                    <div className="flex items-center gap-md">
                        <Link to="/dashboard" className="btn btn-secondary btn-sm">
                            ← Back
                        </Link>
                        <div>
                            <span
                                className="badge"
                                style={{
                                    background: `${subject?.color}20`,
                                    color: subject?.color,
                                    marginRight: 'var(--space-sm)'
                                }}
                            >
                                {subject?.icon} {subject?.name}
                            </span>
                        </div>
                    </div>

                    <h3 style={{
                        fontSize: 'var(--font-size-md)',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {mindmap.title}
                    </h3>

                    <div className="flex items-center gap-md">
                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={() => toggleBookmark(mindmap.id)}
                            title={bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                            style={bookmarked ? {
                                background: 'rgba(245, 158, 11, 0.2)',
                                borderColor: 'var(--warning)',
                                color: 'var(--warning)'
                            } : {}}
                        >
                            {bookmarked ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="viewer-content">
                <img
                    src={pdfPages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    className="viewer-image"
                    draggable={false}
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/1200x800/${subject?.color?.replace('#', '') || '6366f1'}/ffffff?text=${encodeURIComponent(`${mindmap.title} - Page ${currentPage + 1}`)}`;
                    }}
                />

                {/* Page Navigation */}
                <div className="viewer-navigation">
                    <button
                        className="btn btn-secondary"
                        onClick={prevPage}
                        disabled={currentPage === 0}
                    >
                        ← Previous
                    </button>

                    <div className="viewer-page-info">
                        <span>Page</span>
                        <strong>{currentPage + 1}</strong>
                        <span>of</span>
                        <strong>{pdfPages.length}</strong>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={nextPage}
                        disabled={currentPage === pdfPages.length - 1}
                    >
                        Next →
                    </button>
                </div>

                {/* Chapter Rating */}
                <div
                    className="card mt-xl"
                    style={{
                        maxWidth: '500px',
                        background: 'var(--bg-card)',
                    }}
                >
                    <h4 className="mb-md text-center">How well do you understand this chapter?</h4>
                    <div className="rating-buttons" style={{ justifyContent: 'center' }}>
                        <button
                            className={`rating-btn ${rating === 'understood' ? 'understood' : ''}`}
                            onClick={() => handleRating('understood')}
                        >
                            ✅ Understood
                        </button>
                        <button
                            className={`rating-btn ${rating === 'revision' ? 'revision' : ''}`}
                            onClick={() => handleRating('revision')}
                        >
                            🔄 Need Revision
                        </button>
                        <button
                            className={`rating-btn ${rating === 'difficult' ? 'difficult' : ''}`}
                            onClick={() => handleRating('difficult')}
                        >
                            ❌ Difficult
                        </button>
                    </div>
                </div>
            </div>

            {/* Protection Overlay (transparent, blocks dev tools inspect click) */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 40,
                    pointerEvents: 'none',
                }}
            />

            <style>{`
        .viewer-content {
          padding-bottom: 100px;
        }
        
        .viewer-content img {
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        
        /* Prevent screenshot (partial) */
        @media print {
          .viewer-container {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}

export default ViewerPage;
