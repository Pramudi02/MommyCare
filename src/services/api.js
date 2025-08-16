// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Clinic Visit Request API functions
export const clinicVisitRequestAPI = {
  // Create a new clinic visit request
  create: async (requestData) => {
    return apiRequest('/mom/clinic-visit-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Get all clinic visit requests for the current mom
  getAll: async () => {
    return apiRequest('/mom/clinic-visit-requests');
  },

  // Get a specific clinic visit request by ID
  getById: async (id) => {
    return apiRequest(`/mom/clinic-visit-requests/${id}`);
  },

  // Update a clinic visit request
  update: async (id, updateData) => {
    return apiRequest(`/mom/clinic-visit-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Cancel a clinic visit request
  cancel: async (id) => {
    return apiRequest(`/mom/clinic-visit-requests/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// Generic fetch function for backward compatibility
export const fetchData = () => Promise.resolve('data'); 