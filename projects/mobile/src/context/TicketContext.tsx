import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import {
  Ticket,
  CreateTicketInput,
  UpdateTicketInput,
} from '../types/ticket';
import { ticketsApi } from '../api/ticketsApi';

// ============================================================================
// 1. Tipos de Estado y Acciones para el Reducer (Lógica CRUD en Memoria)
// ============================================================================
interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

type TicketAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Ticket[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'DELETE_TICKET'; payload: string };

const initialState: TicketState = {
  tickets: [],
  loading: true,
  error: null,
};

// ============================================================================
// 2. Reducer para manejar las transiciones de estado del CRUD
// ============================================================================
function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
      };

    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ============================================================================
// 3. Contrato del Context API
// ============================================================================
interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  refreshTickets: () => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  createTicket: (input: CreateTicketInput) => Promise<Ticket>;
  updateTicket: (id: string, input: UpdateTicketInput) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<boolean>;
  simulateExternalConflict: (id: string) => Promise<number>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// ============================================================================
// 4. Provider de Incidencias con useReducer + Context API
// ============================================================================
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await ticketsApi.getTickets();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err.message || 'Error al cargar tickets',
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const refreshTickets = async () => {
    try {
      const data = await ticketsApi.getTickets();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err.message || 'Error al refrescar tickets',
      });
    }
  };

  const getTicketById = (id: string) => {
    return state.tickets.find((t) => t.id === id);
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
        error: state.error,
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
