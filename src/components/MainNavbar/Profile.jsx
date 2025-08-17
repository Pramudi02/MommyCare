import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getUserProfile, userProfileAPI } from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await userProfileAPI.updateProfile(formData);
      setProfile(updatedProfile.user || updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <button 
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Profile Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Avatar and Basic Info */}
            <div className="text-center md:text-left">
              <div className="w-32 h-32 mx-auto md:mx-0 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                {profile.firstName && profile.lastName 
                  ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
                  : 'U'
                }
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 mb-1">{profile.email}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {profile.role === 'mom' ? 'Mother' : 
                 profile.role === 'doctor' ? 'Doctor' : 
                 profile.role === 'midwife' ? 'Midwife' : 
                 profile.role === 'service_provider' ? 'Service Provider' : 
                 profile.role}
              </span>
            </div>

            {/* Edit Form */}
            <div>
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <p className="text-gray-900">{profile.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900">{profile.lastName}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
