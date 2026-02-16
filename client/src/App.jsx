import React, { useState, useRef, useEffect } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import './App.css';
import './Home.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'write', 'problem', 'read'
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element once
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

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <header className="hero-section fade-in">
        <div className="wax-seal" onClick={() => alert("The wax of centuries guards the whispers of the heart.")}></div>
        <div className="coffee-stain stain-1"></div>
        <h1 className="main-title">Syahi</h1>
        <p className="subtitle">Where Words Become Whispers</p>
      </header>

      {/* Main Sections */}
      <main className="cards-grid">
        {/* Card 1: Inkstone Whispers */}
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
          <button className="btn-vintage" onClick={() => setView('write')}>Write Shayari</button>
        </section>

        {/* Card 2: Parchment Archives */}
        <section className="paper-card card-blog fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="push-pin"></div>
          <span className="card-icon">📖</span>
          <h2 className="card-title">Parchment Archives</h2>
          <div className="card-content">
            <ul style={{ listStyle: 'none', textAlign: 'left', borderTop: '1px dashed #ccc', paddingTop: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Ishq ka Marz</li>
              <li style={{ marginBottom: '0.5rem' }}>Tanhai ki Baatein</li>
              <li style={{ marginBottom: '0.5rem' }}>Yaadon ka Safar</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>Read Blogs...</p>
          </div>
          <button className="btn-vintage" onClick={() => setView('read')}>Read Blogs</button>
        </section>

        {/* Card 3: Shards of Silence */}
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
          <h2 className="card-title">Draft Your Soul</h2>
          <textarea
            placeholder="Let the ink flow into the midnight..."
            className="vintage-textarea"
            dir="rtl"
          ></textarea>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-vintage">Publish Couplets</button>
            <button className="btn-vintage" style={{ opacity: 0.6 }} onClick={() => setView('home')}>Close Scroll</button>
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
        {/* Sound Toggle */}
        <div className="sound-toggle" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '🔊' : '🔈'}
        </div>

        {view === 'home' && renderHome()}
        {view === 'write' && renderWrite()}
        {view === 'problem' && renderProblem()}
        {view === 'read' && (
          <div className="scroll-unroll-container">
            <div className="scroll-handle handle-top"></div>
            <div className="scroll-paper">
              <div className="scroll-content">
                <h2 className="card-title">Dard-Dil Archives</h2>
                <div className="card-content">
                  <p>The ink is still drying on these ancient scrolls...</p>
                  <p style={{ marginTop: '1rem', opacity: 0.7 }}>Check back when the moon is full.</p>
                </div>
                <button className="btn-vintage" onClick={() => setView('home')}>Return Home</button>
              </div>
            </div>
            <div className="scroll-handle handle-bottom"></div>
          </div>
        )}

        {/* Footer Links */}
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
