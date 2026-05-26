import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

function Pricing() {
  return (
    <div className="app">
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <Navbar />

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
              <Link to="/auth" className="pricing-button pricing-button-pro">Start Pro Trial</Link>
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
              <Link to="/auth" className="pricing-button">Get Business</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Pricing;
