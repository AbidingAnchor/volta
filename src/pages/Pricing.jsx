import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Pricing() {
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
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/auth" className="nav-link">Sign In</Link>
        </div>
      </nav>

      <header className="header">
        <div className="hero-logo">
          <span className="hero-logo-icon">⚡</span>
        </div>
        <h1>Pricing</h1>
        <p className="tagline">Simple, Transparent Pricing</p>
        <p className="subtitle">Choose the plan that fits your needs.</p>
      </header>

      <div className="frosted-divider"></div>

      <main className="main">
        <div className="pricing-section">
          <div className="pricing-grid">
            <div className="output-card pricing-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">🌱</span>
                  <h3>Free</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="price">$0</div>
                <div className="price-period">per month</div>
                <ul className="features-list">
                  <li>5 repurposes per month</li>
                  <li>4 platforms</li>
                  <li>Basic support</li>
                </ul>
                <Link to="/auth" className="repurpose-button">Get Started Free</Link>
              </div>
            </div>

            <div className="output-card pricing-card featured">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">⚡</span>
                  <h3>Pro</h3>
                </div>
                <span className="badge">MOST POPULAR</span>
              </div>
              <div className="card-content">
                <div className="price">$29</div>
                <div className="price-period">per month</div>
                <ul className="features-list">
                  <li>Unlimited repurposes</li>
                  <li>All platforms</li>
                  <li>Content scheduler</li>
                  <li>Priority support</li>
                </ul>
                <Link to="/auth" className="repurpose-button">Start Pro Trial</Link>
              </div>
            </div>

            <div className="output-card pricing-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="card-icon">🚀</span>
                  <h3>Business</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="price">$79</div>
                <div className="price-period">per month</div>
                <ul className="features-list">
                  <li>Everything in Pro</li>
                  <li>DM automation</li>
                  <li>Analytics dashboard</li>
                  <li>Team accounts (up to 5)</li>
                  <li>API access</li>
                </ul>
                <Link to="/auth" className="repurpose-button">Get Business</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pricing;
