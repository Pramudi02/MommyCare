import React, { useState } from 'react';
import './Login.css';

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Login data:', formData);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>Login</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>

          <div className="forgot-password">
            <button type="button" className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot your password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;