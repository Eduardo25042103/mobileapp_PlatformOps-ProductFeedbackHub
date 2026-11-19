export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';

export type TicketStatus =
  | 'NUEVO'
  | 'EN_DIAGNOSTICO'
  | 'EN_DESARROLLO'
  | 'EN_QA'
  | 'RESUELTO'
  | 'CERRADO';

export type TicketCategory =
  | 'FIRMA_ELECTRONICA'
  | 'BASE_DE_DATOS'
  | 'AUTENTICACION'
  | 'IMPRESION'
  | 'API'
  | 'OTRO';

export interface TicketAttachment {
  id: string | number;
  nombreArchivo: string;
  url: string;
  tamanoBytes: number;
  mimeType: string;
  createdAt?: string;
}

export interface TicketComment {
  id: string | number;
  ticketId?: string | number;
  autorNombre: string;
  autorDepartamento?: string;
  contenido: string;
  esPrivadoTi?: boolean;
  createdAt: string;
}

export interface TicketEscalation {
  id: string | number;
  escaladoPorNombre: string;
  asignadoANombre: string;
  motivoEscalacion: string;
  diagnosticoInicial?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  numericId?: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  logsError?: string;
  clienteId?: number;
  clienteNombre: string;
  clienteRuc?: string;
  clientePlan: string;
  telefono: string;
  categoria: TicketCategory;
  categoriaNombre?: string;
  prioridad: TicketPriority;
  prioridadNombre?: string;
  estado: TicketStatus;
  estadoNombre?: string;
  version: number;
  reportadoPorId?: number;
  reportadoPor: string;
  asignadoAId?: number;
  asignadoA?: string;
  canalOrigen?: string;
  createdAt: string;
  updatedAt: string;
  fechaCierre?: string;
  adjuntos: TicketAttachment[];
  comentarios: TicketComment[];
  escalaciones?: TicketEscalation[];
}

export interface UpdateTicketInput {
  estado?: TicketStatus;
  prioridad?: TicketPriority;
  telefono?: string;
  version: number;
  nuevoComentario?: string;
}

export interface CreateTicketInput {
  titulo: string;
  descripcion: string;
  telefono: string;
  categoria: TicketCategory;
  categoriaId?: number;
  prioridad: TicketPriority;
  prioridadId?: number;
  clienteId?: number;
  clienteNombre: string;
  clientePlan: string;
  adjuntoUrl?: string;
  adjuntoNombre?: string;
  adjuntoBytes?: number;
  s3Key?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  s3Key?: string;
  expiresInMinutes?: number;
}
