import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { Ticket, TicketStatus } from '../types/ticket';
import { ticketsApi } from '../api/ticketsApi';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';

type TicketDetailRouteProp = RouteProp<AppStackParamList, 'TicketDetail'>;
type TicketDetailNavProp = NativeStackNavigationProp<AppStackParamList, 'TicketDetail'>;

export const TicketDetailScreen: React.FC = () => {
  const route = useRoute<TicketDetailRouteProp>();
  const navigation = useNavigation<TicketDetailNavProp>();
  const { ticketId } = route.params;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(null);
  const [newComment, setNewComment] = useState('');

  // Estados para Demostración del Bloqueo Optimista (HTTP 409)
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictServerVersion, setConflictServerVersion] = useState<number>(2);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketsApi.getTicketById(ticketId);
      setTicket(data);
      setSelectedStatus(data.estado);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  // Guardar cambios aplicando la validación de versión (Optimistic Locking)
  const handleSaveChanges = async () => {
    if (!ticket) return;

    setSaving(true);
    try {
      const updated = await ticketsApi.updateTicket(ticket.id, {
        estado: selectedStatus || ticket.estado,
        version: ticket.version, // Enviamos la versión que el cliente conoce
        nuevoComentario: newComment.trim() || undefined,
      });

      setTicket(updated);
      setSelectedStatus(updated.estado);
      setNewComment('');
      Alert.alert('Éxito', `Ticket ${ticket.codigo} actualizado a v${updated.version}`);
    } catch (err: any) {
      // Capturamos el error 409 (Conflicto de Concurrencia)
      if (err.response?.status === 409 || err.message?.includes('409')) {
        const sVersion = err.response?.data?.serverVersion || ticket.version + 1;
        setConflictServerVersion(sVersion);
        setShowConflictModal(true);
      } else {
        Alert.alert('Error al guardar', err.message || 'Error en el servidor');
      }
    } finally {
      setSaving(false);
    }
  };

  // Simulación para fines académicos: Otro usuario modifica el ticket remotamente
  const handleSimulateExternalConflict = async () => {
    if (!ticket) return;
    const newServerVer = await ticketsApi.simulateExternalConcurrentModification(ticket.id);
    Alert.alert(
      'Simulación Ejecutada',
      `Otro desarrollador acaba de guardar cambios en este ticket desde otro equipo.\n\n` +
        `• Versión en Servidor: v${newServerVer}\n` +
        `• Versión en tu teléfono: v${ticket.version}\n\n` +
        `Ahora presiona "Guardar Cambios" para ver la respuesta HTTP 409 (Conflicto).`
    );
  };

  if (loading || !ticket) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando detalle del incidente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <View style={styles.versionBadge}>
            <Text style={styles.versionBadgeText}>Versión: v{ticket.version}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Ticket Header Card */}
        <View style={styles.ticketCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.ticketCode}>{ticket.codigo}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <PriorityBadge priority={ticket.prioridad} />
              <StatusBadge status={ticket.estado} />
            </View>
          </View>

          <Text style={styles.ticketTitle}>{ticket.titulo}</Text>

          {/* Metadata Grid */}
          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Cliente SaaS:</Text>
              <Text style={styles.metaValue}>
                {ticket.clienteNombre} ({ticket.clientePlan})
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Categoría:</Text>
              <Text style={styles.metaValue}>{ticket.categoria}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Asignado a:</Text>
              <Text style={styles.metaValue}>{ticket.asignadoA || 'Sin asignar'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Reportado por:</Text>
              <Text style={styles.metaValue}>{ticket.reportadoPor}</Text>
            </View>
          </View>
        </View>

        {/* Description & Logs */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DESCRIPCIÓN TÉCNICA</Text>
          <Text style={styles.descriptionText}>{ticket.descripcion}</Text>

          {ticket.logsError && (
            <View style={styles.logContainer}>
              <Text style={styles.logTitle}>TRAZADO DE LOGS (AWS CloudWatch)</Text>
              <Text style={styles.logContent}>{ticket.logsError}</Text>
            </View>
          )}
        </View>

        {/* Attachments Section (S3 Preview) */}
        {ticket.adjuntos.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>CAPTURA ADJUNTA (Amazon S3)</Text>
            <View style={styles.attachmentBox}>
              <Image
                source={{ uri: ticket.adjuntos[0].url }}
                style={styles.attachmentImage}
                resizeMode="cover"
              />
              <View style={styles.attachmentFooter}>
                <Text style={styles.attachmentName}>
                  📎 {ticket.adjuntos[0].nombreArchivo}
                </Text>
                <Text style={styles.attachmentSize}>
                  {(ticket.adjuntos[0].tamanoBytes / 1024).toFixed(0)} KB • URL Prefirmada
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Change Status Segmented Control */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CAMBIAR ESTADO OPERATIVO</Text>
          <View style={styles.statusGrid}>
            {(['EN_DIAGNOSTICO', 'EN_DESARROLLO', 'EN_QA', 'RESUELTO'] as TicketStatus[]).map(
              (st) => {
                const isSelected = selectedStatus === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.statusOption, isSelected && styles.statusOptionSelected]}
                    onPress={() => setSelectedStatus(st)}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        isSelected && styles.statusOptionTextSelected,
                      ]}
                    >
                      {st.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {/* Add comment */}
          <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
            AGREGAR NOTA TÉCNICA AL TICKET
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe una observación para Soporte / TI..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            value={newComment}
            onChangeText={setNewComment}
          />

          {/* Save Action */}
          <Button
            title="Guardar Cambios (Control de Versión)"
            onPress={handleSaveChanges}
            loading={saving}
            style={{ marginTop: 12 }}
          />

          {/* Simulator Button for Evaluation Demo */}
          <TouchableOpacity
            style={styles.simulateConflictBtn}
            activeOpacity={0.8}
            onPress={handleSimulateExternalConflict}
          >
            <Text style={styles.simulateConflictText}>
              ⚡ Simular Modificación Externa (Probar Conflicto 409)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Discussion Thread */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            HISTORIAL DE DISCUSIÓN ({ticket.comentarios.length})
          </Text>
          {ticket.comentarios.map((c) => (
            <View key={c.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{c.autorNombre}</Text>
                <Text style={styles.commentDept}>[{c.autorDepartamento}]</Text>
                <Text style={styles.commentTime}>{c.createdAt}</Text>
              </View>
              <Text style={styles.commentBody}>{c.contenido}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODAL DE DEMOSTRACIÓN DE BLOQUEO OPTIMISTA (HTTP 409 CONFLICT)            */}
      {/* ========================================================================= */}
      <Modal
        visible={showConflictModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConflictModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.conflictCard}>
            <View style={styles.conflictIconCircle}>
              <Text style={styles.conflictIcon}>⚠️</Text>
            </View>

            <Text style={styles.conflictTitle}>
              Conflicto de Concurrencia (HTTP 409)
            </Text>

            <Text style={styles.conflictBody}>
              El bloqueo optimista del backend ha rechazado la actualización porque otro
              usuario modificó este ticket simultáneamente.
            </Text>

            <View style={styles.versionComparison}>
              <View style={styles.versionBox}>
                <Text style={styles.versionBoxLabel}>TU PANTALLA</Text>
                <Text style={[styles.versionBoxVal, { color: '#EF4444' }]}>
                  v{ticket.version}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
              <View style={styles.versionBox}>
                <Text style={styles.versionBoxLabel}>SERVIDOR</Text>
                <Text style={[styles.versionBoxVal, { color: '#10B981' }]}>
                  v{conflictServerVersion}
                </Text>
              </View>
            </View>

            <Text style={styles.conflictHint}>
              Debes recargar la información más reciente para no sobreescribir el trabajo
              ajeno.
            </Text>

            <Button
              title="🔄 Recargar Datos del Servidor"
              onPress={() => {
                setShowConflictModal(false);
                fetchTicket();
              }}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  versionBadgeText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '700',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 13,
  },
  ticketCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketCode: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  ticketTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 14,
  },
  metaBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  metaValue: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  descriptionText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
  logContainer: {
    backgroundColor: '#080D1A',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logTitle: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  logContent: {
    color: '#94A3B8',
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 15,
  },
  attachmentBox: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
  },
  attachmentImage: {
    width: '100%',
    height: 160,
  },
  attachmentFooter: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachmentName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '500',
  },
  attachmentSize: {
    color: '#64748B',
    fontSize: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  statusOptionText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  statusOptionTextSelected: {
    color: '#818CF8',
  },
  commentInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    color: '#F8FAFC',
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  simulateConflictBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  simulateConflictText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  commentDept: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '600',
  },
  commentTime: {
    color: '#64748B',
    fontSize: 10,
    marginLeft: 'auto',
  },
  commentBody: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  conflictCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  conflictIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  conflictIcon: {
    fontSize: 24,
  },
  conflictTitle: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  conflictBody: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  versionComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
    width: '100%',
  },
  versionBox: {
    alignItems: 'center',
  },
  versionBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  versionBoxVal: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  arrowIcon: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  conflictHint: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 18,
  },
});
