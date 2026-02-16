import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShardsGallery = ({ user, onClose, setView }) => {
    const [shards, setShards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [solaceInput, setSolaceInput] = useState('');
    const [activeShard, setActiveShard] = useState(null);

    useEffect(() => {
        fetchShards();
    }, []);

    const fetchShards = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/problems');
            setShards(res.data);
        } catch (error) {
            console.error("Failed to fetch shards:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSolace = async (shardId) => {
        if (!user) {
            alert("You must enter the archive to offer solace.");
            setView('auth');
            return;
        }

        if (!solaceInput.trim()) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const res = await axios.post(`http://localhost:5000/api/problems/${shardId}/solace`, {
                content: solaceInput
            }, config);

            setShards(shards.map(s => s._id === shardId ? res.data : s));
            setSolaceInput('');
            setActiveShard(null);
            alert("Your words of comfort have been woven into the silence.");
        } catch (error) {
            alert("The shard rejected your comfort. Try again.");
        }
    };

    const handleDeleteShard = async (shardId) => {
        if (!window.confirm("Are you sure you want to let this shard vanish?")) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`http://localhost:5000/api/problems/${shardId}`, config);
            setShards(shards.filter(s => s._id !== shardId));
            alert("The burden has been erased from the archives.");
        } catch (error) {
            alert("The silence refused to fade. Try again.");
        }
    };

    const handleDeleteSolace = async (shardId, solaceId) => {
        if (!window.confirm("Are you sure you want to remove this word of comfort?")) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const res = await axios.delete(`http://localhost:5000/api/problems/${shardId}/solace/${solaceId}`, config);
            setShards(shards.map(s => s._id === shardId ? res.data : s));
            alert("The solace has been retracted.");
        } catch (error) {
            alert("The comfort remains bound. Try again.");
        }
    };

    return (
        <div className="shards-gallery">
            <h2 className="card-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Shards of Silence</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button className="btn-vintage" onClick={onClose} style={{ fontSize: '0.8rem' }}>Write New Burden</button>
            </div>

            {loading ? (
                <p style={{ fontStyle: 'italic' }}>Gleaning shards from the shadows...</p>
            ) : shards.length > 0 ? (
                <div className="shards-list" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {shards.map(shard => (
                        <div key={shard._id} className="shard-item" style={{ borderBottom: '1px solid rgba(244, 208, 111, 0.1)', paddingBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-sepia)', fontFamily: 'var(--font-script)', fontSize: '2rem', marginBottom: '1rem' }}>
                                {shard.title}
                            </h3>
                            <p className="shayari-text" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--ink-color)', marginBottom: '1rem' }}>
                                "{shard.content}"
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="author" style={{ opacity: 0.6 }}>— Released by {shard.authorName}</span>
                                {user && shard.author === user._id && (
                                    <button
                                        className="btn-vintage-text"
                                        style={{ color: '#ff3e3e', fontSize: '0.7rem', textDecoration: 'none' }}
                                        onClick={() => handleDeleteShard(shard._id)}
                                    >
                                        [ Let it Vanish ]
                                    </button>
                                )}
                            </div>

                            <div className="solace-section" style={{ marginTop: '1.5rem', paddingLeft: '2rem', borderLeft: '2px solid rgba(244, 208, 111, 0.2)' }}>
                                {shard.answers.length > 0 && (
                                    <div className="answers-list" style={{ marginBottom: '1rem' }}>
                                        {shard.answers.map((answer) => (
                                            <div key={answer._id} style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <p style={{ fontStyle: 'normal', color: 'var(--secondary-sepia)', fontSize: '0.95rem', margin: 0 }}>
                                                    ✨ <strong>{answer.authorName}:</strong> {answer.content}
                                                </p>
                                                {user && answer.author === user._id && (
                                                    <button
                                                        className="btn-vintage-text"
                                                        style={{ color: '#ff3e3e', fontSize: '0.65rem', textDecoration: 'none', opacity: 0.5 }}
                                                        onClick={() => handleDeleteSolace(shard._id, answer._id)}
                                                    >
                                                        Retract
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeShard === shard._id ? (
                                    <div style={{ marginTop: '1rem' }}>
                                        <textarea
                                            placeholder="Write words of comfort..."
                                            className="vintage-textarea"
                                            style={{ minHeight: '100px', fontSize: '0.9rem' }}
                                            value={solaceInput}
                                            onChange={(e) => setSolaceInput(e.target.value)}
                                        ></textarea>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button className="btn-vintage-text" onClick={() => handleAddSolace(shard._id)}>Seal Solace</button>
                                            <button className="btn-vintage-text" style={{ opacity: 0.6 }} onClick={() => setActiveShard(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn-vintage-text" onClick={() => setActiveShard(shard._id)}>+ Offer Solace</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontStyle: 'italic' }}>No burdens have been released today. The hall is quiet.</p>
            )}

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close Shards</button>
            </div>
        </div>
    );
};

export default ShardsGallery;
