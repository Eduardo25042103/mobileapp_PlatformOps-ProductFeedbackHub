export interface ComunicadoSistema {
  id: number;
  titulo: string;
  contenido: string;
  tipoCodigo: 'MANTENIMIENTO' | 'INCIDENCIA' | 'ACTUALIZACION' | 'INFORMATIVO';
  tipoNombre: string;
  afectaServicio: boolean;
  esVigente: boolean;
  publicadoPorNombre: string;
  fechaPublicacion: string;
  fechaExpiracion?: string;
}

export interface ChangelogRelease {
  id: number;
  version: string;
  titulo: string;
  notas: string;
  tipoRelease: string;
  redactadoPorNombre: string;
  fechaLanzamiento: string;
}
