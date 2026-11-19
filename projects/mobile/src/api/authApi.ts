import { apiClient } from './client';
import {
  ApiResponse,
  AuthResponse,
  CatalogDepartmentDto,
  LoginCredentials,
  RegisterData,
  User,
} from '../types/auth';

export const DEMO_USERS: Record<string, User> = {
  dev: {
    id: 1,
    email: 'aldair.cahuana@tunegocio.pe',
    nombre: 'Aldair',
    apellido: 'Cahuana',
    telefono: '+51 987 654 321',
    departamentoId: 2,
    departamentoCodigo: 'TI_DESARROLLO',
    departamentoNombre: 'TI & Desarrollo',
    departamento: 'TI_DESARROLLO',
    rolId: 3,
    rolCodigo: 'DEV_INGENIERO',
    rolNombre: 'Ingeniero de Software / TI',
    rol: 'DEV_INGENIERO',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['TICKET_UPDATE', 'TICKET_ESCALATE', 'SUGGESTION_PRIORITIZE'],
  },
  soporte: {
    id: 2,
    email: 'henry.monroy@tunegocio.pe',
    nombre: 'Henry',
    apellido: 'Monroy',
    telefono: '+51 981 234 567',
    departamentoId: 1,
    departamentoCodigo: 'SOPORTE',
    departamentoNombre: 'Soporte Técnico',
    departamento: 'SOPORTE',
    rolId: 2,
    rolCodigo: 'AGENTE_SOPORTE',
    rolNombre: 'Agente de Soporte',
    rol: 'AGENTE_SOPORTE',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['TICKET_CREATE', 'TICKET_UPDATE', 'TICKET_ESCALATE', 'COMMUNICATION_PUBLISH'],
  },
  ventas: {
    id: 3,
    email: 'josue.morales@tunegocio.pe',
    nombre: 'Josue',
    apellido: 'Morales',
    telefono: '+51 976 543 210',
    departamentoId: 3,
    departamentoCodigo: 'VENTAS',
    departamentoNombre: 'Ventas Corporativas',
    departamento: 'VENTAS',
    rolId: 4,
    rolCodigo: 'EJECUTIVO_VENTAS',
    rolNombre: 'Ejecutivo de Ventas',
    rol: 'EJECUTIVO_VENTAS',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['SUGGESTION_CREATE', 'SUGGESTION_VOTE'],
  },
  marketing: {
    id: 4,
    email: 'eduardo.sanchez@tunegocio.pe',
    nombre: 'Eduardo',
    apellido: 'Sánchez',
    telefono: '+51 998 765 432',
    departamentoId: 4,
    departamentoCodigo: 'MARKETING',
    departamentoNombre: 'Marketing & Producto',
    departamento: 'MARKETING',
    rolId: 5,
    rolCodigo: 'MARKETING_LEAD',
    rolNombre: 'Líder de Producto & Marketing',
    rol: 'MARKETING_LEAD',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['CHANGELOG_PUBLISH', 'COMMUNICATION_PUBLISH', 'SUGGESTION_VOTE'],
  },
  admin: {
    id: 5,
    email: 'admin@tunegocio.pe',
    nombre: 'Administrador',
    apellido: 'General',
    telefono: '+51 900 000 000',
    departamentoId: 5,
    departamentoCodigo: 'OPS',
    departamentoNombre: 'Operaciones & SRE',
    departamento: 'OPS',
    rolId: 1,
    rolCodigo: 'ADMIN',
    rolNombre: 'Administrador General',
    rol: 'ADMIN',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['TICKET_CREATE', 'TICKET_UPDATE', 'TICKET_ESCALATE', 'USER_MANAGE', 'ADMIN_ACCESS'],
  },
};

const DEFAULT_DEPARTMENTS: CatalogDepartmentDto[] = [
  { id: 1, codigo: 'SOP', nombre: 'Soporte Técnico', descripcion: 'Atención directa y diagnóstico de incidencias' },
  { id: 2, codigo: 'TI', nombre: 'TI & Desarrollo', descripcion: 'Ingeniería de software, corrección de bugs e infraestructura' },
  { id: 3, codigo: 'VENTAS', nombre: 'Ventas Corporativas', descripcion: 'Gestión de clientes comerciales y cuentas SaaS' },
  { id: 4, codigo: 'MKT', nombre: 'Marketing & Producto', descripcion: 'Roadmap, priorización comercial y changelog' },
  { id: 5, codigo: 'OPS', nombre: 'Operaciones & SRE', descripcion: 'Disponibilidad de plataforma y monitoreo' },
];

function normalizeBackendUser(rawUser: any): User {
  return {
    id: rawUser.id,
    email: rawUser.email,
    nombre: rawUser.nombre,
    apellido: rawUser.apellido || '',
    telefono: rawUser.telefono || '',
    departamentoId: rawUser.departamentoId,
    departamentoCodigo: rawUser.departamentoCodigo || '',
    departamentoNombre: rawUser.departamentoNombre || '',
    departamento: rawUser.departamentoCodigo || rawUser.departamentoNombre || 'SOPORTE',
    rolId: rawUser.rolId,
    rolCodigo: rawUser.rolCodigo || '',
    rolNombre: rawUser.rolNombre || '',
    rol: rawUser.rolCodigo || rawUser.rolNombre || 'AGENTE_SOPORTE',
    cognitoSub: rawUser.cognitoSub,
    isActive: rawUser.isActive ?? true,
    ultimoLogin: rawUser.ultimoLogin,
    permisos: rawUser.permisos || [],
    createdAt: rawUser.createdAt || new Date().toISOString(),
  };
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const payload = response.data?.data || response.data;
      if (payload && payload.token && payload.user) {
        return {
          token: payload.token,
          user: normalizeBackendUser(payload.user),
        };
      }
      throw new Error('Formato de respuesta de login inválido');
    } catch (error: any) {
      // Fallback resiliente si el backend está degradado o sin red
      if (!error.response || error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
        console.log('[Auth] Modo Resiliente / Offline activado para login');
        return mockLogin(credentials);
      }
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Separar nombre y apellido si vienen juntos
      const parts = data.nombre.trim().split(' ');
      const nombre = parts[0] || data.nombre;
      const apellido = parts.slice(1).join(' ') || data.apellido || 'Colaborador';

      const requestPayload = {
        email: data.email.trim(),
        password: data.password,
        nombre,
        apellido,
        telefono: data.telefono || '+51 900 000 000',
        departamentoId: data.departamentoId || 1,
      };

      const response = await apiClient.post<ApiResponse<any>>('/auth/register', requestPayload);
      const payload = response.data?.data || response.data;

      if (payload && payload.token && payload.user) {
        return {
          token: payload.token,
          user: normalizeBackendUser(payload.user),
        };
      }
      throw new Error('Formato de respuesta de registro inválido');
    } catch (error: any) {
      if (!error.response || error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
        console.log('[Auth] Modo Resiliente / Offline activado para registro');
        return mockRegister(data);
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/auth/me');
      const payload = response.data?.data || response.data;
      return normalizeBackendUser(payload);
    } catch (error: any) {
      throw error;
    }
  },

  async getDepartmentsCatalog(): Promise<CatalogDepartmentDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<CatalogDepartmentDto[]>>('/catalogs/departamentos');
      const payload = response.data?.data || response.data;
      if (Array.isArray(payload) && payload.length > 0) {
        return payload;
      }
      return DEFAULT_DEPARTMENTS;
    } catch {
      return DEFAULT_DEPARTMENTS;
    }
  },
};

function mockLogin(credentials: LoginCredentials): AuthResponse {
  const normEmail = credentials.email.trim().toLowerCase();
  for (const key of Object.keys(DEMO_USERS)) {
    if (DEMO_USERS[key].email.toLowerCase() === normEmail) {
      return {
        user: DEMO_USERS[key],
        token: `jwt_aws_cognito_${key}_${Date.now()}`,
      };
    }
  }

  // Si no coincide con un usuario demo conocido, creamos un usuario de TI
  const genericUser: User = {
    id: 101,
    nombre: credentials.email.split('@')[0],
    apellido: 'OpsHub',
    email: credentials.email,
    departamentoId: 2,
    departamentoCodigo: 'TI_DESARROLLO',
    departamentoNombre: 'TI & Desarrollo',
    departamento: 'TI_DESARROLLO',
    rolId: 3,
    rolCodigo: 'DEV_INGENIERO',
    rolNombre: 'Ingeniero de Software / TI',
    rol: 'DEV_INGENIERO',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['TICKET_UPDATE', 'TICKET_ESCALATE'],
  };

  return {
    user: genericUser,
    token: `jwt_aws_cognito_mock_${Date.now()}`,
  };
}

function mockRegister(data: RegisterData): AuthResponse {
  const parts = data.nombre.trim().split(' ');
  const newUser: User = {
    id: Math.floor(Math.random() * 900) + 100,
    nombre: parts[0] || data.nombre,
    apellido: parts.slice(1).join(' ') || 'Colaborador',
    email: data.email,
    departamentoId: data.departamentoId || 1,
    departamentoCodigo: data.departamento || 'SOPORTE',
    departamentoNombre: 'Operaciones',
    departamento: data.departamento || 'SOPORTE',
    rolId: 2,
    rolCodigo: 'AGENTE_SOPORTE',
    rolNombre: 'Agente de Soporte',
    rol: 'AGENTE_SOPORTE',
    isActive: true,
    ultimoLogin: new Date().toISOString(),
    permisos: ['TICKET_CREATE', 'TICKET_UPDATE'],
  };

  return {
    user: newUser,
    token: `jwt_aws_cognito_reg_${Date.now()}`,
  };
}
