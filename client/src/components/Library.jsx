import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Library = ({ setView, user }) => {
    const [tab, setTab] = useState('shayari'); // 'shayari' or 'blogs'
    const [shayariList, setShayariList] = useState([]);
    const [blogList, setBlogList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        if (tab === 'shayari') {
            fetchShayari();
        } else {
            fetchBlogs();
        }
    }, [tab]);

    const fetchShayari = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://syahi-a9ml.onrender.com/api/couplets');
            setShayariList(res.data);
        } catch (error) {
            console.error("Failed to fetch shayari:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://syahi-a9ml.onrender.com/api/blogs');
            setBlogList(res.data);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id, type) => {
        if (!user) {
            alert("You must enter the archive to express your admiration.");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const endpoint = type === 'shayari' ? `/api/couplets/${id}/like` : `/api/blogs/${id}/like`;
            const res = await axios.post(`http://localhost:5000${endpoint}`, {}, config);

            // Update local state
            if (type === 'shayari') {
                setShayariList(shayariList.map(item => item._id === id ? res.data : item));
            } else {
                setBlogList(blogList.map(item => item._id === id ? res.data : item));
                if (selectedBlog?._id === id) setSelectedBlog(res.data);
            }
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    if (selectedBlog) {
        return (
            <div className="scroll-unroll-container auth-scroll">
                <div className="scroll-handle handle-top"></div>
                <div className="scroll-paper">
                    <div className="scroll-content">
                        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 className="card-title" style={{ fontSize: '3.5rem' }}>{selectedBlog.title}</h2>
                            <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary-sepia)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                                CHRONICLED BY {selectedBlog.authorName.toUpperCase()} • {new Date(selectedBlog.createdAt).toLocaleDateString()}
                            </p>
                        </header>

                        <div className="card-content" style={{ textAlign: 'left', fontStyle: 'normal', opacity: 1 }}>
                            <p className="shayari-text" style={{ fontSize: '1.3rem', lineHeight: '2', color: 'var(--ink-color)' }}>
                                {selectedBlog.content}
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '4rem' }}>
                            <button
                                className="btn-vintage-text"
                                onClick={() => handleLike(selectedBlog._id, 'blog')}
                                style={{ fontSize: '1.2rem', color: user && selectedBlog.likes?.includes(user._id) ? '#ff3e3e' : 'var(--secondary-sepia)' }}
                            >
                                {user && selectedBlog.likes?.includes(user._id) ? '❤️' : '🤍'} {selectedBlog.likes?.length || 0}
                            </button>
                            <button className="btn-vintage" onClick={() => setSelectedBlog(null)}>Close Scroll</button>
                        </div>
                    </div>
                </div>
                <div className="scroll-handle handle-bottom"></div>
            </div>
        );
    }

    return (
        <div className="scroll-unroll-container library-scroll">
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
                <div className="scroll-content">
                    <h2 className="card-title">The Grand Library of Syahi</h2>

                    <div className="library-tabs">
                        <button
                            className={`tab-btn ${tab === 'shayari' ? 'active' : ''}`}
                            onClick={() => setTab('shayari')}
                        >
                            Inkstone Whispers
                        </button>
                        <button
                            className={`tab-btn ${tab === 'blogs' ? 'active' : ''}`}
                            onClick={() => setTab('blogs')}
                        >
                            Parchment Archives
                        </button>
                    </div>

                    <div className="library-display">
                        {tab === 'shayari' ? (
                            <div className="shayari-grid">
                                {loading ? (
                                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Unrolling scrolls...</p>
                                ) : shayariList.length > 0 ? (
                                    shayariList.map(item => {
                                        const isLiked = user && item.likes?.includes(user._id);
                                        return (
                                            <div key={item._id} className="library-card shayari-card">
                                                <p className="shayari-text">{item.content}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                    <span className="author">— {item.authorName}</span>
                                                    <button
                                                        className="btn-vintage-text"
                                                        onClick={() => handleLike(item._id, 'shayari')}
                                                        style={{ color: isLiked ? '#ff3e3e' : 'var(--secondary-sepia)', fontSize: '1rem' }}
                                                    >
                                                        {isLiked ? '❤️' : '🤍'} {item.likes?.length || 0}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>The inkwell is empty. Be the first to write.</p>
                                )}
                            </div>
                        ) : (
                            <div className="blog-list">
                                {loading ? (
                                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Opening the dusty volumes...</p>
                                ) : blogList.length > 0 ? (
                                    blogList.map(item => {
                                        const isLiked = user && item.likes?.includes(user._id);
                                        return (
                                            <div key={item._id} className="library-card blog-card">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                    <h3>{item.title}</h3>
                                                    <span className="blog-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="blog-excerpt">{item.content.substring(0, 150)}...</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span className="author" style={{ textAlign: 'left', display: 'block' }}>By {item.authorName}</span>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <button
                                                            className="btn-vintage-text"
                                                            onClick={() => handleLike(item._id, 'blog')}
                                                            style={{ color: isLiked ? '#ff3e3e' : 'var(--secondary-sepia)', fontSize: '1rem' }}
                                                        >
                                                            {isLiked ? '❤️' : '🤍'} {item.likes?.length || 0}
                                                        </button>
                                                        <button className="btn-vintage-text" onClick={() => setSelectedBlog(item)}>Read Full Scroll...</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No histories have been recorded yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        className="btn-vintage"
                        style={{ marginTop: '3rem', opacity: 0.7 }}
                        onClick={() => setView('home')}
                    >
                        Return to Hallway
                    </button>
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};


export default Library;
