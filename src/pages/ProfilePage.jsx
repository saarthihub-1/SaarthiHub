import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [showCounseling, setShowCounseling] = useState(false);
    const [counselingMessage, setCounselingMessage] = useState('');
    const [counselingChat, setCounselingChat] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    if (!user) {
        return null;
    }

    const handleEditSave = () => {
        updateUser({
            name: editForm.name,
            phone: editForm.phone,
        });
        setIsEditing(false);
    };

    // AI Counseling responses based on keywords
    const getAIResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
            return "It's completely normal to feel stressed during JEE/CET preparation. Here are some tips:\n\n• Take regular breaks (5-10 mins every hour)\n• Practice deep breathing exercises\n• Maintain a consistent sleep schedule\n• Exercise for at least 30 mins daily\n• Talk to friends and family about your feelings\n\nRemember, your mental health is just as important as your studies! 💪";
        }

        if (lowerMessage.includes('study') || lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
            return "Here's an effective study schedule strategy:\n\n📚 Morning (6 AM - 12 PM): Study toughest subjects\n🍽️ Afternoon (2 PM - 5 PM): Practice problems & revision\n🌙 Evening (7 PM - 10 PM): Light topics & formula review\n\n✅ Tips:\n• Study in 45-50 min blocks with breaks\n• Use our mind maps for quick revision\n• Solve previous year papers weekly\n• Sleep at least 7-8 hours!";
        }

        if (lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('math')) {
            return "For subject-specific preparation:\n\n⚛️ Physics: Focus on concepts first, then numericals\n🧪 Chemistry: Balance organic, inorganic, and physical\n📐 Mathematics: Practice daily, master formulas\n\n🎯 High weightage topics to focus on:\n• Physics: Mechanics, Electrostatics, Modern Physics\n• Chemistry: Organic reactions, Equilibrium, Coordination\n• Maths: Calculus, Coordinate Geometry, Algebra\n\nCheck our mind maps for visual learning!";
        }

        if (lowerMessage.includes('rank') || lowerMessage.includes('college') || lowerMessage.includes('iit') || lowerMessage.includes('nit')) {
            return "College admission insights:\n\n🏆 For IITs: Target 98+ percentile (JEE Advanced)\n🎓 For NITs: 95-98 percentile (JEE Main)\n📍 For State colleges: 85-95 percentile\n\n💡 Tips:\n• Focus on accuracy over speed initially\n• Analyze your mock tests thoroughly\n• Strengthen weak areas systematically\n• Stay updated with exam patterns\n\nUse our Percentile Predictor to estimate your rank!";
        }

        if (lowerMessage.includes('motivation') || lowerMessage.includes('focus') || lowerMessage.includes('distract')) {
            return "Staying motivated is key! 🌟\n\n🎯 Motivation tips:\n• Set small, achievable daily goals\n• Reward yourself after completing tasks\n• Visualize your success\n• Keep a study group for accountability\n• Remember why you started\n\n📵 To avoid distractions:\n• Use app blockers during study time\n• Create a dedicated study space\n• Inform family about your study hours\n• Keep phone in another room";
        }

        // Default response
        return "Thank you for reaching out! 🙏\n\nI'm your AI counselor here to help with:\n• Study planning & strategies\n• Subject-specific guidance\n• Stress management\n• College selection advice\n• Motivation & focus tips\n\nFeel free to ask me anything about your JEE/CET preparation journey. I'm here to support you! 💪";
    };

    const handleSendMessage = () => {
        if (!counselingMessage.trim()) return;

        const userMessage = counselingMessage;
        setCounselingChat(prev => [...prev, { type: 'user', text: userMessage }]);
        setCounselingMessage('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse = getAIResponse(userMessage);
            setCounselingChat(prev => [...prev, { type: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
                <div className="text-center mb-2xl">
                    <h1 className="page-title">
                        👤 My <span className="gradient-text">Profile</span>
                    </h1>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: 'var(--space-xl)', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        {/* Profile Info Card */}
                        <div className="card mb-xl">
                            <div className="flex justify-between items-start mb-lg">
                                <h3>Profile Information</h3>
                                {!isEditing && (
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        ✏️ Edit
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email (cannot be changed)</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={user.email}
                                            disabled
                                            style={{ opacity: 0.6 }}
                                        />
                                    </div>
                                    <div className="flex gap-md">
                                        <button className="btn btn-primary" onClick={handleEditSave}>
                                            Save Changes
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <span className="text-muted">Full Name</span>
                                        <strong>{user.name}</strong>
                                    </div>
                                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <span className="text-muted">Email</span>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <span className="text-muted">Phone</span>
                                        <span>{user.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <span className="text-muted">Member Since</span>
                                        <span>{memberSince}</span>
                                    </div>
                                    <div className="flex justify-between py-md">
                                        <span className="text-muted">Email Verified</span>
                                        <span className="badge badge-success">✓ Verified</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Counseling Feature - Coming Soon */}
                        <div className="card mb-xl" style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                            border: '2px solid rgba(99, 102, 241, 0.3)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Coming Soon Badge */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '-35px',
                                    background: 'var(--warning)',
                                    color: 'white',
                                    padding: '5px 40px',
                                    transform: 'rotate(45deg)',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: 700,
                                }}
                            >
                                COMING SOON
                            </div>

                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🤖</div>
                            <h3 className="mb-sm">AI Counselor</h3>
                            <p className="text-secondary mb-lg">
                                Get personalized guidance on study strategies, stress management,
                                college selection, and career advice from our AI-powered counselor.
                            </p>

                            <div className="flex justify-center gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
                                <span className="badge badge-primary">Study Tips</span>
                                <span className="badge badge-primary">Stress Management</span>
                                <span className="badge badge-primary">College Info</span>
                                <span className="badge badge-primary">Career Guidance</span>
                            </div>

                            <button className="btn btn-secondary" disabled>
                                🔔 Notify Me When Available
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="mb-lg">Quick Actions</h3>
                            <div className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                                <Link to="/dashboard" className="btn btn-secondary">
                                    📊 Go to Dashboard
                                </Link>
                                <Link to="/predictor" className="btn btn-secondary">
                                    🎯 Percentile Predictor
                                </Link>
                                <Link to="/store" className="btn btn-secondary">
                                    🛒 Browse Mind Maps
                                </Link>
                                <Link to="/purchase-credits" className="btn btn-secondary">
                                    💳 Buy Credits
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Stats Card */}
                        <div className="card mb-xl">
                            <h4 className="mb-lg">📊 Your Stats</h4>
                            <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <span className="text-muted">Study Streak</span>
                                <strong style={{ color: 'var(--warning)' }}>🔥 {user.studyStreak} days</strong>
                            </div>
                            <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <span className="text-muted">Mind Maps Owned</span>
                                <strong>{user.purchasedItems?.length || 0}</strong>
                            </div>
                            <div className="flex justify-between py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <span className="text-muted">Bookmarks</span>
                                <strong>{user.bookmarks?.length || 0}</strong>
                            </div>
                            <div className="flex justify-between py-md">
                                <span className="text-muted">Predictor Uses Left</span>
                                <strong style={{ color: 'var(--success)' }}>{Math.max(0, 3 - (user.predictorUsage || 0))}/3</strong>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="card">
                            <h4 className="mb-lg">⚙️ Account</h4>
                            <div className="flex flex-col gap-md">
                                <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                                    🔔 Notification Settings
                                </button>
                                <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                                    🔒 Change Password
                                </button>
                                <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                                    📞 Contact Support
                                </button>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 'var(--space-sm) 0' }} />
                                <button
                                    className="btn btn-danger w-full"
                                    onClick={logout}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
        .flex-col {
          flex-direction: column;
        }
        .py-md {
          padding-top: var(--space-md);
          padding-bottom: var(--space-md);
        }
      `}</style>
        </div>
    );
}

export default ProfilePage;
