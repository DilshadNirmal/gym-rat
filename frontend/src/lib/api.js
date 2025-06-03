
const API_BASE = 'http://localhost:3030/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API call failed');
  }
  
  return data;
}

export const auth = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => {
    localStorage.removeItem('auth_token');
  }
};

export const gyms = {
  list: () => apiCall('/gyms'),
  create: (gymData) => apiCall('/gyms', {
    method: 'POST',
    body: JSON.stringify(gymData),
  }),
  get: (id) => apiCall(`/gyms/${id}`),
};

export const members = {
  list: (gymId) => apiCall(`/members?gymId=${gymId}`),
  create: (memberData) => apiCall('/members', {
    method: 'POST',
    body: JSON.stringify(memberData),
  }),
  markAttendance: (memberId) => apiCall(`/members/${memberId}/attendance`, {
    method: 'POST',
  }),
};
