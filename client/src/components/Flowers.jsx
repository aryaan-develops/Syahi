import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Flowers = ({ user, setView }) => {
    // State for existing bouquets (Garden View)
    const [bouquets, setBouquets] = useState([]);
    const [loading, setLoading] = useState(false);

    // State for Builder
    const [isBuilding, setIsBuilding] = useState(false);
    const [chosenFlowers, setChosenFlowers] = useState([]);
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [attachedShayariId, setAttachedShayariId] = useState('');

    // State for Reveal
    const [selectedBouquet, setSelectedBouquet] = useState(null);

    // Helper Data
    const [publicCouplets, setPublicCouplets] = useState([]);

    const flowerInfo = {
        rose: { emoji: '🌹', meaning: 'Eternal Love & Passion', color: '#ff4d4d' },
        lily: { emoji: '🪷', meaning: 'Purity & Rebirth', color: '#ffb3d9' },
        sunflower: { emoji: '🌻', meaning: 'Adoration & Loyalty', color: '#ffd700' },
        lotus: { emoji: '🪻', meaning: 'Spiritual Enlightenment', color: '#b366ff' },
        jasmine: { emoji: '🌼', meaning: 'Grace & Elegance', color: '#fff5cc' }
    };

    useEffect(() => {
        fetchPublicBouquets();
        fetchPublicCouplets();
    }, []);

    const fetchPublicBouquets = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/bouquets/public');
            setBouquets(res.data);
        } catch (error) {
            console.error("Failed to fetch bouquets:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPublicCouplets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/couplets'); // Already public route
            setPublicCouplets(res.data.filter(c => c.isPublic));
        } catch (error) {
            console.error("Failed to fetch couplets:", error);
        }
    };

    const handleCreateBouquet = async () => {
        if (!user) {
            alert("You must enter the archive to bind a bouquet.");
            setView('auth');
            return;
        }

        if (chosenFlowers.length === 0) {
            alert("A bouquet needs flowers to carry your sentiment.");
            return;
        }

        if (!message.trim()) {
            alert("Whisper your intention into the arrangement.");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const payload = {
                flowers: chosenFlowers,
                message,
                receiver: receiver || 'Collective Soul',
                attachedShayari: attachedShayariId || null,
                isPublic
            };

            const res = await axios.post('http://localhost:5000/api/bouquets', payload, config);

            if (isPublic) {
                setBouquets([res.data, ...bouquets]);
            }

            alert(isPublic
                ? "Your bouquet has been placed in the Garden of Voices."
                : "Your secret bouquet is bound. Share the link with its intended soul."
            );

            // Show the newly created bouquet
            setSelectedBouquet(res.data);
            setIsBuilding(false);
            setChosenFlowers([]);
            setMessage('');
            setReceiver('');
            setAttachedShayariId('');
        } catch (error) {
            alert("The binding failed. Try again.");
        }
    };

    const toggleFlower = (type) => {
        if (chosenFlowers.length >= 8) {
            alert("This bouquet is full. Let these blooms speak.");
            return;
        }
        setChosenFlowers([...chosenFlowers, type]);
    };

    const removeFlower = (index) => {
        const newSet = [...chosenFlowers];
        newSet.splice(index, 1);
        setChosenFlowers(newSet);
    };

    const handleShare = (id) => {
        const url = `${window.location.origin}/bouquet/${id}`;
        navigator.clipboard.writeText(url);
        alert("A unique link to this sentiment has been copied to your parchment.");
    };

    const handleDeleteBouquet = async (id) => {
        if (!window.confirm("Are you sure you want this arrangement to wither?")) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`http://localhost:5000/api/bouquets/${id}`, config);
            setBouquets(bouquets.filter(b => b._id !== id));
            setSelectedBouquet(null);
            alert("The bouquet has vanished.");
        } catch (error) {
            alert("The wither failed. Try again.");
        }
    };

    return (
        <div className="scroll-unroll-container flowers-scroll">
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
                <div className="scroll-content">
                    {selectedBouquet ? (
                        <div className="bouquet-reveal fade-in" style={{ textAlign: 'center', padding: '1rem' }}>
                            {/* Bouquet Visualization */}
                            <div className="bouquet-wrap" style={{ position: 'relative', height: '220px', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                {selectedBouquet.flowers.map((f, i) => (
                                    <div key={i} style={{
                                        fontSize: '4.5rem',
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: `calc(50% + ${(i - (selectedBouquet.flowers.length - 1) / 2) * 35}px)`,
                                        transform: `rotate(${(i - (selectedBouquet.flowers.length - 1) / 2) * 15}deg)`,
                                        animation: `sway ${3 + i * 0.5}s ease-in-out infinite`,
                                        zIndex: 10 - i,
                                        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'
                                    }}>
                                        {flowerInfo[f].emoji}
                                    </div>
                                ))}
                                {/* Ribbon/Wrap Overlay could go here */}
                                <div style={{ position: 'absolute', bottom: '0', width: '120px', height: '80px', background: 'rgba(244, 208, 111, 0.1)', borderRadius: '0 0 50px 50px', border: '1px solid rgba(244, 208, 111, 0.2)', zIndex: 11 }}></div>
                            </div>

                            <h2 className="card-title" style={{ color: 'var(--primary-sepia)', fontSize: '2.5rem' }}>
                                To {selectedBouquet.receiver}
                            </h2>

                            <div className="letter-paper" style={{ background: '#fff9e6', padding: '2rem', borderRadius: '5px', margin: '2rem 0', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', color: '#333', textAlign: 'left', transform: 'rotate(-1deg)' }}>
                                <p className="shayari-text" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#444', fontStyle: 'italic', fontStyle: 'normal' }}>
                                    {selectedBouquet.message}
                                </p>

                                {selectedBouquet.attachedShayari && (
                                    <div style={{ borderTop: '1px dashed #ccc', paddingTop: '1rem', marginTop: '1rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Attached Whisper:</p>
                                        <p style={{ fontStyle: 'italic', color: 'var(--primary-sepia)', fontSize: '1.1rem' }}>
                                            "{selectedBouquet.attachedShayari.content}"
                                        </p>
                                        <p style={{ textAlign: 'right', fontSize: '0.7rem', color: '#999' }}>— {selectedBouquet.attachedShayari.authorName}</p>
                                    </div>
                                )}

                                <p style={{ textAlign: 'right', marginTop: '1.5rem', fontStyle: 'italic', color: '#666' }}>
                                    Sincerely,<br />
                                    {selectedBouquet.senderName}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                <button className="btn-vintage-text" onClick={() => handleShare(selectedBouquet._id)}>Generate Link</button>
                                {user && selectedBouquet.sender === user._id && (
                                    <button
                                        className="btn-vintage-text"
                                        style={{ color: '#ff3e3e' }}
                                        onClick={() => handleDeleteBouquet(selectedBouquet._id)}
                                    >
                                        Wither Arrangement
                                    </button>
                                )}
                                <button className="btn-vintage" onClick={() => setSelectedBouquet(null)}>Back to Garden</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="card-title">Garden of Voices</h2>
                            <p style={{ fontStyle: 'italic', color: 'var(--secondary-sepia)', marginBottom: '2rem' }}>
                                "Where every sentiment blooms forever."
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                                <button className="btn-vintage" onClick={() => setIsBuilding(!isBuilding)}>
                                    {isBuilding ? 'View Garden' : 'Bind a Bouquet'}
                                </button>
                                <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close Garden</button>
                            </div>

                            {isBuilding ? (
                                <div className="bouquet-builder fade-in" style={{ textAlign: 'left' }}>
                                    {/* Step 1: Pick Flowers */}
                                    <div className="builder-section" style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1rem', textAlign: 'center' }}>Step 1: Pick your Blooms ({chosenFlowers.length}/8)</h3>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            {Object.keys(flowerInfo).map(type => (
                                                <button
                                                    key={type}
                                                    className="btn-vintage-text"
                                                    onClick={() => toggleFlower(type)}
                                                    style={{ fontSize: '1.5rem', padding: '0.5rem', background: 'rgba(244, 208, 111, 0.05)', borderRadius: '10px' }}
                                                    title={flowerInfo[type].meaning}
                                                >
                                                    {flowerInfo[type].emoji}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Preview chosen */}
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', minHeight: '50px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px', padding: '1rem' }}>
                                            {chosenFlowers.map((f, i) => (
                                                <span key={i} onClick={() => removeFlower(i)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>{flowerInfo[f].emoji}</span>
                                            ))}
                                            {chosenFlowers.length === 0 && <p style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '0.8rem' }}>Select flowers to add to your bouquet...</p>}
                                        </div>
                                    </div>

                                    {/* Step 2: Attach Shayari */}
                                    <div className="builder-section" style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1rem', textAlign: 'center' }}>Step 2: Attach a Whisper (Optional)</h3>
                                        <select
                                            className="vintage-input"
                                            style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', color: 'var(--primary-sepia)' }}
                                            value={attachedShayariId}
                                            onChange={(e) => setAttachedShayariId(e.target.value)}
                                        >
                                            <option value="">-- No Shayari Attached --</option>
                                            {publicCouplets.map(c => (
                                                <option key={c._id} value={c._id}>{c.content.substring(0, 40)}...</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Step 3: Message & Meta */}
                                    <div className="builder-section">
                                        <h3 style={{ color: 'var(--primary-sepia)', marginBottom: '1rem', textAlign: 'center' }}>Step 3: Seal your Sentiment</h3>
                                        <input
                                            type="text"
                                            placeholder="Recipient's Soul Name..."
                                            className="vintage-input"
                                            value={receiver}
                                            onChange={(e) => setReceiver(e.target.value)}
                                            style={{ textAlign: 'center' }}
                                        />
                                        <textarea
                                            placeholder="Write your personal message..."
                                            className="vintage-textarea"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            style={{ textAlign: 'center', minHeight: '120px' }}
                                        ></textarea>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                            <input
                                                type="checkbox"
                                                id="public-toggle"
                                                checked={isPublic}
                                                onChange={() => setIsPublic(!isPublic)}
                                            />
                                            <label htmlFor="public-toggle" style={{ color: 'var(--secondary-sepia)', fontSize: '0.9rem' }}>Show in Public Garden</label>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                            <button className="btn-vintage" onClick={handleCreateBouquet}>Bind & Seal</button>
                                            <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setIsBuilding(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="garden-display">
                                    {loading ? (
                                        <p style={{ fontStyle: 'italic' }}>Gleaning arrangements from the archive...</p>
                                    ) : bouquets.length > 0 ? (
                                        <div className="flowers-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                            gap: '2.5rem',
                                            textAlign: 'center'
                                        }}>
                                            {bouquets.map(bouquet => (
                                                <div
                                                    key={bouquet._id}
                                                    className="flower-item"
                                                    onClick={() => setSelectedBouquet(bouquet)}
                                                    style={{
                                                        background: 'rgba(0, 0, 0, 0.2)',
                                                        border: '1px solid rgba(244, 208, 111, 0.1)',
                                                        padding: '2rem 1.5rem',
                                                        borderRadius: '15px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.4s ease',
                                                        position: 'relative'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                                        {bouquet.flowers.slice(0, 3).map((f, idx) => (
                                                            <span key={idx} style={{ fontSize: '2rem', marginLeft: idx > 0 ? '-10px' : '0' }}>{flowerInfo[f].emoji}</span>
                                                        ))}
                                                        {bouquet.flowers.length > 3 && <span style={{ fontSize: '0.8rem', alignSelf: 'center', marginLeft: '5px' }}>+{bouquet.flowers.length - 3}</span>}
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-sepia)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                        To {bouquet.receiver}
                                                    </p>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--secondary-sepia)' }}>— From {bouquet.senderName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontStyle: 'italic' }}>The garden is quiet. Be the first to bind a bouquet.</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};

export default Flowers;
