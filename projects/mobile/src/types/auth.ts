export type Department = 'SOPORTE' | 'TI_DESARROLLO' | 'VENTAS' | 'MARKETING';

export type UserRole = 'ADMIN' | 'DEV' | 'SUPPORT_AGENT' | 'SALES' | 'MARKETING';

export interface User {
  id: string;
  nombre: string;
  email: string;
  departamento: Department;
  rol: UserRole;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  departamento: Department;
}

export interface AuthResponse {
  user: User;
  token: string;
}
