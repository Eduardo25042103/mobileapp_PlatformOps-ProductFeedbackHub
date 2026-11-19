import { Ticket, UpdateTicketInput, CreateTicketInput, TicketStatus, TicketPriority, TicketCategory } from '../types/ticket';
import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const STATUS_MAP: Record<TicketStatus, { id: number; nombre: string }> = {
  NUEVO: { id: 1, nombre: 'Nuevo' },
  EN_DIAGNOSTICO: { id: 2, nombre: 'En Diagnóstico' },
  EN_DESARROLLO: { id: 3, nombre: 'En Desarrollo' },
  EN_QA: { id: 4, nombre: 'En QA' },
  RESUELTO: { id: 5, nombre: 'Resuelto' },
  CERRADO: { id: 6, nombre: 'Cerrado' },
};

const PRIORITY_MAP: Record<TicketPriority, { id: number; nombre: string }> = {
  P1: { id: 1, nombre: 'P1 Crítico' },
  P2: { id: 2, nombre: 'P2 Alta' },
  P3: { id: 3, nombre: 'P3 Media' },
  P4: { id: 4, nombre: 'P4 Baja' },
};

const CATEGORY_MAP: Record<TicketCategory, { id: number; nombre: string }> = {
  FIRMA_ELECTRONICA: { id: 1, nombre: 'Firma Electrónica' },
  BASE_DE_DATOS: { id: 2, nombre: 'Base de Datos' },
  AUTENTICACION: { id: 3, nombre: 'Autenticación' },
  IMPRESION: { id: 4, nombre: 'Impresión' },
  API: { id: 5, nombre: 'APIs & Webhooks' },
  OTRO: { id: 6, nombre: 'Otro' },
};

// Datos semilla de resiliencia local en caso de desconexión
let mockTickets: Ticket[] = [
  {
    id: '1',
    numericId: 1,
    codigo: 'TK-1082',
    titulo: 'Fallo crítico en validación de token JWT al emitir facturas electrónicas',
    descripcion:
      'Los clientes de plan Enterprise reportan respuestas HTTP 401 intermitentes al consumir el servicio de firma digital de comprobantes. El trazado de error indica desincronización de reloj en uno de los pods del clúster.',
    logsError: `[ERROR] 2026-11-17 21:14:02 UTC [AuthService]
JwtVerificationException: The token signature could not be verified against the rotating public key.
    at verifyToken (/app/services/jwt.ts:84:15)
Pod: auth-service-7f89d-x2m9q, Node: ip-10-0-4-182.us-east-2.compute.internal`,
    clienteId: 1,
    clienteNombre: 'Acme Logistics SaaS',
    clienteRuc: '20601234567',
    clientePlan: 'Plan Enterprise',
    telefono: '+51 987 654 321',
    categoria: 'AUTENTICACION',
    categoriaNombre: 'Autenticación',
    prioridad: 'P1',
    prioridadNombre: 'P1 Crítico',
    estado: 'EN_DIAGNOSTICO',
    estadoNombre: 'En Diagnóstico',
    version: 1, // Demostración de Bloqueo Optimista
    asignadoA: 'Aldair Cahuana (TI)',
    reportadoPor: 'Henry Monroy (Soporte)',
    createdAt: 'Hace 14 min',
    updatedAt: 'Hace 5 min',
    adjuntos: [
      {
        id: 1,
        nombreArchivo: 'jwt_signature_error_trace.png',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        tamanoBytes: 245000,
        mimeType: 'image/png',
      },
    ],
    comentarios: [
      {
        id: 1,
        ticketId: 1,
        autorNombre: 'Henry Monroy',
        autorDepartamento: 'Soporte Técnico',
        contenido: 'Se recibieron 8 llamadas de cuentas Enterprise. Comprobantes tributarios rechazándose.',
        createdAt: 'Hace 12 min',
      },
      {
        id: 2,
        ticketId: 1,
        autorNombre: 'Aldair Cahuana',
        autorDepartamento: 'TI & Desarrollo',
        contenido: 'Tomando la incidencia. Verificando configuración de AWS Cognito y certificados.',
        createdAt: 'Hace 5 min',
      },
    ],
  },
  {
    id: '2',
    numericId: 2,
    codigo: 'TK-1081',
    titulo: 'Error de timeout al exportar reportes consolidados en formato PDF',
    descripcion:
      'La consulta de consolidación excede el tiempo límite de ejecución de 30 segundos en bases de datos con más de 500,000 registros históricos.',
    clienteId: 2,
    clienteNombre: 'Fintech Solutions S.A.C.',
    clienteRuc: '20509876543',
    clientePlan: 'Plan Pro',
    telefono: '+51 912 345 678',
    categoria: 'BASE_DE_DATOS',
    categoriaNombre: 'Base de Datos',
    prioridad: 'P2',
    prioridadNombre: 'P2 Alta',
    estado: 'EN_DESARROLLO',
    estadoNombre: 'En Desarrollo',
    version: 2,
    asignadoA: 'Aldair Cahuana (TI)',
    reportadoPor: 'Josue Morales (Ventas)',
    createdAt: 'Hace 45 min',
    updatedAt: 'Hace 20 min',
    adjuntos: [],
    comentarios: [],
  },
  {
    id: '3',
    numericId: 3,
    codigo: 'TK-1079',
    titulo: 'Inconsistencia en cálculo de impuestos según tipo de moneda en Zoho CRM',
    descripcion:
      'Al sincronizar pedidos creados en dólares desde Zoho CRM mediante el webhook, el monto en soles no aplica el tipo de cambio oficial del día.',
    clienteId: 3,
    clienteNombre: 'Grupo Comercial Andino',
    clienteRuc: '20401122334',
    clientePlan: 'Plan Enterprise',
    telefono: '+51 945 678 123',
    categoria: 'API',
    categoriaNombre: 'APIs & Webhooks',
    prioridad: 'P3',
    prioridadNombre: 'P3 Media',
    estado: 'NUEVO',
    estadoNombre: 'Nuevo',
    version: 1,
    reportadoPor: 'Josue Morales (Ventas)',
    createdAt: 'Hace 2 horas',
    updatedAt: 'Hace 2 horas',
    adjuntos: [],
    comentarios: [],
  },
  {
    id: '4',
    numericId: 4,
    codigo: 'TK-1075',
    titulo: 'Plantilla de impresión térmica de recibos desalineada en impresoras Epson',
    descripcion:
      'El margen derecho se corta en impresoras de 58mm cuando la descripción del producto supera los 30 caracteres.',
    clienteId: 4,
    clienteNombre: 'Retail Fast Express',
    clienteRuc: '20309988776',
    clientePlan: 'Plan Básico',
    telefono: '+51 998 765 432',
    categoria: 'IMPRESION',
    categoriaNombre: 'Impresión',
    prioridad: 'P4',
    prioridadNombre: 'P4 Baja',
    estado: 'RESUELTO',
    estadoNombre: 'Resuelto',
    version: 3,
    asignadoA: 'Henry Monroy (Soporte)',
    reportadoPor: 'Henry Monroy (Soporte)',
    createdAt: 'Ayer',
    updatedAt: 'Hace 3 horas',
    adjuntos: [],
    comentarios: [],
  },
];

function mapDtoToTicket(dto: any): Ticket {
  const estadoCode = (dto.estadoCodigo || dto.estado || 'NUEVO').toUpperCase() as TicketStatus;
  const prioridadCode = (dto.prioridadCodigo || dto.prioridad || 'P3').toUpperCase() as TicketPriority;
  const categoriaCode = (dto.categoriaCodigo || dto.categoria || 'OTRO').toUpperCase() as TicketCategory;

  return {
    id: String(dto.id),
    numericId: Number(dto.id),
    codigo: dto.codigo ? (dto.codigo.startsWith('#') ? dto.codigo : `#${dto.codigo}`) : `#TK-${dto.id}`,
    titulo: dto.titulo || 'Sin Título',
    descripcion: dto.descripcion || '',
    logsError: dto.logsError,
    clienteId: dto.clienteId || 1,
    clienteNombre: dto.clienteRazonSocial || dto.clienteNombre || 'Cliente General',
    clienteRuc: dto.clienteRuc || '',
    clientePlan: dto.clientePlan || 'Plan Estándar',
    telefono: dto.telefonoContacto || dto.telefono || '+51 900 000 000',
    categoria: categoriaCode in CATEGORY_MAP ? categoriaCode : 'OTRO',
    categoriaNombre: dto.categoriaNombre || CATEGORY_MAP[categoriaCode]?.nombre || 'General',
    prioridad: prioridadCode in PRIORITY_MAP ? prioridadCode : 'P3',
    prioridadNombre: dto.prioridadNombre || PRIORITY_MAP[prioridadCode]?.nombre || 'P3 Media',
    estado: estadoCode in STATUS_MAP ? estadoCode : 'NUEVO',
    estadoNombre: dto.estadoNombre || STATUS_MAP[estadoCode]?.nombre || 'Nuevo',
    version: dto.version ?? 1,
    reportadoPorId: dto.reportadoPorId,
    reportadoPor: dto.reportadoPorNombre || dto.reportadoPor || 'Sistema',
    asignadoAId: dto.asignadoAId,
    asignadoA: dto.asignadoANombre || dto.asignadoA,
    canalOrigen: dto.canalOrigen || 'MOBILE',
    createdAt: dto.createdAt ? new Date(dto.createdAt).toLocaleString('es-PE') : 'Reciente',
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt).toLocaleString('es-PE') : 'Reciente',
    fechaCierre: dto.fechaCierre,
    adjuntos: Array.isArray(dto.adjuntos)
      ? dto.adjuntos.map((a: any) => ({
          id: a.id,
          nombreArchivo: a.nombreArchivo || 'archivo_adjunto',
          url: a.s3Url || a.url || '',
          tamanoBytes: a.tamanioBytes || a.tamanoBytes || 0,
          mimeType: a.tipoMime || a.mimeType || 'image/jpeg',
          createdAt: a.createdAt,
        }))
      : [],
    comentarios: Array.isArray(dto.comentarios)
      ? dto.comentarios.map((c: any) => ({
          id: c.id,
          ticketId: c.ticketId || dto.id,
          autorNombre: c.usuarioNombre || c.autorNombre || 'Colaborador',
          autorDepartamento: c.autorDepartamento || 'Operaciones',
          contenido: c.comentario || c.contenido || '',
          esPrivadoTi: c.esPrivadoTi,
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString('es-PE') : 'Hace un momento',
        }))
      : [],
    escalaciones: Array.isArray(dto.escalaciones)
      ? dto.escalaciones.map((e: any) => ({
          id: e.id,
          escaladoPorNombre: e.escaladoPorNombre || '',
          asignadoANombre: e.asignadoANombre || '',
          motivoEscalacion: e.motivoEscalacion || '',
          diagnosticoInicial: e.diagnosticoInicial,
          createdAt: e.createdAt,
        }))
      : [],
  };
}

export const ticketsApi = {
  /**
   * Consulta listado de tickets en tiempo real desde AWS Lambda / RDS MySQL
   */
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/tickets');
      const rawList = response.data?.data || response.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(mapDtoToTicket);
      }
      return [...mockTickets];
    } catch {
      return [...mockTickets];
    }
  },

  /**
   * Consulta detalle completo de un ticket (incluye comentarios, adjuntos S3 y escalaciones)
   */
  async getTicketById(id: string): Promise<Ticket> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/tickets/${id}`);
      const rawData = response.data?.data || response.data;
      if (rawData && rawData.id) {
        return mapDtoToTicket(rawData);
      }
      throw new Error('Ticket no encontrado');
    } catch {
      const found = mockTickets.find((t) => t.id === id);
      if (!found) throw new Error('Ticket no encontrado');
      return { ...found };
    }
  },

  /**
   * Actualización de estado del ticket con validación estricta de concurrencia (Bloqueo Optimista)
   * Si la versión enviada difiere de la de RDS MySQL, el servidor retorna HTTP 409 Conflict.
   */
  async updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const numericId = parseInt(id, 10) || 1;
    const nuevoEstado = input.estado || 'EN_DIAGNOSTICO';
    const nuevoEstadoId = STATUS_MAP[nuevoEstado]?.id || 2;

    const requestBody = {
      nuevoEstadoId,
      currentVersion: input.version,
      comentario: input.nuevoComentario || undefined,
    };

    try {
      const response = await apiClient.put<ApiResponse<any>>(`/tickets/${numericId}/status`, requestBody);
      const raw = response.data?.data || response.data;
      return mapDtoToTicket(raw);
    } catch (err: any) {
      if (err.response?.status === 409) {
        throw err;
      }

      // Si no hay conectividad a AWS, evaluamos el bloqueo optimista en mock
      const index = mockTickets.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Ticket no encontrado');

      const serverTicket = mockTickets[index];
      if (input.version !== serverTicket.version) {
        const conflictError: any = new Error(
          'Conflicto de Concurrencia (HTTP 409): El ticket fue modificado por otro usuario.'
        );
        conflictError.response = {
          status: 409,
          data: {
            message: 'Conflicto de concurrencia: La versión en el servidor es más reciente.',
            serverVersion: serverTicket.version,
          },
        };
        throw conflictError;
      }

      const updated: Ticket = {
        ...serverTicket,
        estado: input.estado || serverTicket.estado,
        estadoNombre: input.estado ? STATUS_MAP[input.estado]?.nombre : serverTicket.estadoNombre,
        prioridad: input.prioridad || serverTicket.prioridad,
        version: serverTicket.version + 1,
        updatedAt: 'Hace unos instantes',
        comentarios: input.nuevoComentario
          ? [
              ...serverTicket.comentarios,
              {
                id: Date.now(),
                ticketId: serverTicket.id,
                autorNombre: 'Tú (Móvil)',
                autorDepartamento: 'Operaciones',
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
   * Genera URL prefirmada de Amazon S3 con vigencia de 5 minutos
   */
  async getPresignedUploadUrl(
    fileName: string,
    mimeType: string,
    ticketId: number = 1
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/tickets/${ticketId}/attachments/presigned-url`,
        {
          fileName,
          contentType: mimeType,
        }
      );
      const data = response.data?.data || response.data;
      return {
        uploadUrl: data.uploadUrl,
        fileKey: data.s3Key || `attachments/${fileName}`,
      };
    } catch {
      const fileKey = `attachments/${Date.now()}_${fileName}`;
      return {
        uploadUrl: `https://opshub-adjuntos-prod.s3.us-east-2.amazonaws.com/${fileKey}`,
        fileKey,
      };
    }
  },

  /**
   * Sube archivo binario directamente al bucket Amazon S3 vía PUT
   */
  async uploadFileToS3(uploadUrl: string, fileUri: string, mimeType: string): Promise<void> {
    if (uploadUrl.includes('opshub-adjuntos-prod') && !uploadUrl.includes('X-Amz-Signature')) {
      // En modo simulado académico local
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
   * Registra una nueva incidencia técnica en el backend de AWS
   */
  async createTicket(input: CreateTicketInput): Promise<Ticket> {
    const categoriaId = input.categoriaId || CATEGORY_MAP[input.categoria]?.id || 1;
    const prioridadId = input.prioridadId || PRIORITY_MAP[input.prioridad]?.id || 1;

    const payload = {
      clienteId: input.clienteId || 1,
      categoriaId,
      prioridadId,
      titulo: input.titulo,
      descripcion: input.descripcion,
      telefonoContacto: input.telefono,
      canalOrigen: 'MOBILE_APP',
    };

    try {
      const response = await apiClient.post<ApiResponse<any>>('/tickets', payload);
      const raw = response.data?.data || response.data;
      const created = mapDtoToTicket(raw);

      // Si se subió un adjunto, confirmarlo en el backend
      if (input.s3Key) {
        try {
          await apiClient.post(`/tickets/${created.numericId}/attachments`, {
            nombreArchivo: input.adjuntoNombre || 'evidencia_captura.jpg',
            s3Key: input.s3Key,
            tipoMime: 'image/jpeg',
            tamanioBytes: input.adjuntoBytes || 180000,
          });
        } catch (attErr) {
          console.warn('Error al confirmar adjunto:', attErr);
        }
      }

      return created;
    } catch {
      const newIdNumber = mockTickets.length + 1083;
      const newTicket: Ticket = {
        id: String(newIdNumber),
        numericId: newIdNumber,
        codigo: `#TK-${newIdNumber}`,
        titulo: input.titulo,
        descripcion: input.descripcion,
        clienteId: input.clienteId || 1,
        clienteNombre: input.clienteNombre,
        clientePlan: input.clientePlan,
        telefono: input.telefono,
        categoria: input.categoria,
        categoriaNombre: CATEGORY_MAP[input.categoria]?.nombre || 'General',
        prioridad: input.prioridad,
        prioridadNombre: PRIORITY_MAP[input.prioridad]?.nombre || 'P1 Crítico',
        estado: 'NUEVO',
        estadoNombre: 'Nuevo',
        version: 1,
        reportadoPor: 'Tú (Móvil)',
        createdAt: 'Hace unos instantes',
        updatedAt: 'Hace unos instantes',
        adjuntos: input.adjuntoUrl
          ? [
              {
                id: Date.now(),
                nombreArchivo: input.adjuntoNombre || 'captura_adjunta.jpg',
                url: input.adjuntoUrl,
                tamanoBytes: input.adjuntoBytes || 185000,
                mimeType: 'image/jpeg',
              },
            ]
          : [],
        comentarios: [],
      };

      mockTickets = [newTicket, ...mockTickets];
      return newTicket;
    }
  },

  /**
   * Elimina o cierra un ticket
   */
  async deleteTicket(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/tickets/${id}`);
      mockTickets = mockTickets.filter((t) => t.id !== id);
      return true;
    } catch {
      mockTickets = mockTickets.filter((t) => t.id !== id);
      return true;
    }
  },

  /**
   * Helper exclusivo para demostraciones de concurrencia y sustentación:
   * Incrementa artificialmente la versión para forzar el conflicto HTTP 409
   */
  async simulateExternalConcurrentModification(id: string): Promise<number> {
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTickets[index].version += 1;
      mockTickets[index].estado = 'EN_QA';
      mockTickets[index].estadoNombre = 'En QA';
      mockTickets[index].comentarios.push({
        id: Date.now(),
        ticketId: id,
        autorNombre: 'Ingeniero Remoto (Simulación)',
        autorDepartamento: 'TI & Desarrollo',
        contenido: `Se aplicó un parche urgente en AWS Lambda. Versión incrementada a v${mockTickets[index].version}.`,
        createdAt: 'Hace 5 segundos',
      });
      return mockTickets[index].version;
    }
    return 1;
  },
};
