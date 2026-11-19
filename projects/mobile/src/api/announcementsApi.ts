import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ChangelogRelease, ComunicadoSistema } from '../types/announcements';

const MOCK_ANNOUNCEMENTS: ComunicadoSistema[] = [
  {
    id: 1,
    titulo: 'Mantenimiento Preventivo de Base de Datos Amazon RDS MySQL',
    contenido:
      'Reindexación programada y optimización de índices en clúster Multi-AZ a las 23:00 UTC. La latencia de peticiones concurrentes podría experimentar variaciones leves por 5 minutos.',
    tipoCodigo: 'MANTENIMIENTO',
    tipoNombre: 'Mantenimiento Cloud',
    afectaServicio: false,
    esVigente: true,
    publicadoPorNombre: 'Eduardo Sánchez (Marketing & Prod)',
    fechaPublicacion: 'Hace 3 horas',
  },
  {
    id: 2,
    titulo: 'Degradación mitigada en servicio de consulta RUC de Sunat',
    contenido:
      'El servicio de consulta masiva RUC reportó intermitencias externas entre las 09:15 y 09:40 COT. Se activó el pool de contingencia y la operación está normalizada.',
    tipoCodigo: 'INCIDENCIA',
    tipoNombre: 'Alerta Operativa',
    afectaServicio: false,
    esVigente: true,
    publicadoPorNombre: 'Henry Monroy (Soporte)',
    fechaPublicacion: 'Ayer a las 11:30',
  },
];

const MOCK_CHANGELOGS: ChangelogRelease[] = [
  {
    id: 1,
    version: 'v2.4.0',
    titulo: 'Release Sprint 6: Bloqueo Optimista y Conexión Multi-Plataforma Cloud',
    notas:
      'Despliegue de detección de conflictos HTTP 409, integración de presigned URLs contra Amazon S3 en Ohio y unificación de identidades con AWS Cognito.',
    tipoRelease: 'MAJOR',
    redactadoPorNombre: 'Aldair Cahuana',
    fechaLanzamiento: '17 Nov 2026',
  },
  {
    id: 2,
    version: 'v2.3.1',
    titulo: 'Optimización de latencia en consultas de SLA y Ficha 360°',
    notas: 'Índices compuestos aplicados en tablas de métricas y turnos para acelerar respuestas sub-segundo en AWS Lambda.',
    tipoRelease: 'PATCH',
    redactadoPorNombre: 'Eduardo Sánchez',
    fechaLanzamiento: '12 Nov 2026',
  },
];

export const announcementsApi = {
  async getActiveAnnouncements(): Promise<ComunicadoSistema[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/announcements/active');
      const raw = response.data?.data || response.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((a) => ({
          id: a.id,
          titulo: a.titulo,
          contenido: a.contenido,
          tipoCodigo: a.tipoCodigo || 'INFORMATIVO',
          tipoNombre: a.tipoNombre || 'Comunicado',
          afectaServicio: a.afectaServicio ?? false,
          esVigente: a.esVigente ?? true,
          publicadoPorNombre: a.publicadoPorNombre || 'Equipo TuNegocio.pe',
          fechaPublicacion: a.createdAt ? new Date(a.createdAt).toLocaleDateString('es-PE') : 'Reciente',
          fechaExpiracion: a.fechaExpiracion,
        }));
      }
      return MOCK_ANNOUNCEMENTS;
    } catch {
      return MOCK_ANNOUNCEMENTS;
    }
  },

  async getChangelogs(): Promise<ChangelogRelease[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/announcements/changelog');
      const raw = response.data?.data || response.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((c) => ({
          id: c.id,
          version: c.version,
          titulo: c.titulo,
          notas: c.notas || c.descripcion || '',
          tipoRelease: c.tipoRelease || 'RELEASE',
          redactadoPorNombre: c.redactadoPorNombre || 'TI & Desarrollo',
          fechaLanzamiento: c.fechaLanzamiento ? new Date(c.fechaLanzamiento).toLocaleDateString('es-PE') : 'Reciente',
        }));
      }
      return MOCK_CHANGELOGS;
    } catch {
      return MOCK_CHANGELOGS;
    }
  },
};
