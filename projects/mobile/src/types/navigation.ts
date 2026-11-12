export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  TicketList: { filterPriority?: string; filterStatus?: string } | undefined;
  TicketDetail: { ticketId: string };
  TicketForm: undefined;
};
