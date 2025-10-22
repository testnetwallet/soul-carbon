import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    hederaAccountId?: string;
  }) => api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/profile'),
};

// Emissions API
export const emissionsAPI = {
  log: (data: {
    emissionType: 'travel' | 'energy' | 'food' | 'other';
    category: string;
    amount: number;
    unit: string;
    co2eKg: number;
    date: Date;
    description?: string;
  }) => api.post('/emissions/log', data),
  
  getHistory: (params?: { 
    page?: number; 
    limit?: number; 
    emissionType?: string 
  }) => api.get('/emissions/history', { params }),
  
  getCategories: () => api.get('/emissions/categories'),
};

// Offsets API
export const offsetsAPI = {
  getMarketplace: (params?: { 
    page?: number; 
    limit?: number; 
    projectType?: string 
  }) => api.get('/offsets/marketplace', { params }),
  
  purchase: (data: {
    userHederaAddress: string;
    projectId: string;
    quantity: number;
    totalCo2eKg: number;
    totalHbarCost: number;
  }) => api.post('/offsets/purchase', data),
  
  getBalance: () => api.get('/offsets/balance'),
};

export interface User {
  _id: string;
  email: string;
  hederaAccountId: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Emission {
  _id: string;
  userId: string;
  emissionType: 'travel' | 'energy' | 'food' | 'other';
  category: string;
  amount: number;
  unit: string;
  co2eKg: number;
  date: string;
  description?: string;
  hederaTransactionId?: string;
  consensusTimestamp?: string;
  topicId?: string;
}

export interface OffsetProject {
  projectId: string;
  name: string;
  description: string;
  location: string;
  projectType: 'reforestation' | 'renewable_energy' | 'methane_capture' | 'direct_air_capture' | 'other';
  costPerKg: number;
  availableCredits: number;
  verificationStandard: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR';
}
