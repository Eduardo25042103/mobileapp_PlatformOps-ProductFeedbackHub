import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TriangleAlert,
  Ticket as TicketIcon,
  PlusCircle,
  Building2,
  Lightbulb,
  Radio,
  CheckCircle2,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';
import { AppStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { announcementsApi } from '../api/announcementsApi';
import { operationsApi } from '../api/operationsApi';
import { ComunicadoSistema } from '../types/announcements';

type HomeNavProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeNavProp>();
  const [pulse] = useState(new Animated.Value(1));
  const { tickets, refreshTickets, refreshing, lastUpdated } = useTickets();
  const [activeAlert, setActiveAlert] = useState<ComunicadoSistema | null>(null);
  const [slaRate, setSlaRate] = useState<number>(96.4);

  const totalOpenTickets = tickets.filter(
    (t) => t.estado !== 'RESUELTO' && t.estado !== 'CERRADO'
  ).length;
  const p1CriticalTickets = tickets.filter((t) => t.prioridad === 'P1').length;

  const assignedToMe = tickets.filter((t) => {
    if (!user) return false;
    return (
      (t.asignadoAId && t.asignadoAId === user.id) ||
      (t.asignadoA && t.asignadoA.toLowerCase().includes(user.nombre.toLowerCase()))
    );
  }).length;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Consultar comunicado vigente y SLA
    const fetchAuxData = async () => {
      try {
        const [alerts, sla] = await Promise.all([
          announcementsApi.getActiveAnnouncements(),
          operationsApi.getSlaMetrics(),
        ]);
        if (alerts.length > 0) setActiveAlert(alerts[0]);
        if (sla?.cumplimientoRealPct) setSlaRate(sla.cumplimientoRealPct);
      } catch {
        // Fallback predeterminado
      }
    };
    fetchAuxData();
  }, []);

  const getRoleBadge = (rol?: string) => {
    switch (rol) {
      case 'ADMIN':
        return { label: 'Admin General', color: '#EF4444' };
      case 'DEV_INGENIERO':
      case 'DEV':
        return { label: 'Ingeniero TI', color: '#818CF8' };
      case 'AGENTE_SOPORTE':
      case 'SUPPORT_AGENT':
        return { label: 'Agente Soporte', color: '#10B981' };
      case 'EJECUTIVO_VENTAS':
      case 'SALES':
        return { label: 'Ventas SaaS', color: '#F59E0B' };
      case 'MARKETING_LEAD':
      case 'MARKETING':
        return { label: 'Marketing Lead', color: '#EC4899' };
      default:
        return { label: 'Operaciones', color: '#38BDF8' };
    }
  };

  const roleInfo = getRoleBadge(user?.rolCodigo || user?.rol);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTickets}
            tintColor="#6366F1"
          />
        }
      >
        {/* User Identity & Logout Header */}
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>
                {user?.nombre} {user?.apellido || ''}
              </Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.rolePill,
                    { borderColor: roleInfo.color, backgroundColor: `${roleInfo.color}15` },
                  ]}
                >
                  <Text style={[styles.rolePillText, { color: roleInfo.color }]}>
                    {roleInfo.label}
                  </Text>
                </View>
                <Text style={styles.deptText}>
                  {user?.departamentoNombre || user?.departamentoCodigo || 'TuNegocio.pe'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.7}
          >
            <LogOut size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Live Connectivity Banner */}
        <View style={styles.cloudCard}>
          <View style={styles.cloudStatusRow}>
            <Animated.View style={[styles.pulseDot, { opacity: pulse }]} />
            <Text style={styles.cloudTitle}>SISTEMA EN LÍNEA</Text>
          </View>
          <Text style={styles.cloudSub}>
            Conexión activa • Sincronizado a las {lastUpdated}
          </Text>
        </View>

        {/* Active Announcement / Maintenance Alert */}
        {activeAlert && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate('Announcements')}
            activeOpacity={0.85}
          >
            <View style={styles.alertIcon}>
              <TriangleAlert color="#F59E0B" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{activeAlert.titulo}</Text>
              <Text style={styles.alertDesc} numberOfLines={2}>
                {activeAlert.contenido}
              </Text>
            </View>
            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>
        )}

        {/* KPI Grid */}
        <Text style={styles.sectionTitle}>MÉTRICAS OPERATIVAS</Text>
        <View style={styles.kpiGrid}>
          <TouchableOpacity
            style={styles.kpiCard}
            onPress={() => navigation.navigate('TicketList', undefined)}
            activeOpacity={0.8}
          >
            <Text style={styles.kpiLabel}>TOTAL ABIERTOS</Text>
            <Text style={styles.kpiNumber}>{totalOpenTickets}</Text>
            <Text style={styles.kpiNote}>En flujo de atención</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.kpiCard, styles.kpiCardP1]}
            onPress={() => navigation.navigate('TicketList', { filterPriority: 'P1' })}
            activeOpacity={0.8}
          >
            <Text style={[styles.kpiLabel, { color: '#EF4444' }]}>P1 CRÍTICOS</Text>
            <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>{p1CriticalTickets}</Text>
            <Text style={[styles.kpiNote, { color: 'rgba(239, 68, 68, 0.7)' }]}>
              Atención inmediata
            </Text>
          </TouchableOpacity>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>ASIGNADOS A MÍ</Text>
            <Text style={styles.kpiNumber}>{assignedToMe}</Text>
            <Text style={styles.kpiNote}>Mis incidencias</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>CUMPLIMIENTO SLA</Text>
            <Text style={[styles.kpiNumber, { color: '#10B981' }]}>{slaRate}%</Text>
            <Text style={styles.kpiNote}>Meta mensual 95%</Text>
          </View>
        </View>

        {/* Operational Modules Navigation Menu */}
        <Text style={styles.sectionTitle}>MÓDULOS DE GESTIÓN</Text>
        <View style={styles.menuGrid}>
          {/* 1. Bandeja de Incidentes */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('TicketList', undefined)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <TicketIcon size={20} color="#818CF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Bandeja de Incidentes</Text>
              <Text style={styles.menuDesc}>
                Consulta, seguimiento y actualización de tickets técnicos
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          {/* 2. Crear Ticket */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('TicketForm')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <PlusCircle size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Reportar Incidencia</Text>
              <Text style={styles.menuDesc}>
                Registrar un nuevo ticket con evidencia fotográfica
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          {/* 3. Directorio Clientes SaaS */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Clients')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Building2 size={20} color="#38BDF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Clientes SaaS</Text>
              <Text style={styles.menuDesc}>
                Directorio de empresas, planes y contactos directos
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          {/* 4. Feedback & Sugerencias */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Feedback')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Lightbulb size={20} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Feedback & Roadmap</Text>
              <Text style={styles.menuDesc}>
                Sugerencias de mejora y votación de requerimientos
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          {/* 5. Comunicados & Estado */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Announcements')}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Radio size={20} color="#C084FC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Avisos & Estado</Text>
              <Text style={styles.menuDesc}>
                Comunicados oficiales, novedades y estado del servicio
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#0F172A',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  deptText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  cloudStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  cloudTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cloudSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  alertDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiCardP1: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  kpiLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kpiNumber: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 4,
  },
  kpiNote: {
    color: '#64748B',
    fontSize: 10,
  },
  menuGrid: {
    gap: 10,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  menuDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
