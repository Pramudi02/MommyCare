import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setErrors({ general: data.message || 'Failed to send reset email' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <div className="logo-section">
              <img src="/mommy-logo-white.png" alt="MommyCare Logo" className="logo-login" />
              <h1>Check Your Email</h1>
              <p>We've sent you a password reset link</p>
            </div>
          </div>

          <div className="forgot-password-form-container">
            <div className="success-message">
              <CheckCircle className="success-icon" />
              <h2>Reset Link Sent!</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>
              <p className="email-note">
                If you don't see the email, check your spam folder or try again.
              </p>
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="resend-btn"
                onClick={() => setIsSubmitted(false)}
              >
                Resend Email
              </button>
              <Link to="/login" className="back-to-login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <div className="logo-section">
            <img src="/mommy-logo-white.png" alt="MommyCare Logo" className="logo-login" />
            <h1>Forgot Password?</h1>
            <p>No worries, we'll send you reset instructions</p>
          </div>
        </div>

        <div className="forgot-password-form-container">
          <div className="form-header">
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="forgot-password-form">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="forgot-password-footer">
            
            <p>
              Remember your password?{' '}
              <Link to="/login" className="switch-auth">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
