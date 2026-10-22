import { apiClient } from './client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Fallback para pruebas sin backend activo (permite navegar en Expo Go)
      if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
        console.log('Backend no detectado: Usando autenticación simulada (Modo Offline / PoC)');
        return mockLogin(credentials);
      }
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      // Fallback para pruebas sin backend activo
      if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
        console.log('Backend no detectado: Usando registro simulado (Modo Offline / PoC)');
        return mockRegister(data);
      }
      throw error;
    }
  },
};

function mockLogin(credentials: LoginCredentials): AuthResponse {
  const dummyUser: User = {
    id: 'usr-101',
    nombre: 'Alex Vance',
    email: credentials.email || 'alex.vance@telemetry-ops.internal',
    departamento: 'TI_DESARROLLO',
    rol: 'DEV',
    createdAt: new Date().toISOString(),
  };

  return {
    user: dummyUser,
    token: 'jwt_mock_token_telemetry_ops_' + Date.now(),
  };
}

function mockRegister(data: RegisterData): AuthResponse {
  const newUser: User = {
    id: 'usr-' + Math.floor(Math.random() * 1000),
    nombre: data.nombre,
    email: data.email,
    departamento: data.departamento,
    rol: data.departamento === 'TI_DESARROLLO' ? 'DEV' : 'SUPPORT_AGENT',
    createdAt: new Date().toISOString(),
  };

  return {
    user: newUser,
    token: 'jwt_mock_token_telemetry_ops_' + Date.now(),
  };
}
