import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SharedBouquet = ({ bouquetId, setView }) => {
    const [bouquet, setBouquet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const flowerInfo = {
        rose: { emoji: '🌹', color: '#ff4d4d' },
        lily: { emoji: '🪷', color: '#ffb3d9' },
        sunflower: { emoji: '🌻', color: '#ffd700' },
        lotus: { emoji: '🪻', color: '#b366ff' },
        jasmine: { emoji: '🌼', color: '#fff5cc' }
    };

    useEffect(() => {
        const fetchBouquet = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bouquets/${bouquetId}`);
                setBouquet(res.data);
            } catch (err) {
                setError("This bouquet has withered or never bloomed.");
            } finally {
                setLoading(false);
            }
        };
        fetchBouquet();
    }, [bouquetId]);

    if (loading) return <div className="loading-screen">Gleaning the blooms...</div>;
    if (error) return (
        <div className="error-screen" style={{ textAlign: 'center', padding: '5rem' }}>
            <h2 className="card-title">Empty Vase</h2>
            <p style={{ fontStyle: 'italic', margin: '1rem 0' }}>{error}</p>
            <button className="btn-vintage" onClick={() => (window.location.href = '/')}>Return to Archive</button>
        </div>
    );

    return (
        <div className="scroll-unroll-container fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
                <div className="scroll-content" style={{ textAlign: 'center' }}>
                    <div className="bouquet-wrap" style={{ position: 'relative', height: '250px', marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                        {bouquet.flowers.map((f, i) => (
                            <div key={i} style={{
                                fontSize: '5rem',
                                position: 'absolute',
                                bottom: '30px',
                                left: `calc(50% + ${(i - (bouquet.flowers.length - 1) / 2) * 40}px)`,
                                transform: `rotate(${(i - (bouquet.flowers.length - 1) / 2) * 15}deg)`,
                                animation: `sway ${3 + i * 0.5}s ease-in-out infinite`,
                                zIndex: 10 - i,
                                filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.4))'
                            }}>
                                {flowerInfo[f]?.emoji || '🌸'}
                            </div>
                        ))}
                    </div>

                    <h2 className="card-title" style={{ fontSize: '3rem' }}>To {bouquet.receiver}</h2>

                    <div className="letter-paper" style={{ background: '#fff9e6', padding: '3rem', borderRadius: '5px', margin: '3rem 0', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', color: '#333', textAlign: 'left', transform: 'rotate(0.5deg)' }}>
                        <p className="shayari-text" style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#313131', marginBottom: '2rem' }}>
                            {bouquet.message}
                        </p>

                        {bouquet.attachedShayari && (
                            <div style={{ borderTop: '2px dashed #e6dbb9', paddingTop: '1.5rem', marginTop: '2rem' }}>
                                <p style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>A poetic whisper from the archive:</p>
                                <p style={{ fontStyle: 'italic', color: '#7a5c37', fontSize: '1.2rem', lineHeight: '1.6' }}>
                                    "{bouquet.attachedShayari.content}"
                                </p>
                                <p style={{ textAlign: 'right', fontSize: '0.9rem', color: '#aaa', marginTop: '1rem' }}>— {bouquet.attachedShayari.authorName}</p>
                            </div>
                        )}

                        <p style={{ textAlign: 'right', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.1rem' }}>
                            With regards,<br />
                            <span style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>{bouquet.senderName}</span>
                        </p>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button className="btn-vintage" onClick={() => (window.location.href = '/')}>Enter The Archive</button>
                    </div>
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};

export default SharedBouquet;
