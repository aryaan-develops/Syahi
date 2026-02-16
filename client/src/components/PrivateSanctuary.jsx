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

    const fetchMyData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (tab === 'shayari') {
                const res = await axios.get('http://localhost:5000/api/couplets/mine', config);
                setMyScrolls(res.data);
            } else {
                const res = await axios.get('http://localhost:5000/api/blogs/mine', config);
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
                            <div className="paper-card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
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
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        color: item.isPublic ? '#4caf50' : '#ff9800',
                                                        fontFamily: 'var(--font-heading)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px'
                                                    }}>
                                                        {item.isPublic ? '👁️ Public' : '🔒 Private'}
                                                    </span>
                                                </div>
                                                {tab === 'blogs' && <h4 style={{ fontFamily: 'var(--font-script)', color: 'var(--primary-sepia)', fontSize: '1.4rem', margin: '0.5rem 0' }}>{item.title}</h4>}
                                                <p className="shayari-text small">{tab === 'blogs' ? item.content.substring(0, 100) + '...' : item.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.9rem' }}>You haven't sealed any {tab === 'shayari' ? 'couplets' : 'blogs'} yet.</p>
                                )}
                            </div>

                            <div className="paper-card" style={{ padding: '2rem' }}>
                                <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1rem' }}>Shadow Profile</h3>
                                <p style={{ fontSize: '0.9rem' }}>Codename: {user?.username}</p>
                                <p style={{ fontSize: '0.9rem' }}>Email: {user?.email}</p>
                                <p style={{ fontSize: '0.9rem' }}>Joined: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn-vintage" onClick={handleLogout}>Vanish (Logout)</button>
                        <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Home</button>
                    </div>
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};

export default PrivateSanctuary;
