import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Landing() {
  return (
    <div className="app">
      <div className="noise-overlay"></div>
      <div className="grid-mesh"></div>
      <div className="stars"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <nav className="navbar">
        <div className="nav-logo">
          <span className="nav-logo-icon">⚡</span>
          <span className="nav-logo-text">Volta</span>
        </div>
        <div className="nav-links">
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/auth" className="nav-link">Sign In</Link>
        </div>
      </nav>

      <header className="header">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="gradient-text">Turn one post</span>
            <br />
            <span className="gradient-text">into many.</span>
          </h1>
          <p className="hero-subtitle">AI-powered content repurposing for modern creators</p>
          <div className="hero-cta">
            <Link to="/auth" className="hero-button">Start Creating Free</Link>
          </div>
        </div>
        <div className="hero-mockup">
          <div className="mockup-card">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="mockup-content">
              <div className="mockup-input">Paste your content here...</div>
              <div className="mockup-outputs">
                <div className="mockup-output twitter">🐦 Twitter</div>
                <div className="mockup-output linkedin">💼 LinkedIn</div>
                <div className="mockup-output instagram">📸 Instagram</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="trust-badges">
        <div className="trust-badge">
          <span className="trust-icon">⚡</span>
          <span className="trust-text">Instant Results</span>
        </div>
        <div className="trust-badge">
          <span className="trust-icon">🔒</span>
          <span className="trust-text">Secure & Private</span>
        </div>
        <div className="trust-badge">
          <span className="trust-icon">✨</span>
          <span className="trust-text">AI-Powered</span>
        </div>
      </div>

      <div className="frosted-divider"></div>

      <main className="main">
        <div className="features-section">
          <h2 className="outputs-title">Why Volta?</h2>
          <div className="features-grid">
            <div className="output-card feature-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">⚡</span>
                  <h3>Instant Repurposing</h3>
                </div>
              </div>
              <div className="card-content">
                <p>Paste any content and get platform-optimized posts in seconds.</p>
              </div>
            </div>
            <div className="output-card feature-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">📅</span>
                  <h3>Smart Scheduling</h3>
                </div>
              </div>
              <div className="card-content">
                <p>Schedule your content across all platforms from one dashboard.</p>
              </div>
            </div>
            <div className="output-card feature-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">�</span>
                  <h3>Analytics & Insights</h3>
                </div>
              </div>
              <div className="card-content">
                <p>Track what content performs best and optimize your strategy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonials-section">
          <h2 className="outputs-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="output-card testimonial-card">
              <div className="card-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"Volta has completely transformed my content workflow. What used to take hours now takes minutes. The AI-generated posts are actually good!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">SM</div>
                  <div className="author-info">
                    <div className="author-name">Sarah Mitchell</div>
                    <div className="author-title">Marketing Director</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="output-card testimonial-card">
              <div className="card-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"The platform-specific optimization is incredible. My LinkedIn engagement has tripled since I started using Volta. Highly recommend!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">JC</div>
                  <div className="author-info">
                    <div className="author-name">James Chen</div>
                    <div className="author-title">Startup Founder</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="output-card testimonial-card">
              <div className="card-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"As a content creator, I need to be everywhere at once. Volta makes it possible without burning out. This is a game-changer."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">EP</div>
                  <div className="author-info">
                    <div className="author-name">Emily Parker</div>
                    <div className="author-title">Content Creator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="nav-logo-icon">⚡</span>
            <span className="nav-logo-text">Volta</span>
          </div>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
          <div className="footer-copyright">
            Copyright 2026 Volta. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
