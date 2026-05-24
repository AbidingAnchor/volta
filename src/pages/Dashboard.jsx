import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState({
    twitter: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    email: ''
  });
  const [copied, setCopied] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleRepurpose = async () => {
    if (!inputText.trim()) return;

    // Check if free plan user has reached limit
    if (profile?.plan === 'free' && profile?.repurpose_count >= 5) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setOutputs({ twitter: '', linkedin: '', instagram: '', facebook: '', email: '' });

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setOutputs(data);
      setShowResults(true);
      
      // Increment repurpose count
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ repurpose_count: (profile?.repurpose_count || 0) + 1 })
          .eq('id', user.id);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (type, content) => {
    navigator.clipboard.writeText(content);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <div className="app">
      <div className="noise-overlay"></div>
      <div className="grid-mesh"></div>
      <div className="stars"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>
      <nav className="navbar">
        <div className="nav-logo">
          <Link to="/">
            <span className="nav-logo-icon">⚡</span>
            <span className="nav-logo-text">Volta</span>
          </Link>
        </div>
        <div className="nav-links">
          <div className="user-info">
            <span className="user-name">{profile?.full_name || 'User'}</span>
            <span className={`user-plan ${profile?.plan}`}>{profile?.plan || 'free'}</span>
          </div>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <button onClick={handleSignOut} className="nav-link">Sign Out</button>
        </div>
      </nav>

      <header className="header">
        <div className="hero-logo">
          <span className="hero-logo-icon">⚡</span>
        </div>
        <h1>Dashboard</h1>
        <p className="tagline">Transform Your Content</p>
        <p className="subtitle">Paste your content and let AI do the rest.</p>
      </header>

      <div className="frosted-divider"></div>

      <main className="main">
        <div className="input-section">
          <div className="input-container">
            <textarea
              className="input-textarea"
              placeholder="Paste your blog post or article here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
            />
            <div className="character-count">
              {inputText.length} characters
            </div>
            <button
              className={`repurpose-button ${loading ? 'loading' : ''}`}
              onClick={handleRepurpose}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <>
                  <span className="lightning-spinner">⚡</span>
                  Generating...
                </>
              ) : (
                '⚡ Repurpose Content'
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <>
            <div className="divider"></div>
            <div className="outputs-section">
              <h2 className="outputs-title">Generated Content</h2>
              <div className="outputs-grid">
                <SkeletonCard title="Twitter Thread" icon="𝕏" type="twitter" />
                <SkeletonCard title="LinkedIn Post" icon="in" type="linkedin" />
                <SkeletonCard title="Instagram Caption" icon="📷" type="instagram" />
                <SkeletonCard title="Facebook Post" icon="📘" type="facebook" />
                <SkeletonCard title="Email Newsletter Intro" icon="✉️" type="email" />
              </div>
            </div>
          </>
        ) : showResults && (outputs.twitter || outputs.linkedin || outputs.instagram || outputs.facebook || outputs.email) ? (
          <>
            <div className="divider"></div>
            <div className="outputs-section">
              <h2 className="outputs-title">Generated Content</h2>
            <div className="outputs-grid">
              <OutputCard
                title="Twitter Thread"
                icon="𝕏"
                content={outputs.twitter}
                type="twitter"
                copied={copied.twitter}
                onCopy={() => handleCopy('twitter', outputs.twitter)}
                delay={0}
              />
              <OutputCard
                title="LinkedIn Post"
                icon="in"
                content={outputs.linkedin}
                type="linkedin"
                copied={copied.linkedin}
                onCopy={() => handleCopy('linkedin', outputs.linkedin)}
                delay={100}
              />
              <OutputCard
                title="Instagram Caption"
                icon="📷"
                content={outputs.instagram}
                type="instagram"
                copied={copied.instagram}
                onCopy={() => handleCopy('instagram', outputs.instagram)}
                delay={200}
              />
              <OutputCard
                title="Facebook Post"
                icon="📘"
                content={outputs.facebook}
                type="facebook"
                copied={copied.facebook}
                onCopy={() => handleCopy('facebook', outputs.facebook)}
                delay={300}
              />
              <OutputCard
                title="Email Newsletter Intro"
                icon="✉️"
                content={outputs.email}
                type="email"
                copied={copied.email}
                onCopy={() => handleCopy('email', outputs.email)}
                delay={400}
              />
            </div>
          </div>
          </>
        ) : null}
      </main>

      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚡ Upgrade Required</h2>
            </div>
            <div className="modal-body">
              <p>You've used all 5 of your free monthly repurposes.</p>
              <p>Upgrade to Pro for unlimited repurposes and more features!</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUpgradeModal(false)} className="modal-button secondary">
                Maybe Later
              </button>
              <Link to="/pricing" className="modal-button primary">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OutputCard({ title, icon, content, type, copied, onCopy, delay }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`output-card ${type} ${visible ? 'visible' : ''}`}>
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <button
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={onCopy}
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <div className="card-content">
        <pre>{content || 'No content generated yet'}</pre>
      </div>
    </div>
  );
}

function SkeletonCard({ title, icon, type }) {
  return (
    <div className={`output-card skeleton ${type}`}>
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="skeleton-button"></div>
      </div>
      <div className="card-content skeleton-content">
        <span className="skeleton-lightning">⚡</span>
      </div>
    </div>
  );
}

export default Dashboard;
