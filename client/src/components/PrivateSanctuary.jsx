import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateSanctuary = ({ user, handleLogout, setView }) => {
    const [myScrolls, setMyScrolls] = useState([]);
    const [myBlogs, setMyBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('shayari'); // 'shayari' or 'blogs'

    useEffect(() => {
        if (user) {
            fetchMyData();
        }
    }, [user, tab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently erase this scroll? This action cannot be undone.")) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const endpoint = tab === 'shayari' ? `/api/couplets/${id}` : `/api/blogs/${id}`;
            await axios.delete(`https://syahi-a9ml.onrender.com${endpoint}`, config);
            fetchMyData(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || "Failed to erase the scroll.");
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const endpoint = tab === 'shayari' ? `/api/couplets/${id}/visibility` : `/api/blogs/${id}/visibility`;
            await axios.patch(`https://syahi-a9ml.onrender.com${endpoint}`, {}, config);
            fetchMyData(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change visibility.");
        }
    };

    const fetchMyData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (tab === 'shayari') {
                const res = await axios.get('https://syahi-a9ml.onrender.com/api/couplets/mine', config);
                setMyScrolls(res.data);
            } else {
                const res = await axios.get('https://syahi-a9ml.onrender.com/api/blogs/mine', config);
                setMyBlogs(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch personal data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scroll-unroll-container auth-scroll">
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
                <div className="scroll-content">
                    <h2 className="card-title">A Sanctuary for {user?.username}</h2>

                    <div className="library-tabs" style={{ marginBottom: '2rem' }}>
                        <button className={`tab-btn ${tab === 'shayari' ? 'active' : ''}`} onClick={() => setTab('shayari')}>My Shayari</button>
                        <button className={`tab-btn ${tab === 'blogs' ? 'active' : ''}`} onClick={() => setTab('blogs')}>My Blogs</button>
                    </div>

                    <div className="card-content">
                        <div className="private-space-grid">
                            <div className="paper-card" style={{ padding: '2rem' }}>
                                <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1.5rem' }}>
                                    Your {tab === 'shayari' ? 'Whispers' : 'Chronicles'}
                                </h3>

                                {loading ? (
                                    <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Unrolling your history...</p>
                                ) : (tab === 'shayari' ? myScrolls : myBlogs).length > 0 ? (
                                    <div className="personal-scrolls-list">
                                        {(tab === 'shayari' ? myScrolls : myBlogs).map(item => (
                                            <div key={item._id} className="personal-scroll-item">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span className="scroll-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    <span
                                                        onClick={() => handleToggleVisibility(item._id)}
                                                        style={{
                                                            fontSize: '0.65rem',
                                                            color: item.isPublic ? '#4caf50' : '#ff9800',
                                                            fontFamily: 'var(--font-heading)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1.5px',
                                                            cursor: 'pointer',
                                                            padding: '0.2rem 0.5rem',
                                                            border: `1px solid ${item.isPublic ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`,
                                                            borderRadius: '4px',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(244, 208, 111, 0.1)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'none'}
                                                        title="Click to toggle visibility"
                                                    >
                                                        {item.isPublic ? '👁️ Public' : '🔒 Private'}
                                                    </span>
                                                </div>
                                                {tab === 'blogs' && <h4 style={{ fontFamily: 'var(--font-script)', color: 'var(--primary-sepia)', fontSize: '1.4rem', margin: '0.5rem 0' }}>{item.title}</h4>}
                                                <p className="shayari-text small">{tab === 'blogs' ? item.content.substring(0, 100) + '...' : item.content}</p>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ff3e3e',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                            fontFamily: 'var(--font-heading)',
                                                            opacity: 0.6
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                                        onMouseLeave={(e) => e.target.style.opacity = 0.6}
                                                    >
                                                        🗑️ Erase Scroll
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.9rem' }}>You haven't sealed any {tab === 'shayari' ? 'couplets' : 'blogs'} yet.</p>
                                )}
                            </div>

                            <div className="paper-card" style={{ padding: '2rem' }}>
                                <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1.5rem' }}>Shadow Profile</h3>
                                <div style={{ textAlign: 'left', fontStyle: 'normal' }}>
                                    <p style={{ fontSize: '1rem', marginBottom: '0.8rem' }}><strong>Codename:</strong> {user?.username}</p>
                                    <p style={{ fontSize: '1rem', marginBottom: '0.8rem' }}><strong>Email:</strong> {user?.email}</p>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: '#ff3e3e' }}>
                                        <strong>❤️ Admiration Seals:</strong> {
                                            myScrolls.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0) +
                                            myBlogs.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)
                                        }
                                    </p>
                                    <p style={{ fontSize: '1rem' }}><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
                        <button className="btn-vintage" onClick={() => setView('home')}>Home</button>
                        <button className="btn-vintage" style={{ opacity: 0.7 }} onClick={handleLogout}>Vanish (Logout)</button>
                    </div>
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};

export default PrivateSanctuary;
