export type UserRole =
  | 'ADMIN'
  | 'AGENTE_SOPORTE'
  | 'DEV_INGENIERO'
  | 'EJECUTIVO_VENTAS'
  | 'MARKETING_LEAD'
  | 'DEV'
  | 'SUPPORT_AGENT'
  | 'SALES'
  | 'MARKETING';

export type UserDepartment =
  | 'TI_DESARROLLO'
  | 'SOPORTE'
  | 'VENTAS'
  | 'MARKETING'
  | 'OPS'
  | 'OPERACIONES';

export interface User {
  id: number | string;
  email: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  departamentoId?: number;
  departamentoCodigo?: string;
  departamentoNombre?: string;
  departamento?: string;
  rolId?: number;
  rolCodigo?: string;
  rolNombre?: string;
  rol?: string;
  cognitoSub?: string;
  isActive?: boolean;
  ultimoLogin?: string;
  permisos?: string[];
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface CatalogDepartmentDto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  telefono?: string;
  departamento: string;
  departamentoId?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
