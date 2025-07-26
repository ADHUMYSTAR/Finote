import React, { useState } from 'react';
import { TrendingUp, Shield, BarChart, Target, Menu, X, Star, Quote, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: BarChart,
      title: 'Smart Budgeting',
      description: 'Set budgets and track your spending across different categories'
    },
    {
      icon: TrendingUp,
      title: 'Financial Insights',
      description: 'Get detailed insights into your spending patterns and trends'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and kept completely secure'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and achieve your financial goals with our tracking tools'
    }
  ];

  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'Finote has completely transformed how I manage my business finances. The insights are incredible!',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Designer',
      content: 'Finally, a budgeting app that actually makes sense. The interface is clean and the features are powerful.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Manager',
      content: 'I\'ve tried many finance apps, but this one stands out. The goal tracking feature keeps me motivated.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <div className="homepage">
      <nav className="navBar">
        <div className="nav-box">
          <a href="/" className="nav-logo">
            <TrendingUp size={32} />
            <span>Finote</span>
          </a>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            
            <div className="nav-auth">
              <a href="/login" className="nav-link-auth login" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </a>
              <a href="/register" className="nav-link-auth register" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </a>
            </div>
          </div>
          
          <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      <div className="hero">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Track your money with confidence</h1>
          <p className="hero-subtitle">
            Take control of your finances with Finote. 
            Track expenses, manage budgets, and achieve your financial goals.
          </p>
          <div className="hero-actions">
            <a href="/register" className="btn btn-primary">
              Start Tracking Now
            </a>
            <a href="/login" className="btn btn-secondary">
              Sign In
            </a>
          </div>
        </div>
      </div>

      <div className="features">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="features-title">
            Everything you need to manage your finances
          </h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews">
        <div className="reviews-container">
          <h2 className="reviews-title">What our users say</h2>
          <p className="reviews-subtitle">
            Join thousands of satisfied users who have transformed their financial lives
          </p>
          
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.avatar}
                  </div>
                  <div className="review-info">
                    <h4 className="review-name">{review.name}</h4>
                    <p className="review-role">{review.role}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <div className="review-content">
                  <Quote size={24} className="quote-icon" />
                  <p>{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <TrendingUp size={32} />
                <span>Finote</span>
              </div>
              <p className="footer-description">
                Take control of your finances with our comprehensive tracking and budgeting tools.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="/features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/security">Security</a></li>
                <li><a href="/integrations">Integrations</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/press">Press</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/community">Community</a></li>
                <li><a href="/status">Status</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>support@finote.com</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+91 123-456-7890</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Chennai</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 Finote. All rights reserved.</p>
              <div className="footer-legal">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/cookies">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

