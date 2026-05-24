import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Landing() {
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
          <span className="nav-logo-icon">⚡</span>
          <span className="nav-logo-text">Volta</span>
        </div>
        <div className="nav-links">
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/auth" className="nav-link">Sign In</Link>
        </div>
      </nav>

      <header className="header">
        <div className="hero-logo">
          <span className="hero-logo-icon">⚡</span>
        </div>
        <h1>Volta</h1>
        <p className="tagline">AI-Powered Content Repurposing</p>
        <p className="subtitle">Turn one post into many. Instantly.</p>
        <div className="platform-preview">
          <div className="platform-item">
            <svg className="platform-icon twitter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="platform-name">Twitter</span>
          </div>
          <div className="platform-item">
            <svg className="platform-icon linkedin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span className="platform-name">LinkedIn</span>
          </div>
          <div className="platform-item">
            <svg className="platform-icon instagram-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="platform-name">Instagram</span>
          </div>
          <div className="platform-item">
            <svg className="platform-icon email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="platform-name">Email</span>
          </div>
        </div>
        <div className="cta-section">
          <Link to="/auth" className="repurpose-button">Get Started Free</Link>
        </div>
      </header>

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
