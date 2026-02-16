import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ThreeCanvas from './components/ThreeCanvas';
import Auth from './components/Auth';
import Library from './components/Library';
import PrivateSanctuary from './components/PrivateSanctuary';
import './App.css';
import './Home.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'write', 'problem', 'library', 'auth', 'private'
  const [user, setUser] = useState(null);
  const [coupletContent, setCoupletContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [writingType, setWritingType] = useState('shayari'); // 'shayari' or 'blog'
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('syahi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    audioRef.current = new Audio('/bg-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback stalled:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleLogout = () => {
    localStorage.removeItem('syahi_user');
    setUser(null);
    setView('home');
  };

  const handlePublish = async () => {
    if (!user) {
      alert("You must be logged in to seal a scroll.");
      setView('auth');
      return;
    }

    if (!coupletContent.trim()) {
      alert("The parchment is empty. Let your soul speak.");
      return;
    }

    if (writingType === 'blog' && !blogTitle.trim()) {
      alert("Every archive needs a title. Please name your scroll.");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const endpoint = writingType === 'shayari' ? '/api/couplets' : '/api/blogs';
      const payload = writingType === 'shayari'
        ? { content: coupletContent, isPublic }
        : { title: blogTitle, content: coupletContent, isPublic };

      await axios.post(`http://localhost:5000${endpoint}`, payload, config);
      alert(`Your whispers have been sealed in the ${isPublic ? 'Grand Library' : 'Private Sanctuary'}.`);
      setCoupletContent('');
      setBlogTitle('');
      setIsPublic(true);
      setView('library');
    } catch (error) {
      alert(error.response?.data?.message || "The ink failed to bind. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <>
      <div className="user-account-btn">
        {user ? (
          <button className="btn-vintage" onClick={() => setView('private')}>
            📜 {user.username}
          </button>
        ) : (
          <button className="btn-vintage" onClick={() => setView('auth')}>
            🕯️ Enter The Archive
          </button>
        )}
      </div>

      <header className="hero-section fade-in">
        <div className="wax-seal" onClick={() => alert("The wax of centuries guards the whispers of the heart.")}></div>
        <div className="coffee-stain stain-1"></div>
        <h1 className="main-title">Syahi</h1>
        <p className="subtitle">Where Words Become Whispers</p>
      </header>

      <main className="cards-grid">
        <section className="paper-card card-shayari-pen fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="push-pin"></div>
          <span className="card-icon">✒️</span>
          <h2 className="card-title">Inkstone Whispers</h2>
          <div className="card-content">
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "In love, there is no difference<br />
              Between life and death;<br />
              I live by looking at the very one<br />
              For whom I would surely die."
            </p>
            <p>Share your couplets...</p>
          </div>
          <button className="btn-vintage" onClick={() => { setWritingType('shayari'); setView('write'); }}>Write Shayari</button>
        </section>

        <section className="paper-card card-blog fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="push-pin"></div>
          <span className="card-icon">📖</span>
          <h2 className="card-title">Parchment Archives</h2>
          <div className="card-content">
            <ul style={{ listStyle: 'none', textAlign: 'left', borderTop: '1px dashed #ccc', paddingTop: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>The Alchemy of Ink</li>
              <li style={{ marginBottom: '0.5rem' }}>Tanhai ki Baatein</li>
              <li style={{ marginBottom: '0.5rem' }}>Architectures of Solitude</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>Read Blogs...</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-vintage" onClick={() => setView('library')}>Library</button>
            <button className="btn-vintage" style={{ opacity: 0.8 }} onClick={() => { setWritingType('blog'); setView('write'); }}>Write Blog</button>
          </div>
        </section>

        <section className="paper-card card-problem fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="push-pin"></div>
          <span className="card-icon">⚖️</span>
          <h2 className="card-title">Shards of Silence</h2>
          <div className="card-content">
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.2rem', color: 'var(--primary-sepia)' }}>
              "Let the silence speak..."
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.7', marginBottom: '1rem' }}>
              Release the burdens gathered in the quiet.<br />
              Find solace where whispers are understood.
            </p>
          </div>
          <button className="btn-vintage" onClick={() => setView('problem')}>Pour Your Heart</button>
        </section>
      </main>

      <div className="coffee-stain stain-2"></div>
    </>
  );

  const renderWrite = () => (
    <div className="scroll-unroll-container">
      <div className="scroll-handle handle-top"></div>
      <div className="scroll-paper">
        <div className="scroll-content">
          <h2 className="card-title">{writingType === 'shayari' ? 'Draft Your Soul' : 'Compose a Legend'}</h2>

          <div className="write-options" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <label className="vintage-radio">
              <input
                type="radio"
                name="writingType"
                checked={writingType === 'shayari'}
                onChange={() => setWritingType('shayari')}
              />
              <span>Shayari</span>
            </label>
            <label className="vintage-radio">
              <input
                type="radio"
                name="writingType"
                checked={writingType === 'blog'}
                onChange={() => setWritingType('blog')}
              />
              <span>Blog Post</span>
            </label>
          </div>

          {writingType === 'blog' && (
            <input
              type="text"
              placeholder="Title of your scroll..."
              className="vintage-input"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
          )}

          <textarea
            placeholder={writingType === 'shayari' ? "Let the ink flow..." : "The history begins here..."}
            className="vintage-textarea"
            value={coupletContent}
            onChange={(e) => setCoupletContent(e.target.value)}
            style={{ minHeight: writingType === 'blog' ? '400px' : '200px' }}
          ></textarea>

          <div className="privacy-toggle" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{ color: 'var(--secondary-sepia)', marginRight: '1rem', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', letterSpacing: '1px' }}>
              VISIBILITY:
            </span>
            <button
              className={`tab-btn ${isPublic ? 'active' : ''}`}
              onClick={() => setIsPublic(true)}
              style={{ fontSize: '0.8rem' }}
            >
              Public
            </button>
            <button
              className={`tab-btn ${!isPublic ? 'active' : ''}`}
              onClick={() => setIsPublic(false)}
              style={{ fontSize: '0.8rem' }}
            >
              Private
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-vintage"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Sealing..." : "Seal Scroll"}
            </button>
            <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close</button>
          </div>
        </div>
      </div>
      <div className="scroll-handle handle-bottom"></div>
    </div>
  );

  const renderProblem = () => (
    <div className="scroll-unroll-container">
      <div className="scroll-handle handle-top"></div>
      <div className="scroll-paper">
        <div className="scroll-content">
          <h2 className="card-title">The Weight of Life</h2>
          <input type="text" placeholder="A whisper of your burden..." className="vintage-input" />
          <textarea
            placeholder="Confide in the silence of these pages..."
            className="vintage-textarea"
          ></textarea>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-vintage">Seek Solace</button>
            <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close Scroll</button>
          </div>
        </div>
      </div>
      <div className="scroll-handle handle-bottom"></div>
    </div>
  );

  return (
    <>
      <ThreeCanvas />
      <div className="home-container">
        <div className="sound-toggle" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '🔊' : '🔈'}
        </div>

        {view === 'home' && renderHome()}
        {view === 'write' && renderWrite()}
        {view === 'problem' && renderProblem()}
        {view === 'auth' && <Auth setView={setView} onLogin={(u) => setUser(u)} />}
        {view === 'private' && (
          <PrivateSanctuary
            user={user}
            handleLogout={handleLogout}
            setView={setView}
          />
        )}
        {view === 'library' && <Library setView={setView} />}

        <footer className="footer-links fade-in" style={{ animationDelay: '0.8s' }}>
          <a href="#about">About Us</a>
          <a href="#archives">Archives</a>
          <a href="#contact">Contact</a>
        </footer>
      </div>
    </>
  );
}

export default App;
