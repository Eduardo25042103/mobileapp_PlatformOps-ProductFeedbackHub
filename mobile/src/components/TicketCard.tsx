import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ticket } from '../types/ticket';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      onPress={onPress}
    >
      {/* Top Meta: Code, Badges, Version */}
      <View style={styles.topRow}>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{ticket.codigo}</Text>
          <View style={styles.versionTag}>
            <Text style={styles.versionText}>v{ticket.version}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <PriorityBadge priority={ticket.prioridad} size="sm" />
          <StatusBadge status={ticket.estado} size="sm" />
        </View>
      </View>

      {/* Main Title */}
      <Text style={styles.title} numberOfLines={2}>
        {ticket.titulo}
      </Text>

      {/* Client & Category Info */}
      <View style={styles.clientRow}>
        <Text style={styles.clientText}>
          🏢 {ticket.clienteNombre}
        </Text>
        <Text style={styles.planText}>({ticket.clientePlan})</Text>
      </View>

      {/* Footer Info: Author / Assignee, Attachments, Date */}
      <View style={styles.footerRow}>
        <Text style={styles.assignedText}>
          👤 {ticket.asignadoA ? `Dev: ${ticket.asignadoA}` : `Por: ${ticket.reportadoPor}`}
        </Text>

        <View style={styles.footerRight}>
          {ticket.adjuntos.length > 0 && (
            <View style={styles.attachmentBadge}>
              <Text style={styles.attachmentText}>📎 {ticket.adjuntos.length}</Text>
            </View>
          )}
          <Text style={styles.timeText}>{ticket.createdAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  code: {
    fontFamily: 'monospace',
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  versionTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  versionText: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  clientText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  planText: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
    paddingTop: 8,
  },
  assignedText: {
    color: '#64748B',
    fontSize: 11,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attachmentText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  timeText: {
    color: '#64748B',
    fontSize: 11,
  },
});
