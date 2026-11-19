import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ClientSaas } from '../types/client';

const MOCK_CLIENTS: ClientSaas[] = [
  {
    id: 1,
    ruc: '20601234567',
    razonSocial: 'Acme Logistics SaaS S.A.C.',
    nombreComercial: 'Acme Logistics SaaS',
    planId: 1,
    planCodigo: 'ENTERPRISE',
    planNombre: 'Plan Enterprise Corporativo',
    montoAnualContratado: 28500,
    estadoCuenta: 'ACTIVO',
    fechaRegistro: '2026-01-15T00:00:00Z',
    direccionFiscal: 'Av. Rivera Navarrete 501, San Isidro, Lima',
    totalTickets: 14,
    csatAverage: 4.8,
    churnRisk: 'ALTO',
    healthScore: 78,
    contactos: [
      {
        id: 1,
        clienteId: 1,
        nombre: 'Ing. Rodrigo Paz',
        cargo: 'CTO & DevOps Lead',
        email: 'rodrigo.paz@acmelogistics.pe',
        telefono: '+51 987 654 321',
        esPrincipal: true,
      },
    ],
  },
  {
    id: 2,
    ruc: '20509876543',
    razonSocial: 'Fintech Solutions del Perú S.A.C.',
    nombreComercial: 'Fintech Solutions S.A.C.',
    planId: 2,
    planCodigo: 'PROFESSIONAL',
    planNombre: 'Plan Profesional',
    montoAnualContratado: 14200,
    estadoCuenta: 'ACTIVO',
    fechaRegistro: '2026-02-20T00:00:00Z',
    direccionFiscal: 'Calle Las Camelias 280, San Isidro, Lima',
    totalTickets: 8,
    csatAverage: 4.9,
    churnRisk: 'BAJO',
    healthScore: 94,
    contactos: [
      {
        id: 2,
        clienteId: 2,
        nombre: 'Valeria Morales',
        cargo: 'Gerente de Operaciones',
        email: 'vmorales@fintechperu.pe',
        telefono: '+51 912 345 678',
        esPrincipal: true,
      },
    ],
  },
  {
    id: 3,
    ruc: '20401122334',
    razonSocial: 'Grupo Comercial Andino S.A.',
    nombreComercial: 'Grupo Comercial Andino',
    planId: 1,
    planCodigo: 'ENTERPRISE',
    planNombre: 'Plan Enterprise Corporativo',
    montoAnualContratado: 32000,
    estadoCuenta: 'ACTIVO',
    fechaRegistro: '2025-11-10T00:00:00Z',
    direccionFiscal: 'Av. Javier Prado Este 444, San Borja, Lima',
    totalTickets: 21,
    csatAverage: 4.7,
    churnRisk: 'MEDIO',
    healthScore: 82,
    contactos: [
      {
        id: 3,
        clienteId: 3,
        nombre: 'Carlos Arana',
        cargo: 'Jefe de Sistemas',
        email: 'carana@grupoandino.com.pe',
        telefono: '+51 945 678 123',
        esPrincipal: true,
      },
    ],
  },
  {
    id: 4,
    ruc: '20309988776',
    razonSocial: 'Retail Fast Express E.I.R.L.',
    nombreComercial: 'Retail Fast Express',
    planId: 3,
    planCodigo: 'STARTER',
    planNombre: 'Plan Starter',
    montoAnualContratado: 4800,
    estadoCuenta: 'ACTIVO',
    fechaRegistro: '2026-03-01T00:00:00Z',
    direccionFiscal: 'Av. Colonial 1200, Callao',
    totalTickets: 3,
    csatAverage: 5.0,
    churnRisk: 'BAJO',
    healthScore: 98,
    contactos: [
      {
        id: 4,
        clienteId: 4,
        nombre: 'Marcos Mendoza',
        cargo: 'Administrador General',
        email: 'mmendoza@retailfast.pe',
        telefono: '+51 998 765 432',
        esPrincipal: true,
      },
    ],
  },
];

export const clientsApi = {
  async getClients(): Promise<ClientSaas[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/clients');
      const raw = response.data?.data || response.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((c) => ({
          id: c.id,
          ruc: c.ruc,
          razonSocial: c.razonSocial,
          nombreComercial: c.nombreComercial || c.razonSocial,
          planId: c.planId,
          planCodigo: c.planCodigo || 'ENTERPRISE',
          planNombre: c.planNombre || 'Plan Corporativo',
          montoAnualContratado: c.montoAnualContratado || 0,
          estadoCuenta: c.estadoCuenta || 'ACTIVO',
          fechaRegistro: c.fechaRegistro || c.createdAt || new Date().toISOString(),
          direccionFiscal: c.direccionFiscal || 'Lima, Perú',
          totalTickets: c.totalTickets ?? (c.tickets?.length || 0),
          csatAverage: c.csatAverage || 4.8,
          churnRisk: c.churnRisk || (c.montoAnualContratado > 20000 ? 'ALTO' : 'BAJO'),
          healthScore: c.healthScore || 85,
          contactos: Array.isArray(c.contactos)
            ? c.contactos.map((cto: any) => ({
                id: cto.id,
                clienteId: cto.clienteId,
                nombre: cto.nombre,
                cargo: cto.cargo || 'Contacto',
                email: cto.email,
                telefono: cto.telefono || '+51 900 000 000',
                esPrincipal: cto.esPrincipal ?? false,
              }))
            : [],
        }));
      }
      return MOCK_CLIENTS;
    } catch {
      return MOCK_CLIENTS;
    }
  },
};
