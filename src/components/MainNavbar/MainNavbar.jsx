import React, { useState, useEffect } from 'react';
import { Search, Heart, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getUserProfile } from '../../services/api';

const MainNavbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateUserProfile } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile when component mounts or when authentication status changes
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user?.token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      // Update the auth context with the fetched profile
      updateUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If profile fetch fails, try to get basic info from auth context
      if (user?.user) {
        setUserProfile(user.user);
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
    setProfileDropdown(!profileDropdown);
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
    return 'User';
  };

  // Get user role from profile or auth context
  const getUserRole = () => {
    if (userProfile?.role) {
      return getRoleDisplayName(userProfile.role);
    }
    if (user?.user?.role) {
      return getRoleDisplayName(user.user.role);
    }
    return 'Role';
  };

  // Get user email from profile or auth context
  const getUserEmail = () => {
    if (userProfile?.email) {
      return userProfile.email;
    }
    if (user?.user?.email) {
      return user.user.email;
    }
    return 'email@example.com';
  };

  // Get initials for avatar
  const getAvatarInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return getInitials(userProfile.firstName, userProfile.lastName);
    }
    if (user?.user?.firstName && user?.user?.lastName) {
      return getInitials(user.user.firstName, user.user.lastName);
    }
    return 'U';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-pink-50 shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="items-center cursor-pointer" onClick={handleLogoClick}>
            <img src="/mommy.png" alt="MommyCare Logo" className="logo-mammy h-24" />
          </div>
          
          {/* Search Bar removed as requested */}
          
          {/* Auth Section - Show Profile Dropdown if logged in, otherwise show Login/Signup */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              // Profile Dropdown
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      getAvatarInitials()
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {loading ? 'Loading...' : getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {loading ? '' : getUserRole()}
                    </div>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                    {/* Profile Header */}
                    <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-pink-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                          {getAvatarInitials()}
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

                    {/* Menu Items */}
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
                  </div>
                )}
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
      {profileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileDropdown(false)}
        />
      )}
    </nav>
  );
};

export default MainNavbar;