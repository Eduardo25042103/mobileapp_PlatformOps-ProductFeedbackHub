import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { SugerenciaProducto } from '../types/feedback';

const MOCK_SUGGESTIONS: SugerenciaProducto[] = [
  {
    id: 1,
    titulo: 'Integración nativa con Sunat Facturador Offline para contingencias',
    descripcion: 'Permitir emitir comprobantes tributarios firmados localmente cuando los Web Services de Sunat caigan.',
    modulo: 'FACTURACION',
    estado: 'PLANIFICADA',
    totalVotos: 42,
    arrInfluenciado: 125000,
    creadoPorNombre: 'Josue Morales',
    creadoPorDepartamento: 'Ventas Corporativas',
    hasVoted: true,
    scoreRice: 88,
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 2,
    titulo: 'Soporte de Webhooks salientes para eventos de anulación de comprobantes',
    descripcion: 'Disparar peticiones HTTP POST firmadas con HMAC a los ERPs de los clientes en eventos de notas de crédito.',
    modulo: 'INTEGRACIONES',
    estado: 'EN_DESARROLLO',
    totalVotos: 35,
    arrInfluenciado: 84000,
    creadoPorNombre: 'Aldair Cahuana',
    creadoPorDepartamento: 'TI & Desarrollo',
    hasVoted: false,
    scoreRice: 74,
    createdAt: '2026-11-05T14:30:00Z',
  },
  {
    id: 3,
    titulo: 'Autenticación con Clave SOL en segundo plano para descarga masiva de CDRs',
    descripcion: 'Automatizar la descarga diaria de Constancias de Recepción desde el portal Sunat sin intervención manual.',
    modulo: 'SOPORTE',
    estado: 'RECIBIDA',
    totalVotos: 19,
    arrInfluenciado: 42000,
    creadoPorNombre: 'Henry Monroy',
    creadoPorDepartamento: 'Soporte Técnico',
    hasVoted: false,
    scoreRice: 62,
    createdAt: '2026-11-10T09:15:00Z',
  },
];

export const feedbackApi = {
  async getSuggestions(): Promise<SugerenciaProducto[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/feedback/sugerencias');
      const raw = response.data?.data || response.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((s) => ({
          id: s.id,
          titulo: s.titulo,
          descripcion: s.descripcion || '',
          modulo: s.modulo || 'GENERAL',
          estado: s.estadoCodigo || s.estado || 'RECIBIDA',
          totalVotos: s.totalVotos ?? 0,
          arrInfluenciado: s.arrInfluenciado ?? 0,
          creadoPorNombre: s.creadoPorNombre || 'Colaborador',
          creadoPorDepartamento: s.creadoPorDepartamento || 'Ventas',
          hasVoted: s.haVotado ?? false,
          scoreRice: s.scoreRice,
          createdAt: s.createdAt || new Date().toISOString(),
        }));
      }
      return MOCK_SUGGESTIONS;
    } catch {
      return MOCK_SUGGESTIONS;
    }
  },

  async toggleVote(suggestionId: number): Promise<{ totalVotos: number; hasVoted: boolean }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/feedback/sugerencias/${suggestionId}/votar`, {
        motivoVoto: 'Voto desde dispositivo móvil OpsHub',
      });
      const data = response.data?.data || response.data;
      return {
        totalVotos: data.totalVotos ?? 1,
        hasVoted: data.haVotado ?? true,
      };
    } catch {
      const found = MOCK_SUGGESTIONS.find((s) => s.id === suggestionId);
      if (found) {
        found.hasVoted = !found.hasVoted;
        found.totalVotos += found.hasVoted ? 1 : -1;
        return { totalVotos: found.totalVotos, hasVoted: found.hasVoted };
      }
      return { totalVotos: 1, hasVoted: true };
    }
  },
};
