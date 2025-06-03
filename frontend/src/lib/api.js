
const API_BASE = 'http://localhost:3030/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const client = new APIClient();

export const auth = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
};

export const gyms = {
  list: () => client.get('/gyms'),
  create: (gymData) => client.post('/gyms', gymData),
  get: (id) => client.get(`/gyms/${id}`),
};

export const members = {
  list: (gymId) => client.get(`/members${gymId ? `?gymId=${gymId}` : ''}`),
  create: (memberData) => client.post('/members', memberData),
  markAttendance: (attendanceData) => client.post('/members/attendance', attendanceData),
  getByGym: (gymId) => client.get(`/members/gym/${gymId}`),
};
