import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mindmaps, subjects, getMindmapById } from '../data/mindmaps';

function DashboardPage() {
    const {
        user,
        getRemainingPredictorUses,
        hasPurchased,
        isBookmarked,
        toggleBookmark,
    } = useAuth();

    const [showDoubtForm, setShowDoubtForm] = useState(false);
    const [doubtText, setDoubtText] = useState('');
    const [doubtSubmitted, setDoubtSubmitted] = useState(false);

    if (!user) {
        return null;
    }

    const predictorUses = getRemainingPredictorUses();
    const purchasedMindmaps = mindmaps.filter(m => hasPurchased(m.id));
    const bookmarkedMindmaps = mindmaps.filter(m => isBookmarked(m.id));

    // Get recent activity
    const recentActivity = user.recentActivity?.slice(0, 5) || [];

    // Format relative time
    const getRelativeTime = (timestamp) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const getActivityIcon = (type) => {
        const icons = {
            signup: '🎉',
            login: '👋',
            predictor: '🎯',
            purchase: '💳',
            view: '👁️',
        };
        return icons[type] || '📌';
    };

    const handleDoubtSubmit = (e) => {
        e.preventDefault();
        // In real app, this would send to backend
        console.log('Doubt submitted:', doubtText);
        setDoubtSubmitted(true);
        setDoubtText('');
        setTimeout(() => {
            setShowDoubtForm(false);
            setDoubtSubmitted(false);
        }, 2000);
    };

    // Get chapter ratings summary
    const ratingSummary = {
        understood: Object.values(user.chapterRatings || {}).filter(r => r === 'understood').length,
        revision: Object.values(user.chapterRatings || {}).filter(r => r === 'revision').length,
        difficult: Object.values(user.chapterRatings || {}).filter(r => r === 'difficult').length,
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                {/* Welcome Section */}
                <div className="card mb-xl animate-fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                }}>
                    <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-sm)' }}>
                                Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}!</span> 👋
                            </h1>
                            <p className="text-secondary" style={{ marginBottom: 0 }}>
                                Keep up the great work on your preparation journey.
                            </p>
                        </div>
                        <div className="streak-badge animate-pulse">
                            <span className="streak-fire">🔥</span>
                            <span>{user.studyStreak} Day Streak!</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid mb-xl">
                    <div className="stat-card animate-fade-in-up stagger-1">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-value">{predictorUses}/3</div>
                        <div className="stat-label">Predictor Uses Left</div>
                        {predictorUses === 0 && (
                            <Link to="/purchase-credits" className="btn btn-sm btn-primary mt-md">
                                Buy Credits
                            </Link>
                        )}
                    </div>

                    <div className="stat-card animate-fade-in-up stagger-2">
                        <div className="stat-icon">🧠</div>
                        <div className="stat-value">{purchasedMindmaps.length}</div>
                        <div className="stat-label">Mind Maps Owned</div>
                    </div>

                    <div className="stat-card animate-fade-in-up stagger-3">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-value">{bookmarkedMindmaps.length}</div>
                        <div className="stat-label">Bookmarked</div>
                    </div>

                    <div className="stat-card animate-fade-in-up stagger-4">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">{ratingSummary.understood}</div>
                        <div className="stat-label">Chapters Mastered</div>
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: 'var(--space-xl)', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        {/* Quick Actions */}
                        <div className="card mb-xl">
                            <h3 className="mb-lg">⚡ Quick Actions</h3>
                            <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                                <Link to="/predictor" className="btn btn-primary">
                                    🎯 Use Predictor
                                </Link>
                                <Link to="/store" className="btn btn-secondary">
                                    🛒 Browse Store
                                </Link>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDoubtForm(true)}
                                >
                                    ❓ Ask a Doubt
                                </button>
                            </div>
                        </div>

                        {/* Purchased Mind Maps */}
                        <div className="card mb-xl">
                            <div className="flex justify-between items-center mb-lg">
                                <h3 style={{ marginBottom: 0 }}>🧠 Your Mind Maps</h3>
                                <Link to="/store" className="text-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Browse More →
                                </Link>
                            </div>

                            {purchasedMindmaps.length > 0 ? (
                                <div className="grid grid-2">
                                    {purchasedMindmaps.map(mindmap => {
                                        const subject = subjects.find(s => s.id === mindmap.subject);
                                        const rating = user.chapterRatings?.[mindmap.id];

                                        return (
                                            <div key={mindmap.id} className="card" style={{ padding: 'var(--space-md)' }}>
                                                <div className="flex gap-md">
                                                    <div
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: `${subject?.color}20`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.5rem',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {subject?.icon}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <span className="badge" style={{ fontSize: '10px', marginBottom: '4px' }}>
                                                            {mindmap.weightage === 'high' ? '⭐ High' : 'Low'} Weightage
                                                        </span>
                                                        <h4 style={{
                                                            fontSize: 'var(--font-size-sm)',
                                                            marginBottom: 'var(--space-xs)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {subject?.name}
                                                        </h4>
                                                        <div className="flex items-center gap-sm">
                                                            {rating && (
                                                                <span className={`badge ${rating === 'understood' ? 'badge-success' :
                                                                    rating === 'revision' ? 'badge-warning' : 'badge-danger'
                                                                    }`} style={{ fontSize: '10px' }}>
                                                                    {rating === 'understood' ? '✓ Understood' :
                                                                        rating === 'revision' ? '↻ Revision' : '✗ Difficult'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Link
                                                            to={`/viewer/${mindmap.id}`}
                                                            className="btn btn-sm btn-primary mt-sm"
                                                        >
                                                            View →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center" style={{ padding: 'var(--space-xl)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📚</div>
                                    <p className="text-secondary mb-lg">You haven't purchased any mind maps yet.</p>
                                    <Link to="/store" className="btn btn-primary">
                                        Explore Store
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Bookmarked Items */}
                        {bookmarkedMindmaps.length > 0 && (
                            <div className="card">
                                <h3 className="mb-lg">⭐ Bookmarked</h3>
                                <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                                    {bookmarkedMindmaps.map(mindmap => {
                                        const subject = subjects.find(s => s.id === mindmap.subject);
                                        const isPurchased = hasPurchased(mindmap.id);

                                        return (
                                            <div
                                                key={mindmap.id}
                                                className="card"
                                                style={{
                                                    padding: 'var(--space-md)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-md)',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.5rem' }}>{subject?.icon}</span>
                                                <div>
                                                    <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                                                        {mindmap.title}
                                                    </h4>
                                                    {isPurchased ? (
                                                        <Link to={`/viewer/${mindmap.id}`} className="text-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                                            View →
                                                        </Link>
                                                    ) : (
                                                        <Link to={`/product/${mindmap.id}`} className="text-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                                            ₹{mindmap.price} - Buy →
                                                        </Link>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-icon btn-sm btn-secondary"
                                                    onClick={() => toggleBookmark(mindmap.id)}
                                                    style={{ marginLeft: 'auto' }}
                                                >
                                                    ★
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Chapter Progress */}
                        <div className="card mb-xl">
                            <h4 className="mb-md">📊 Chapter Progress</h4>
                            <div className="mb-md">
                                <div className="flex justify-between mb-xs">
                                    <span className="text-sm">✅ Understood</span>
                                    <span className="text-success">{ratingSummary.understood}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill success"
                                        style={{ width: `${(ratingSummary.understood / Math.max(purchasedMindmaps.length, 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="mb-md">
                                <div className="flex justify-between mb-xs">
                                    <span className="text-sm">🔄 Need Revision</span>
                                    <span className="text-warning">{ratingSummary.revision}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill warning"
                                        style={{ width: `${(ratingSummary.revision / Math.max(purchasedMindmaps.length, 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-xs">
                                    <span className="text-sm">❌ Difficult</span>
                                    <span className="text-danger">{ratingSummary.difficult}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill danger"
                                        style={{ width: `${(ratingSummary.difficult / Math.max(purchasedMindmaps.length, 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card">
                            <h4 className="mb-md">🕐 Recent Activity</h4>
                            {recentActivity.length > 0 ? (
                                <div className="activity-feed">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="activity-item">
                                            <div className="activity-icon">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-text">{activity.message}</div>
                                                <div className="activity-time">{getRelativeTime(activity.timestamp)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center">No recent activity</p>
                            )}
                        </div>

                        {/* Store Suggestions */}
                        <div className="card mt-xl">
                            <h4 className="mb-md">💡 Recommended</h4>
                            {mindmaps
                                .filter(m => !hasPurchased(m.id))
                                .slice(0, 2)
                                .map(mindmap => {
                                    const subject = subjects.find(s => s.id === mindmap.subject);
                                    return (
                                        <Link
                                            key={mindmap.id}
                                            to={`/product/${mindmap.id}`}
                                            className="card mb-sm"
                                            style={{
                                                padding: 'var(--space-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-sm)',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <span>{subject?.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 'var(--font-size-sm)' }}>{mindmap.title}</div>
                                                <div className="text-success" style={{ fontSize: 'var(--font-size-sm)' }}>₹{mindmap.price}</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            <Link to="/store" className="btn btn-outline btn-sm w-full mt-md">
                                View All
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doubt Form Modal */}
            {showDoubtForm && (
                <div className="modal-overlay" onClick={() => !doubtSubmitted && setShowDoubtForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {doubtSubmitted ? (
                            <div className="text-center">
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✅</div>
                                <h2>Doubt Submitted!</h2>
                                <p className="text-secondary">
                                    We'll get back to you soon.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h2 className="modal-title">❓ Ask a Doubt</h2>
                                </div>
                                <form onSubmit={handleDoubtSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="form-label">Your Question</label>
                                            <textarea
                                                className="form-input"
                                                placeholder="Type your doubt here..."
                                                value={doubtText}
                                                onChange={(e) => setDoubtText(e.target.value)}
                                                rows={5}
                                                required
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                            We collect doubts to improve our content. Response not guaranteed.
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowDoubtForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Submit Doubt
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}

export default DashboardPage;
