import React, { useState, useEffect } from 'react';
import { Heart, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getUserProfile } from '../../services/api';

const MainNavbar = () => {
  const navigate = useNavigate();
  // Guard against undefined context (e.g., during hot reload or provider init)
  const authCtx = useAuth && typeof useAuth === 'function' ? useAuth() : {};
  const { user, logout, isAuthenticated, updateUserProfile } = authCtx || {};
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile when component mounts or when authentication status changes
  useEffect(() => {
    if (isAuthenticated == null) return; // context not ready
    console.log('🔍 MainNavbar useEffect - Auth status:', { isAuthenticated, hasToken: !!user?.token, user });
    
    if (isAuthenticated && user?.token) {
      // Only fetch profile if we don't already have meaningful user data
      if (!hasUserData()) {
        console.log('📱 Fetching user profile...');
        fetchUserProfile();
      } else {
        console.log('📱 Already have user data, skipping profile fetch');
        setLoading(false);
      }
    } else {
      console.log('📱 Not authenticated or no token, clearing profile');
      setUserProfile(null);
      setLoading(false);
      // Close dropdown if it was open
      setProfileDropdown(false);
    }
  }, [isAuthenticated, user?.token]);

  // Close dropdown if user data becomes invalid
  useEffect(() => {
    if (profileDropdown && !hasUserData()) {
      setProfileDropdown(false);
    }
  }, [userProfile, user, profileDropdown]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      console.log('📱 Fetched user profile:', profile);
      setUserProfile(profile);
      // Update the auth context with the fetched profile
      updateUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If profile fetch fails, try to get basic info from auth context
      if (user?.user) {
        console.log('📱 Using auth context user data:', user.user);
        setUserProfile(user.user);
      } else {
        console.log('📱 No user data available');
        setUserProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/mom');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleProfileClick = () => {
    // Only allow profile dropdown to open if we have meaningful user data
    if (hasUserData()) {
      setProfileDropdown(!profileDropdown);
    } else {
      console.log('📱 Cannot open profile dropdown - no meaningful user data');
    }
  };

  const handleLogout = () => {
    // Use AuthContext logout method
    logout();
    
    // Close dropdown
    setProfileDropdown(false);
    
    // Navigate to login page
    navigate('/login');
  };

  const handleEditProfile = () => {
    setProfileDropdown(false);
    // Navigate to profile edit page based on user role
    if (userProfile?.role === 'mom') {
      navigate('/mom/profile');
    } else if (userProfile?.role === 'doctor') {
      navigate('/doctor/profile');
    } else if (userProfile?.role === 'midwife') {
      navigate('/midwife/profile');
    } else if (userProfile?.role === 'service_provider') {
      navigate('/service-provider/profile');
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'mom': 'Mother',
      'doctor': 'Doctor',
      'midwife': 'Midwife',
      'service_provider': 'Service Provider'
    };
    return roleMap[role] || role;
  };

  // Get display name from user profile or auth context
  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (user?.user?.firstName && user?.user?.lastName) {
      return `${user.user.firstName} ${user.user.lastName}`;
    }
    // Return null if no real name data
    return null;
  };

  // Get user role from profile or auth context
  const getUserRole = () => {
    if (userProfile?.role) {
      return getRoleDisplayName(userProfile.role);
    }
    if (user?.user?.role) {
      return getRoleDisplayName(user.user.role);
    }
    // Return null if no real role data
    return null;
  };

  // Get user email from profile or auth context
  const getUserEmail = () => {
    if (userProfile?.email) {
      return userProfile.email;
    }
    if (user?.user?.email) {
      return user.user.email;
    }
    return null; // Don't show anything if no real data
  };

  // Get initials for avatar
  const getAvatarInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return getInitials(userProfile.firstName, userProfile.lastName);
    }
    if (user?.user?.firstName && user?.user?.lastName) {
      return getInitials(user.user.firstName, user.user.lastName);
    }
    return null; // Don't show anything if no real data
  };

  // Check if we have any user data to display
  const hasUserData = () => {
    // Must have both display name and role, and they must be real values (not null/undefined)
    const displayName = getDisplayName();
    const userRole = getUserRole();
    
    // Check if we have meaningful data (not just empty strings or null)
    return !!(displayName && userRole && 
              displayName.trim() !== '' && 
              userRole.trim() !== '' && 
              displayName !== 'User' && 
              userRole !== 'Unknown');
  };

  // Check if we have avatar data
  const hasAvatarData = () => {
    return !!getAvatarInitials();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-pink-50 shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="items-center cursor-pointer" onClick={handleLogoClick}>
            <img src="/mommy.png" alt="MommyCare Logo" className="logo-mammy h-24" />
          </div>
          

          
          {/* Auth Section - Show Profile Dropdown ONLY when authenticated AND we have real user data; otherwise Login/Signup */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {(isAuthenticated && hasUserData() && !loading) ? (
              // Profile Dropdown
              <div className="relative">
                                <button 
                  onClick={handleProfileClick}
                  disabled={!hasUserData()}
                  className={`flex items-center space-x-3 p-2 rounded-full transition-colors duration-200 ${
                    hasUserData() 
                      ? 'hover:bg-blue-100 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Avatar - Only show when we have meaningful data */}
                  {hasAvatarData() ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {getAvatarInitials()}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      U
                    </div>
                  )}
                  
                  {/* User Info - Only show when we have meaningful data */}
                  {hasUserData() ? (
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUserRole()}
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Dropdown Arrow - Only show when we have meaningful user data */}
                  {hasUserData() && (
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileDropdown && hasUserData() && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 z-[9999] border border-gray-200">
                    {/* Profile Header - Only show when we have real user data */}
                    {getUserEmail() ? (
                      <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-pink-50 rounded-t-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                            {getAvatarInitials() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {getDisplayName()}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {getUserEmail()}
                            </div>
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              {getUserRole()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-pink-50 rounded-t-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                            {getAvatarInitials() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {getDisplayName()}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {getUserRole()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu Items - Only show when we have meaningful user data */}
                    {hasUserData() && (
                      <div className="py-1">
                        <button
                          onClick={handleEditProfile}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span>Edit Profile</span>
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : isAuthenticated && loading ? (
              // Show loading state when authenticated but still loading profile
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="hidden sm:block text-sm text-gray-600">Loading...</div>
              </div>
            ) : (
              // Login/Signup Buttons
              <>
                <button 
                  className="px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:bg-blue-100 rounded-full text-sm sm:text-base"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <button 
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-full hover:from-blue-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                  onClick={handleSignupClick}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdown && hasUserData() && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setProfileDropdown(false)}
        />
      )}
    </nav>
  );
};

export default MainNavbar;