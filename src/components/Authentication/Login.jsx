import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Use the real login endpoint
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`;
      console.log('🔐 Attempting login to:', apiUrl);
      console.log('📧 Login data:', { email: formData.emailOrUsername, password: '***' });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.emailOrUsername,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login function
        login(data.data);
        
        // Navigate based on user role
        switch (data.data.user.role) {
          case 'mom':
            navigate('/mom');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'midwife':
            navigate('/midwife');
            break;
          case 'service_provider':
            navigate('/service-provider');
            break;
          default:
            navigate('/');
        }
      } else if (response.status === 503) {
        // Database temporarily unavailable
        setErrors({ general: 'Service temporarily unavailable. Please try again in a moment.' });
      } else {
        setErrors({ general: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Backend login error:', error);
      
      // Show specific error based on the type of failure
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setErrors({ 
          general: 'Cannot connect to server. Please check your internet connection and try again.' 
        });
      } else if (error.name === 'TypeError' && error.message.includes('Unexpected token')) {
        setErrors({ 
          general: 'Server response error. Please try again later.' 
        });
      } else {
        setErrors({ 
          general: 'Login failed. Please check your credentials and try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-section">
            <img src="/mommy-logo-white.png" alt="MommyCare Logo" className="logo-login" />
            <h1>Welcome Back</h1>
            <p>Sign in to your MommyCare account</p>
          </div>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            <h2>Sign In</h2>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper-login">
                <Mail className="input-icon" />
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder="Enter your email"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  className={errors.emailOrUsername ? 'error' : ''}
                />
              </div>
              {errors.emailOrUsername && (
                <span className="field-error">{errors.emailOrUsername}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper-login ">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="switch-auth">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
