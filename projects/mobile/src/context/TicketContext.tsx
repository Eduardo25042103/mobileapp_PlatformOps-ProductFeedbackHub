import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import {
  Ticket,
  CreateTicketInput,
  UpdateTicketInput,
} from '../types/ticket';
import { ticketsApi } from '../api/ticketsApi';

// ============================================================================
// 1. Tipos de Estado y Acciones para el Reducer (CRUD + Tiempo Real)
// ============================================================================
interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string;
}

type TicketAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Ticket[] }
  | { type: 'SILENT_SYNC'; payload: Ticket[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'DELETE_TICKET'; payload: string };

const initialState: TicketState = {
  tickets: [],
  loading: true,
  refreshing: false,
  error: null,
  lastUpdated: new Date().toLocaleTimeString(),
};

function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: state.tickets.length === 0, refreshing: true, error: null };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        refreshing: false,
        tickets: action.payload,
        lastUpdated: new Date().toLocaleTimeString(),
      };

    case 'SILENT_SYNC':
      return {
        ...state,
        tickets: action.payload,
        lastUpdated: new Date().toLocaleTimeString(),
      };

    case 'LOAD_ERROR':
      return { ...state, loading: false, refreshing: false, error: action.payload };

    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        lastUpdated: new Date().toLocaleTimeString(),
      };

    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        lastUpdated: new Date().toLocaleTimeString(),
      };

    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter((t) => t.id !== action.payload),
        lastUpdated: new Date().toLocaleTimeString(),
      };

    default:
      return state;
  }
}

// ============================================================================
// 2. Contrato del Context API
// ============================================================================
interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string;
  refreshTickets: () => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  createTicket: (input: CreateTicketInput) => Promise<Ticket>;
  updateTicket: (id: string, input: UpdateTicketInput) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<boolean>;
  simulateExternalConflict: (id: string) => Promise<number>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// ============================================================================
// 3. Provider de Incidencias con Polling Reactivo en Tiempo Real
// ============================================================================
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTickets = async (isManual = false) => {
    if (isManual) {
      dispatch({ type: 'LOAD_START' });
    }
    try {
      const data = await ticketsApi.getTickets();
      if (isManual || state.tickets.length === 0) {
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'SILENT_SYNC', payload: data });
      }
    } catch (err: any) {
      if (isManual) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: err.message || 'Error al conectar con AWS',
        });
      }
    }
  };

  useEffect(() => {
    fetchTickets(true);

    // Live Reactive Polling: Sincroniza cada 25 segundos con AWS Lambda & RDS MySQL
    pollingRef.current = setInterval(() => {
      fetchTickets(false);
    }, 25000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const refreshTickets = async () => {
    await fetchTickets(true);
  };

  const getTicketById = (id: string) => {
    return state.tickets.find((t) => t.id === id || String(t.numericId) === id);
  };

  const createTicket = async (input: CreateTicketInput): Promise<Ticket> => {
    const newTicket = await ticketsApi.createTicket(input);
    dispatch({ type: 'ADD_TICKET', payload: newTicket });
    return newTicket;
  };

  const updateTicket = async (
    id: string,
    input: UpdateTicketInput
  ): Promise<Ticket> => {
    const updated = await ticketsApi.updateTicket(id, input);
    dispatch({ type: 'UPDATE_TICKET', payload: updated });
    return updated;
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    const success = await ticketsApi.deleteTicket(id);
    if (success) {
      dispatch({ type: 'DELETE_TICKET', payload: id });
    }
    return success;
  };

  const simulateExternalConflict = async (id: string): Promise<number> => {
    const newVer = await ticketsApi.simulateExternalConcurrentModification(id);
    await refreshTickets();
    return newVer;
  };

  return (
    <TicketContext.Provider
      value={{
        tickets: state.tickets,
        loading: state.loading,
        refreshing: state.refreshing,
        error: state.error,
        lastUpdated: state.lastUpdated,
        refreshTickets,
        getTicketById,
        createTicket,
        updateTicket,
        deleteTicket,
        simulateExternalConflict,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets debe usarse dentro de un TicketProvider');
  }
  return context;
};
