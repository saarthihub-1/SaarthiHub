import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMindmapById, subjects } from '../data/mindmaps';
import Watermark from '../components/Watermark';

function ViewerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasPurchased, isBookmarked, toggleBookmark, setChapterRating, addActivity } = useAuth();

    const [currentPage, setCurrentPage] = useState(0);
    const [showToolbar, setShowToolbar] = useState(true);

    const mindmap = getMindmapById(id);

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
    }, [currentPage]);

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
        if (currentPage < mindmap.pages.length - 1) {
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
                    src={mindmap.pages[currentPage]}
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
                        <strong>{mindmap.pages.length}</strong>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={nextPage}
                        disabled={currentPage === mindmap.pages.length - 1}
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
