import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ThreeCanvas from './components/ThreeCanvas';
import Auth from './components/Auth';
import Library from './components/Library';
import PrivateSanctuary from './components/PrivateSanctuary';
import ShardsGallery from './components/ShardsGallery';
import Flowers from './components/Flowers';
import SharedBouquet from './components/SharedBouquet';
import API_BASE_URL from './api';
import './App.css';
import './Home.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'write', 'problem', 'library', 'auth', 'private', 'flowers'
  const [user, setUser] = useState(null);
  const [coupletContent, setCoupletContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [writingType, setWritingType] = useState('shayari'); // 'shayari' or 'blog'
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [showShards, setShowShards] = useState(false); // Toggle between write/view in problem section
  const [sharedBouquetId, setSharedBouquetId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('syahi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    audioRef.current = new Audio('/bg-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    // Check for shared bouquet link
    const path = window.location.pathname;
    if (path.startsWith('/bouquet/')) {
      const id = path.split('/')[2];
      if (id) {
        setSharedBouquetId(id);
        setView('shared-bouquet');
      }
    }

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

      await axios.post(`${API_BASE_URL}${endpoint}`, payload, config);
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

  const handleRefine = async () => {
    if (!coupletContent.trim()) {
      alert("The parchment is empty. Write something first.");
      return;
    }
    if (!user) {
      alert("You must be logged in to use Syahi's magic.");
      setView('auth');
      return;
    }

    setAiLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.post(`${API_BASE_URL}/api/blogs/refine`, { content: coupletContent }, config);
      setCoupletContent(res.data.refined);
    } catch (error) {
      alert(error.response?.data?.message || "The magic failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleProblemSubmit = async () => {
    if (!user) {
      alert("You must be logged in to release your burden.");
      setView('auth');
      return;
    }

    if (!problemTitle.trim() || !problemContent.trim()) {
      alert("Please provide both a title and the content of your silence.");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(`${API_BASE_URL}/api/problems`, {
        title: problemTitle,
        content: problemContent
      }, config);

      alert("Your burden has been released into the silence. Seek solace in the Shards Gallery.");
      setProblemTitle('');
      setProblemContent('');
      setShowShards(true);
    } catch (error) {
      alert(error.response?.data?.message || "The silence rejected your offering. Try again.");
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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-vintage" onClick={() => { setWritingType('shayari'); setView('write'); }}>Write Shayari</button>
            <button className="btn-vintage" style={{ opacity: 0.8 }} onClick={() => { setWritingType('blog'); setView('write'); }}>Write Blog</button>
          </div>
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
          <button className="btn-vintage" onClick={() => setView('library')}>Library</button>
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-vintage" onClick={() => { setShowShards(false); setView('problem'); }}>Pour Your Heart</button>
            <button className="btn-vintage" style={{ opacity: 0.8 }} onClick={() => { setShowShards(true); setView('problem'); }}>View Shards</button>
          </div>
        </section>

        <section className="paper-card card-flowers fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="push-pin"></div>
          <span className="card-icon">🌸</span>
          <h2 className="card-title">Flowers of Words</h2>
          <div className="card-content">
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.2rem', color: 'var(--primary-sepia)' }}>
              "A petal for every sentiment..."
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.7', marginBottom: '1rem' }}>
              Send a virtual bloom with a message.<br />
              Let your words bloom and sway.
            </p>
          </div>
          <button className="btn-vintage" onClick={() => setView('flowers')}>Garden of Voices</button>
        </section>
      </main>

      <div className="coffee-stain stain-2"></div>
    </>
  );

  const renderWrite = () => (
    <div className="scroll-unroll-container write-scroll">
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
            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Title of your scroll..."
                className="vintage-input"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                style={{ marginBottom: 0, flex: 1 }}
              />
              <button
                className="btn-vintage"
                style={{ fontSize: '0.7rem', padding: '0 1rem' }}
                onClick={handleRefine}
                disabled={aiLoading}
              >
                {aiLoading ? '✨ Refining...' : '✨ Refine with Ink'}
              </button>
            </div>
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
              {loading ? "Sealing..." : (writingType === 'blog' ? "Submit Blog" : "Seal Scroll")}
            </button>
            <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close</button>
          </div>
        </div>
      </div>
      <div className="scroll-handle handle-bottom"></div>
    </div>
  );

  const renderProblem = () => (
    <div className="scroll-unroll-container problem-scroll">
      <div className="scroll-handle handle-top"></div>
      <div className="scroll-paper">
        <div className="scroll-content">
          {!showShards ? (
            <>
              <h2 className="card-title">The Weight of Life</h2>
              <input
                type="text"
                placeholder="A whisper of your burden..."
                className="vintage-input"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
              />
              <textarea
                placeholder="Confide in the silence of these pages..."
                className="vintage-textarea"
                value={problemContent}
                onChange={(e) => setProblemContent(e.target.value)}
              ></textarea>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button className="btn-vintage" onClick={handleProblemSubmit} disabled={loading}>
                  {loading ? 'Releasing...' : 'Seek Solace'}
                </button>
                <button className="btn-vintage" style={{ opacity: 0.8 }} onClick={() => setShowShards(true)}>View Shards</button>
                <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close</button>
              </div>
            </>
          ) : (
            <ShardsGallery user={user} onClose={() => setShowShards(false)} setView={setView} />
          )}
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
        {view === 'library' && <Library setView={setView} user={user} />}
        {view === 'flowers' && <Flowers setView={setView} user={user} />}
        {view === 'shared-bouquet' && <SharedBouquet bouquetId={sharedBouquetId} setView={setView} />}

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
