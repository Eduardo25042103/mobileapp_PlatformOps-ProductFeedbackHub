export interface ClientContact {
  id: number;
  clienteId: number;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  esPrincipal: boolean;
}

export interface ClientSaas {
  id: number;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  planId: number;
  planCodigo: string;
  planNombre: string;
  montoAnualContratado: number;
  estadoCuenta: string;
  fechaRegistro: string;
  direccionFiscal: string;
  totalTickets: number;
  csatAverage: number;
  churnRisk: 'ALTO' | 'MEDIO' | 'BAJO';
  healthScore: number;
  contactos: ClientContact[];
}
