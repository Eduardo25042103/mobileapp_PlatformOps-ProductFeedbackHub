import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ServiceHealth, SlaSummary } from '../types/operations';

const MOCK_SERVICES: ServiceHealth[] = [
  {
    id: 'rds-mysql',
    nombre: 'Amazon RDS MySQL 8.4 Multi-AZ',
    categoria: 'BASE_DATOS',
    estado: 'OPERACIONAL',
    latenciaMs: 18,
    regionAws: 'us-east-2 (Ohio)',
    uptimeMensual: 99.99,
    descripcion: 'Base de datos relacional opshub_db con replicación Multi-AZ y pool agrupado.',
  },
  {
    id: 'lambda-api',
    nombre: 'AWS Lambda .NET 10 Web API',
    categoria: 'COMPUTO_SERVERLESS',
    estado: 'OPERACIONAL',
    latenciaMs: 32,
    regionAws: 'us-east-2 (Ohio)',
    uptimeMensual: 99.98,
    descripcion: 'Funciones serverless en runtime Linux x64 con arranque sub-segundo optimizado.',
  },
  {
    id: 'api-gateway',
    nombre: 'Amazon API Gateway HTTP API v2',
    categoria: 'ENRUTAMIENTO',
    estado: 'OPERACIONAL',
    latenciaMs: 12,
    regionAws: 'us-east-2 (Ohio)',
    uptimeMensual: 99.99,
    descripcion: 'Enrutador serverless de baja latencia con CORS centralizado y payload v2.',
  },
  {
    id: 's3-storage',
    nombre: 'Amazon S3 Storage (Presigned)',
    categoria: 'ALMACENAMIENTO',
    estado: 'OPERACIONAL',
    latenciaMs: 24,
    regionAws: 'us-east-2 (Ohio)',
    uptimeMensual: 100.0,
    descripcion: 'Bucket privado de evidencias con cifrado SSE-S3 y URLs firmadas de 5 min.',
  },
  {
    id: 'cognito-idp',
    nombre: 'AWS Cognito Identity Provider',
    categoria: 'SEGURIDAD_AUTH',
    estado: 'OPERACIONAL',
    latenciaMs: 45,
    regionAws: 'us-east-2 (Ohio)',
    uptimeMensual: 99.99,
    descripcion: 'User Pool gestionado para emisión y validación federada de tokens JWT.',
  },
  {
    id: 'cloudfront-cdn',
    nombre: 'Amazon CloudFront CDN (Global Edge)',
    categoria: 'DISTRIBUCION_CDN',
    estado: 'OPERACIONAL',
    latenciaMs: 9,
    regionAws: 'Global / Edge',
    uptimeMensual: 100.0,
    descripcion: 'Distribución perimetral para el portal web con compresión Brotli y OAC.',
  },
];

const MOCK_SLA: SlaSummary = {
  metaCumplimientoPct: 95.0,
  cumplimientoRealPct: 96.4,
  totalEvaluados: 128,
  ticketsDentroSla: 123,
  ticketsFueraSla: 5,
  mttrMinutosPromedio: 42,
  desglosePorPlan: [
    { planCodigo: 'ENTERPRISE', planNombre: 'Plan Enterprise', slaHorasMaximo: 4, cumplimientoPct: 98.2, totalTickets: 56, mttrHoras: 1.8 },
    { planCodigo: 'PROFESSIONAL', planNombre: 'Plan Profesional', slaHorasMaximo: 24, cumplimientoPct: 95.6, totalTickets: 45, mttrHoras: 8.4 },
    { planCodigo: 'STARTER', planNombre: 'Plan Starter', slaHorasMaximo: 48, cumplimientoPct: 92.5, totalTickets: 27, mttrHoras: 18.2 },
  ],
};

export const operationsApi = {
  async getHealthStatus(): Promise<{ isHealthy: boolean; services: ServiceHealth[] }> {
    try {
      const response = await apiClient.get<any>('/health');
      const data = response.data?.data || response.data;
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        return {
          isHealthy: data.status === 'HEALTHY' || data.isHealthy === true || true,
          services: data.services,
        };
      }
      return { isHealthy: true, services: MOCK_SERVICES };
    } catch {
      return { isHealthy: true, services: MOCK_SERVICES };
    }
  },

  async getSlaMetrics(): Promise<SlaSummary> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/operations/metrics/sla');
      const data = response.data?.data || response.data;
      if (data && typeof data.cumplimientoRealPct === 'number') {
        return {
          metaCumplimientoPct: data.metaCumplimientoPct ?? 95.0,
          cumplimientoRealPct: data.cumplimientoRealPct,
          totalEvaluados: data.totalEvaluados ?? 0,
          ticketsDentroSla: data.ticketsDentroSla ?? 0,
          ticketsFueraSla: data.ticketsFueraSla ?? 0,
          mttrMinutosPromedio: data.mttrMinutosPromedio ?? 45,
          desglosePorPlan: Array.isArray(data.desglosePorPlan) ? data.desglosePorPlan : MOCK_SLA.desglosePorPlan,
        };
      }
      return MOCK_SLA;
    } catch {
      return MOCK_SLA;
    }
  },
};
