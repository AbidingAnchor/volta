import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../App.css';

function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          plan,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error starting checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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

      <header className="header pricing-header">
        <h1 className="pricing-title">Simple Pricing</h1>
        <p className="pricing-subtitle">Choose the plan that fits your needs</p>
      </header>

      <main className="main">
        <div className="pricing-section">
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Free</h3>
                <div className="pricing-price">$0<span className="pricing-period">/mo</span></div>
              </div>
              <ul className="pricing-features">
                <li>5 repurposes/month</li>
                <li>5 scheduled posts</li>
                <li>1 brand voice</li>
                <li>Basic analytics</li>
              </ul>
              <Link to="/auth" className="pricing-button">Get Started</Link>
            </div>

            <div className="pricing-card pricing-card-pro">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Pro</h3>
                <div className="pricing-price">$29<span className="pricing-period">/mo</span></div>
              </div>
              <ul className="pricing-features">
                <li>100 repurposes/month</li>
                <li>Unlimited scheduling</li>
                <li>5 brand voices</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
              <button 
                onClick={() => handleSubscribe('pro')}
                disabled={loading}
                className="pricing-button pricing-button-pro"
              >
                {loading ? 'Processing...' : 'Start Pro Trial'}
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Business</h3>
                <div className="pricing-price">$79<span className="pricing-period">/mo</span></div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited repurposes</li>
                <li>Unlimited scheduling</li>
                <li>Unlimited brand voices</li>
                <li>Team accounts (up to 5)</li>
                <li>API access</li>
                <li>DM automation</li>
                <li>Dedicated support</li>
              </ul>
              <button 
                onClick={() => handleSubscribe('business')}
                disabled={loading}
                className="pricing-button"
              >
                {loading ? 'Processing...' : 'Get Business'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pricing;
