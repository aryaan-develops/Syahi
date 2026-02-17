import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

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

    const cakeInfo = {
        classic: { emoji: '🎂', name: 'Classic Cake' },
        chocolate: { emoji: '🍫', name: 'Dark Chocolate' },
        vanilla: { emoji: '🧁', name: 'Creamy Vanilla' },
        redvelvet: { emoji: '🍰', name: 'Red Velvet' },
        strawberry: { emoji: '🍰', name: 'Strawberry' },
        butterscotch: { emoji: '🍮', name: 'Butterscotch' }
    };

    const getSpotifyEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
            if (match) {
                return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const fetchBouquet = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/bouquets/${bouquetId}`);
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
        <div className="scroll-unroll-container shared-bouquet-scroll fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
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
                        {bouquet.cakeType && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '20%',
                                fontSize: '5rem',
                                zIndex: 12,
                                filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4))',
                                animation: 'sway 4s ease-in-out infinite'
                            }}>
                                {cakeInfo[bouquet.cakeType]?.emoji}
                            </div>
                        )}
                    </div>

                    <h2 className="card-title" style={{ fontSize: '3rem' }}>To {bouquet.receiver}</h2>

                    <div className="letter-paper" style={{ padding: '3rem', borderRadius: '5px', margin: '3rem 0', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', color: '#333', textAlign: 'left', transform: 'rotate(0.5deg)' }}>
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

                        {bouquet.musicData && (
                            <div className="vintage-player" style={{ margin: '2rem 0' }}>
                                <div className="cd-container">
                                    <div className="cd-disk">
                                        <img src={bouquet.musicData.artworkUrl} alt="art" className="cd-artwork" />
                                        <div className="cd-center"></div>
                                    </div>
                                </div>
                                <div className="player-info">
                                    <h4 style={{ color: 'var(--primary-sepia)', fontFamily: 'var(--font-heading)' }}>{bouquet.musicData.title}</h4>
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>{bouquet.musicData.artist}</p>
                                    <audio controls className="vintage-audio-player">
                                        <source src={bouquet.musicData.previewUrl} type="audio/mpeg" />
                                    </audio>
                                </div>
                            </div>
                        )}

                        {bouquet.spotifyUrl && getSpotifyEmbedUrl(bouquet.spotifyUrl) && (
                            <div style={{ marginTop: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <iframe
                                    src={getSpotifyEmbedUrl(bouquet.spotifyUrl)}
                                    width="100%"
                                    height="80"
                                    frameBorder="0"
                                    allowtransparency="true"
                                    allow="encrypted-media"
                                    title="Spotify Song"
                                ></iframe>
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
