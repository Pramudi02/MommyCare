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

// User Profile API functions
export const userProfileAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update user password
  updatePassword: async (passwordData) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Get user profile (alias for backward compatibility)
export const getUserProfile = async () => {
  try {
    const response = await userProfileAPI.getProfile();
    // Handle different response structures
    if (response.user) {
      return response.user;
    } else if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error) {
    console.error('Failed to get user profile:', error);
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

// Doctor Visit Request API functions
export const doctorVisitRequestAPI = {
  // Create a new doctor visit request
  create: async (requestData) => {
    return apiRequest('/mom/doctor-visit-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Get all doctor visit requests for the current mom
  getAll: async () => {
    return apiRequest('/mom/doctor-visit-requests');
  },

  // Get a specific doctor visit request by ID
  getById: async (id) => {
    return apiRequest(`/mom/doctor-visit-requests/${id}`);
  },

  // Update a doctor visit request
  update: async (id, updateData) => {
    return apiRequest(`/mom/doctor-visit-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Cancel a doctor visit request
  cancel: async (id) => {
    return apiRequest(`/mom/doctor-visit-requests/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// Generic fetch function for backward compatibility
export const fetchData = () => Promise.resolve('data'); 

// Midwife Appointment API functions
export const midwifeAppointmentAPI = {
  // Get appointments based on view mode (today, week, month, etc.)
  getAppointments: async (viewMode = 'today') => {
    return apiRequest(`/midwife/appointments?view=${viewMode}`);
  },

  // Get all clinic visit requests
  getClinicVisitRequests: async () => {
    return apiRequest('/midwife/clinic-visit-requests');
  },

  // Accept a clinic visit request
  acceptClinicVisitRequest: async (requestId, appointmentData) => {
    return apiRequest(`/midwife/clinic-visit-requests/${requestId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify(appointmentData),
    });
  },

  // Reject a clinic visit request
  rejectClinicVisitRequest: async (requestId, reason) => {
    return apiRequest(`/midwife/clinic-visit-requests/${requestId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // Get appointment details by ID
  getAppointmentById: async (appointmentId) => {
    return apiRequest(`/midwife/appointments/${appointmentId}`);
  },

  // Update appointment
  updateAppointment: async (appointmentId, updateData) => {
    return apiRequest(`/midwife/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, reason) => {
    return apiRequest(`/midwife/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
}; 

// Vaccination API functions
export const vaccinationAPI = {
  // Get all vaccination records for a baby
  getAll: async () => {
    return apiRequest('/mom/vaccinations');
  },

  // Request vaccination appointment
  requestAppointment: async (appointmentData) => {
    return apiRequest('/mom/vaccinations/request-appointment', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Initialize vaccination schedule for a baby
  initializeSchedule: async (babyBirthDate) => {
    return apiRequest('/mom/vaccinations/initialize', {
      method: 'POST',
      body: JSON.stringify({ babyBirthDate }),
    });
  },
};

// Immunization Schedule API functions
export const immunizationScheduleAPI = {
  // Get all immunization schedules for a baby
  getAll: async () => {
    return apiRequest('/immunization-schedule');
  },

  // Get immunization schedules by status
  getByStatus: async (status) => {
    return apiRequest(`/immunization-schedule/status/${status}`);
  },

  // Get immunization timeline
  getTimeline: async () => {
    return apiRequest('/immunization-schedule/timeline');
  },

  // Initialize immunization schedule for a baby
  initialize: async (babyBirthDate) => {
    return apiRequest('/immunization-schedule/initialize', {
      method: 'POST',
      body: JSON.stringify({ babyBirthDate }),
    });
  },

  // Update immunization status
  updateStatus: async (id, updateData) => {
    return apiRequest(`/immunization-schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete immunization schedule
  delete: async (id) => {
    return apiRequest(`/immunization-schedule/${id}`, {
      method: 'DELETE',
    });
  },
};

// Doctor API
export const doctorAPI = {
  getDashboard: async () => apiRequest('/doctor/dashboard'),
  searchPatients: async (q) => apiRequest(`/doctor/patients${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getAppointments: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.start) query.set('start', params.start);
    if (params.end) query.set('end', params.end);
    const qs = query.toString();
    return apiRequest(`/doctor/appointments${qs ? `?${qs}` : ''}`);
  },
  createAppointment: async (payload) => apiRequest('/doctor/appointments', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateAppointment: async (id, updateData) => apiRequest(`/doctor/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  }),
  deleteAppointment: async (id) => apiRequest(`/doctor/appointments/${id}`, {
    method: 'DELETE'
  }),
  getAppointmentRequests: async (status = 'all') => apiRequest(`/doctor/appointment-requests${status !== 'all' ? `?status=${status}` : ''}`),
  respondToRequest: async (id, response) => apiRequest(`/doctor/appointment-requests/${id}/respond`, {
    method: 'PUT',
    body: JSON.stringify(response)
  })
};

// Mom Profile API functions
export const momProfileAPI = {
  // Get mom profile
  getProfile: async () => {
    return apiRequest('/mom/profile');
  },

  // Create or update mom profile
  saveProfile: async (profileData) => {
    return apiRequest('/mom/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Update mom profile
  updateProfile: async (profileData) => {
    return apiRequest('/mom/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};