import { Ticket, UpdateTicketInput, CreateTicketInput } from '../types/ticket';
import { apiClient } from './client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Base de datos reactiva simulada para demostración local / PoC
let mockTickets: Ticket[] = [
  {
    id: 't-1082',
    codigo: '#TK-1082',
    titulo: 'Fallo crítico en validación de token JWT al emitir facturas electrónicas',
    descripcion:
      'Los clientes de plan Enterprise reportan respuestas HTTP 401 intermitentes al consumir el servicio de firma digital de comprobantes. El trazado de error indica desincronización de reloj en uno de los pods del clúster.',
    logsError: `[ERROR] 2026-10-21 21:14:02 UTC [AuthService]
JwtVerificationException: The token signature could not be verified against the rotating public key.
    at verifyToken (/app/services/jwt.ts:84:15)
    at async validateRequest (/app/middleware/auth.ts:32:9)
Pod: auth-service-7f89d-x2m9q, Node: ip-10-0-4-182.ec2.internal`,
    clienteNombre: 'Acme Logistics SaaS',
    clientePlan: 'Plan Enterprise',
    categoria: 'AUTENTICACION',
    prioridad: 'P1',
    estado: 'EN_DIAGNOSTICO',
    version: 1, // Demostración de Bloqueo Optimista
    asignadoA: 'Alex Vance (TI)',
    reportadoPor: 'Carlos Mendoza (Soporte)',
    createdAt: 'Hace 14 min',
    updatedAt: 'Hace 5 min',
    adjuntos: [
      {
        id: 'att-1',
        nombreArchivo: 'jwt_signature_error_trace.png',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        tamanoBytes: 245000,
        mimeType: 'image/png',
      },
    ],
    comentarios: [
      {
        id: 'c-1',
        ticketId: 't-1082',
        autorNombre: 'Carlos Mendoza',
        autorDepartamento: 'Soporte',
        contenido:
          'Se recibieron 8 llamadas en los últimos 20 minutos de cuentas Enterprise. Los comprobantes tributarios están rechazándose.',
        createdAt: 'Hace 12 min',
      },
      {
        id: 'c-2',
        ticketId: 't-1082',
        autorNombre: 'Alex Vance',
        autorDepartamento: 'TI / Desarrollo',
        contenido:
          'Tomando la incidencia. Estoy revisando el secret manager y la rotación de claves públicas.',
        createdAt: 'Hace 5 min',
      },
    ],
  },
  {
    id: 't-1081',
    codigo: '#TK-1081',
    titulo: 'Error de timeout al exportar reportes consolidados en formato PDF',
    descripcion:
      'La consulta de consolidación excede el tiempo límite de ejecución de 30 segundos en bases de datos con más de 500,000 registros históricos.',
    clienteNombre: 'Fintech Solutions S.A.C.',
    clientePlan: 'Plan Pro',
    categoria: 'BASE_DE_DATOS',
    prioridad: 'P2',
    estado: 'EN_DESARROLLO',
    version: 2,
    asignadoA: 'María Quispe (TI)',
    reportadoPor: 'Lucía Fernández (Ventas)',
    createdAt: 'Hace 45 min',
    updatedAt: 'Hace 20 min',
    adjuntos: [],
    comentarios: [],
  },
  {
    id: 't-1079',
    codigo: '#TK-1079',
    titulo: 'Inconsistencia en cálculo de impuestos según tipo de moneda en Zoho CRM',
    descripcion:
      'Al sincronizar pedidos creados en dólares desde Zoho CRM mediante el webhook, el monto en soles no aplica el tipo de cambio oficial del día.',
    clienteNombre: 'Grupo Comercial Andino',
    clientePlan: 'Plan Enterprise',
    categoria: 'API',
    prioridad: 'P3',
    estado: 'NUEVO',
    version: 1,
    reportadoPor: 'Andrés Soto (Ventas)',
    createdAt: 'Hace 2 horas',
    updatedAt: 'Hace 2 horas',
    adjuntos: [],
    comentarios: [],
  },
  {
    id: 't-1075',
    codigo: '#TK-1075',
    titulo: 'Plantilla de impresión térmica de recibos desalineada en impresoras Epson',
    descripcion:
      'El margen derecho se corta en impresoras de 58mm cuando la descripción del producto supera los 30 caracteres.',
    clienteNombre: 'Retail Fast Express',
    clientePlan: 'Plan Básico',
    categoria: 'IMPRESION',
    prioridad: 'P4',
    estado: 'RESUELTO',
    version: 3,
    asignadoA: 'Diego Ramos (Soporte)',
    reportadoPor: 'Diego Ramos (Soporte)',
    createdAt: 'Ayer',
    updatedAt: 'Hace 3 horas',
    adjuntos: [],
    comentarios: [],
  },
];

export const ticketsApi = {
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await apiClient.get<Ticket[]>('/tickets');
      return response.data;
    } catch {
      // Fallback a mock data local
      return [...mockTickets];
    }
  },

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const response = await apiClient.get<Ticket>(`/tickets/${id}`);
      return response.data;
    } catch {
      const found = mockTickets.find((t) => t.id === id);
      if (!found) {
        throw new Error('Ticket no encontrado');
      }
      return { ...found };
    }
  },

  /**
   * Actualiza el ticket implementando la regla de Bloqueo Optimista:
   * UPDATE tickets SET ... version = version + 1 WHERE id = $1 AND version = $2;
   * Si la versión enviada no coincide, el servidor lanza HTTP 409 Conflict.
   */
  async updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
    try {
      const response = await apiClient.put<Ticket>(`/tickets/${id}`, input);
      return response.data;
    } catch (err: any) {
      // Si la API remota no está activa, ejecutamos la lógica de bloqueo optimista en el mock
      const index = mockTickets.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Ticket no encontrado');

      const serverTicket = mockTickets[index];

      // Verificación de Bloqueo Optimista
      if (input.version !== serverTicket.version) {
        const conflictError: any = new Error(
          'Conflicto de Concurrencia (HTTP 409): El ticket fue modificado por otro usuario.'
        );
        conflictError.response = {
          status: 409,
          data: {
            message:
              'Conflicto de concurrencia: La versión en el servidor es más reciente.',
            serverVersion: serverTicket.version,
          },
        };
        throw conflictError;
      }

      // Si las versiones coinciden, incrementamos la versión y guardamos
      const updated: Ticket = {
        ...serverTicket,
        estado: input.estado || serverTicket.estado,
        prioridad: input.prioridad || serverTicket.prioridad,
        version: serverTicket.version + 1,
        updatedAt: 'Hace unos instantes',
        comentarios: input.nuevoComentario
          ? [
              ...serverTicket.comentarios,
              {
                id: 'c-' + Date.now(),
                ticketId: serverTicket.id,
                autorNombre: 'Alex Vance',
                autorDepartamento: 'TI / Desarrollo',
                contenido: input.nuevoComentario,
                createdAt: 'Hace un momento',
              },
            ]
          : serverTicket.comentarios,
      };

      mockTickets[index] = updated;
      return updated;
    }
  },

  /**
   * Solicita una URL prefirmada al backend para subir capturas directo a Amazon S3
   */
  async getPresignedUploadUrl(
    fileName: string,
    mimeType: string
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    try {
      const response = await apiClient.post('/tickets/upload-url', {
        fileName,
        mimeType,
      });
      return response.data;
    } catch {
      // Fallback simulado para entorno académico / PoC
      const fileKey = `attachments/${Date.now()}_${fileName}`;
      return {
        uploadUrl: `https://mock-s3-bucket.s3.us-east-1.amazonaws.com/${fileKey}`,
        fileKey,
      };
    }
  },

  /**
   * Sube el archivo binario directamente a Amazon S3 usando la URL prefirmada
   */
  async uploadFileToS3(
    uploadUrl: string,
    fileUri: string,
    mimeType: string
  ): Promise<void> {
    // Si es una URL simulada en modo local, simulamos una pequeña latencia de subida
    if (uploadUrl.includes('mock-s3-bucket')) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return;
    }

    if (Platform.OS === 'web') {
      const blob = await fetch(fileUri).then((r) => r.blob());
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: blob,
      });
    } else {
      await FileSystem.uploadAsync(uploadUrl, fileUri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Content-Type': mimeType || 'image/jpeg',
        },
      });
    }
  },

  /**
   * Registra una nueva incidencia técnica en el Hub de Operaciones
   */
  async createTicket(input: CreateTicketInput): Promise<Ticket> {
    try {
      const response = await apiClient.post<Ticket>('/tickets', input);
      return response.data;
    } catch {
      // Fallback local en memoria
      const newIdNumber = mockTickets.length + 1083;
      const newTicket: Ticket = {
        id: `t-${newIdNumber}`,
        codigo: `#TK-${newIdNumber}`,
        titulo: input.titulo,
        descripcion: input.descripcion,
        clienteNombre: input.clienteNombre,
        clientePlan: input.clientePlan,
        categoria: input.categoria,
        prioridad: input.prioridad,
        estado: 'NUEVO',
        version: 1, // Toda nueva incidencia inicia en versión 1
        reportadoPor: 'Alex Vance (TI)',
        createdAt: 'Hace unos instantes',
        updatedAt: 'Hace unos instantes',
        adjuntos: input.adjuntoUrl
          ? [
              {
                id: `att-${Date.now()}`,
                nombreArchivo: input.adjuntoNombre || 'captura_adjunta.jpg',
                url: input.adjuntoUrl,
                tamanoBytes: input.adjuntoBytes || 185000,
                mimeType: 'image/jpeg',
              },
            ]
          : [],
        comentarios: [],
      };

      // Se agrega al principio de la lista de tickets
      mockTickets = [newTicket, ...mockTickets];
      return newTicket;
    }
  },

  /**
   * Helper exclusivo para demostraciones académicas:
   * Incrementa la versión en el "servidor" para forzar el conflicto 409 en la próxima edición.
   */
  async simulateExternalConcurrentModification(id: string): Promise<number> {
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTickets[index].version += 1;
      mockTickets[index].estado = 'EN_QA';
      mockTickets[index].comentarios.push({
        id: 'c-ext-' + Date.now(),
        ticketId: id,
        autorNombre: 'Otro Desarrollador (Simulado)',
        autorDepartamento: 'TI / Desarrollo',
        contenido:
          'Se aplicó un hotfix en el clúster y se subió la versión en el servidor a v' +
          mockTickets[index].version,
        createdAt: 'Hace 5 segundos',
      });
      return mockTickets[index].version;
    }
    return 1;
  },
};
