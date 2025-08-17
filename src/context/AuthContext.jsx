import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          // Set user with token (profile will be fetched by components that need it)
          setUser({ token });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData) => {
    console.log('🔐 AuthContext login called with:', userData);
    
    // Store both token and user data
    const userInfo = {
      token: userData.token,
      user: userData.user || userData
    };
    
    console.log('👤 Setting user info:', userInfo);
    setUser(userInfo);
    
    // Store token in localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      console.log('💾 Token stored in localStorage');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser(prev => ({ 
      ...prev, 
      user: { ...prev?.user, ...userData } 
    }));
  };

  // Update user profile from API response
  const updateUserProfile = (profileData) => {
    setUser(prev => ({ 
      ...prev, 
      user: profileData 
    }));
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    updateUser,
    updateUserProfile,
    loading,
    isAuthenticated: !!user?.token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 