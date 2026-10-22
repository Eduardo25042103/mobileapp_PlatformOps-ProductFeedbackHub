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
  id: string;
  nombreArchivo: string;
  url: string;
  tamanoBytes: number;
  mimeType: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  autorNombre: string;
  autorDepartamento: string;
  contenido: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  logsError?: string;
  clienteNombre: string;
  clientePlan: string;
  categoria: TicketCategory;
  prioridad: TicketPriority;
  estado: TicketStatus;
  version: number;
  asignadoA?: string;
  reportadoPor: string;
  createdAt: string;
  updatedAt: string;
  adjuntos: TicketAttachment[];
  comentarios: TicketComment[];
}

export interface UpdateTicketInput {
  estado?: TicketStatus;
  prioridad?: TicketPriority;
  version: number;
  nuevoComentario?: string;
}

export interface CreateTicketInput {
  titulo: string;
  descripcion: string;
  categoria: TicketCategory;
  prioridad: TicketPriority;
  clienteNombre: string;
  clientePlan: string;
  adjuntoUrl?: string;
  adjuntoNombre?: string;
  adjuntoBytes?: number;
}

