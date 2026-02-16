import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setView, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api/auth';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/login' : '/register';

        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            localStorage.setItem('syahi_user', JSON.stringify(res.data));
            onLogin(res.data);
            setView('home');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scroll-unroll-container auth-scroll">
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
                <div className="scroll-content">
                    <h2 className="card-title">{isLogin ? 'Whispers of Return' : 'Seal Your Pact'}</h2>

                    {error && <p className="auth-error">{error}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="input-group">
                                <label>Codename</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="e.g. Ghalib's Shadow"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="vintage-input"
                                />
                            </div>
                        )}
                        <div className="input-group">
                            <label>Mail from the Void</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Ancient email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="vintage-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>Secret Key</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="The silent key"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="vintage-input"
                            />
                        </div>

                        <div className="auth-actions">
                            <button type="submit" className="btn-vintage" disabled={loading}>
                                {loading ? 'Sealing...' : (isLogin ? 'Enter The Archive' : 'Join The Whispers')}
                            </button>
                            <button
                                type="button"
                                className="btn-vintage-text"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'New Scroll? Create One' : 'Returning Soul? Log In'}
                            </button>
                        </div>
                    </form>

                    <button className="btn-vintage" style={{ opacity: 0.6, marginTop: '2rem' }} onClick={() => setView('home')}>
                        Return to Library
                    </button>
                </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
        </div>
    );
};

export default Auth;
