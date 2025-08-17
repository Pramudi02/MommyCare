import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Baby, Stethoscope, Heart, Store } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userRoles = [
    { value: 'mom', label: 'Mom', description: 'Pregnant women and new mothers', icon: <Baby size={24} /> },
    { value: 'doctor', label: 'Doctor', description: 'Healthcare professionals', icon: <Stethoscope size={24} /> },
    { value: 'midwife', label: 'Midwife', description: 'Pregnancy and birth specialists', icon: <Heart size={24} /> },
    { value: 'service_provider', label: 'Service Provider', description: 'Product and service providers', icon: <Store size={24} /> }
  ];

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // username and phone removed per requirements

    if (!formData.role) {
      newErrors.role = 'Please select a user role';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Debug: Log the data being sent
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        password: formData.password
      };
      console.log('Sending registration data:', requestData);
      
      // Use the real registration endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Registration response:', { status: response.status, data });

      if (response.ok) {
        // Use AuthContext login function
        login(data.data);
        
        // Navigate directly to role-specific dashboard (no admin approval needed)
        switch (formData.role) {
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
        console.error('Registration failed:', { status: response.status, data });
        console.error('Validation errors:', data.errors);
        setErrors({ general: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Backend registration error:', error);
      
      // Fallback: Local mock registration when backend is not available
      try {
        console.log('Using local mock registration...');
        
        // Create mock user data
        const mockUser = {
          _id: 'local-mock-user-' + Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          isEmailVerified: true,
          isActive: true
        };
        
        const mockToken = 'local-mock-token-' + Date.now();
        
        // Use AuthContext for mock data
        login({
          token: mockToken,
          user: mockUser
        });
        
        // Navigate directly to role-specific dashboard (no admin approval needed)
        switch (formData.role) {
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
      } catch (localError) {
        console.error('Local mock registration error:', localError);
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="logo-section">
            <img src="/mommy-logo-white.png" alt="MommyCare Logo" className="logo-login" />
            <h1>Join MommyCare</h1>
          </div>
          <div className="role-select-panel">
            <div className="role-select-title">Select Your Role to get started</div>
            <div className="role-options">
              {userRoles.map((role) => (
                <label key={role.value} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleInputChange}
                  />
                  <div className="role-content">
                    <div className="role-icon">{role.icon}</div>
                    <div className="role-details">
                      <div className="role-title">{role.label}</div>
                      <div className="role-description">{role.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <span className="field-error">{errors.role}</span>
            )}
          </div>
        </div>

        <div className="signup-form-container">
          <div className="form-header">
            <h2>Sign Up</h2>
          </div>
          <form onSubmit={handleSubmit} className="signup-form">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}
            {!formData.role && (
              <div className="select-role-hint">Please select your role to continue</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                    disabled={!formData.role}
                  />
                </div>
                {errors.firstName && (
                  <span className="field-error">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                    disabled={!formData.role}
                  />
                </div>
                {errors.lastName && (
                  <span className="field-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  disabled={!formData.role}
                />
              </div>
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  disabled={!formData.role}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!formData.role}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={!formData.role}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={!formData.role}
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || !formData.role}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
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

export default Signup;
