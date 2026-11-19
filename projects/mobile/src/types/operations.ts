export interface ServiceHealth {
  id: string;
  nombre: string;
  categoria: string;
  estado: 'OPERACIONAL' | 'DEGRADADO' | 'CAIDO';
  latenciaMs: number;
  regionAws: string;
  uptimeMensual: number;
  descripcion: string;
}

export interface PlanSlaBreakdown {
  planCodigo: string;
  planNombre: string;
  slaHorasMaximo: number;
  cumplimientoPct: number;
  totalTickets: number;
  mttrHoras: number;
}

export interface SlaSummary {
  metaCumplimientoPct: number;
  cumplimientoRealPct: number;
  totalEvaluados: number;
  ticketsDentroSla: number;
  ticketsFueraSla: number;
  mttrMinutosPromedio: number;
  desglosePorPlan: PlanSlaBreakdown[];
}
