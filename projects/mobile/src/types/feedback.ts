export interface SugerenciaProducto {
  id: number;
  titulo: string;
  descripcion: string;
  modulo: string;
  estado: 'RECIBIDA' | 'EN_EVALUACION' | 'PLANIFICADA' | 'EN_DESARROLLO' | 'LANZADA' | 'DESCARTADA';
  totalVotos: number;
  arrInfluenciado: number;
  creadoPorNombre: string;
  creadoPorDepartamento: string;
  hasVoted?: boolean;
  scoreRice?: number;
  createdAt: string;
}
