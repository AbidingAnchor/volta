import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../App.css';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('content_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data || []);
      }
    }
    setLoading(false);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReuse = (item) => {
    // Store in localStorage for Dashboard to pick up
    localStorage.setItem('volta_reuse_content', JSON.stringify({
      inputText: item.input_text,
      outputs: {
        twitter: item.twitter,
        linkedin: item.linkedin,
        instagram: item.instagram,
        facebook: item.facebook,
        email: item.email
      },
      tone: item.tone
    }));
    window.location.href = '/dashboard';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📸',
      facebook: '📘',
      email: '✉️'
    };
    return icons[platform] || '📝';
  };

  return (
    <div className="app">
      <div className="noise-overlay"></div>
      <div className="grid-mesh"></div>
      <div className="stars"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      
      <nav className="nav">
        <div className="nav-logo">
          <Link to="/dashboard">
            <span className="nav-logo-icon">⚡</span>
            <span className="nav-logo-text">Volta</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/calendar" className="nav-link">Calendar</Link>
          <Link to="/history" className="nav-link active">History</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
        </div>
      </nav>

      <main className="main">
        <div className="history-page">
          <header className="history-header">
            <h1 className="history-title">Content History</h1>
            <p className="history-subtitle">Your past repurposes, saved for easy access</p>
          </header>

          {loading ? (
            <div className="history-loading">
              <div className="spinner"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <span className="empty-icon">📝</span>
              <h3>No content history yet</h3>
              <p>Start repurposing content to build your history</p>
              <Link to="/dashboard" className="repurpose-button">Go to Dashboard</Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-item-header">
                    <div className="history-item-meta">
                      <span className="history-date">{formatDate(item.created_at)}</span>
                      <span className="history-tone">{item.tone}</span>
                    </div>
                    <div className="history-item-actions">
                      <button 
                        onClick={() => handleReuse(item)}
                        className="history-reuse-btn"
                      >
                        ♻️ Reuse
                      </button>
                      <button 
                        onClick={() => toggleExpand(item.id)}
                        className="history-expand-btn"
                      >
                        {expandedItems[item.id] ? '−' : '+'}
                      </button>
                    </div>
                  </div>
                  <div className="history-item-input">
                    <span className="input-label">Input:</span>
                    <span className="input-text">
                      {item.input_text.substring(0, 100)}{item.input_text.length > 100 ? '...' : ''}
                    </span>
                  </div>
                  {expandedItems[item.id] && (
                    <div className="history-item-outputs">
                      {item.twitter && (
                        <div className="history-output-card">
                          <div className="output-card-header">
                            <span className="output-icon">{getPlatformIcon('twitter')}</span>
                            <span className="output-platform">Twitter</span>
                          </div>
                          <div className="output-content">{item.twitter}</div>
                        </div>
                      )}
                      {item.linkedin && (
                        <div className="history-output-card">
                          <div className="output-card-header">
                            <span className="output-icon">{getPlatformIcon('linkedin')}</span>
                            <span className="output-platform">LinkedIn</span>
                          </div>
                          <div className="output-content">{item.linkedin}</div>
                        </div>
                      )}
                      {item.instagram && (
                        <div className="history-output-card">
                          <div className="output-card-header">
                            <span className="output-icon">{getPlatformIcon('instagram')}</span>
                            <span className="output-platform">Instagram</span>
                          </div>
                          <div className="output-content">{item.instagram}</div>
                        </div>
                      )}
                      {item.facebook && (
                        <div className="history-output-card">
                          <div className="output-card-header">
                            <span className="output-icon">{getPlatformIcon('facebook')}</span>
                            <span className="output-platform">Facebook</span>
                          </div>
                          <div className="output-content">{item.facebook}</div>
                        </div>
                      )}
                      {item.email && (
                        <div className="history-output-card">
                          <div className="output-card-header">
                            <span className="output-icon">{getPlatformIcon('email')}</span>
                            <span className="output-platform">Email</span>
                          </div>
                          <div className="output-content">{item.email}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default History;
