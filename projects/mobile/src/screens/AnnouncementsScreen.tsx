import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Activity,
  GitBranch,
  TriangleAlert,
  CheckCircle2,
  Server,
  Cloud,
} from 'lucide-react-native';
import { AppStackParamList } from '../types/navigation';
import { ComunicadoSistema, ChangelogRelease } from '../types/announcements';
import { ServiceHealth } from '../types/operations';
import { announcementsApi } from '../api/announcementsApi';
import { operationsApi } from '../api/operationsApi';

type AnnouncementsNavProp = NativeStackNavigationProp<AppStackParamList, 'Announcements'>;

export const AnnouncementsScreen: React.FC = () => {
  const navigation = useNavigation<AnnouncementsNavProp>();
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'HEALTH' | 'CHANGELOG'>('ALERTS');
  const [announcements, setAnnouncements] = useState<ComunicadoSistema[]>([]);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [changelogs, setChangelogs] = useState<ChangelogRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [annData, healthData, changeData] = await Promise.all([
        announcementsApi.getActiveAnnouncements(),
        operationsApi.getHealthStatus(),
        announcementsApi.getChangelogs(),
      ]);
      setAnnouncements(annData);
      setServices(healthData.services);
      setChangelogs(changeData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={16} color="#818CF8" />
          <Text style={styles.backButtonText}>Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Operaciones & Cloud</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs Selector */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ALERTS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('ALERTS')}
        >
          <Bell size={14} color={activeTab === 'ALERTS' ? '#818CF8' : '#94A3B8'} />
          <Text style={[styles.tabText, activeTab === 'ALERTS' && styles.tabTextActive]}>
            Avisos ({announcements.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'HEALTH' && styles.tabButtonActive]}
          onPress={() => setActiveTab('HEALTH')}
        >
          <Activity size={14} color={activeTab === 'HEALTH' ? '#10B981' : '#94A3B8'} />
          <Text style={[styles.tabText, activeTab === 'HEALTH' && styles.tabTextActive]}>
            AWS Cloud
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'CHANGELOG' && styles.tabButtonActive]}
          onPress={() => setActiveTab('CHANGELOG')}
        >
          <GitBranch size={14} color={activeTab === 'CHANGELOG' ? '#38BDF8' : '#94A3B8'} />
          <Text style={[styles.tabText, activeTab === 'CHANGELOG' && styles.tabTextActive]}>
            Changelog
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando información del sistema...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366F1"
            />
          }
        >
          {/* TAB 1: COMUNICADOS ACTIVOS */}
          {activeTab === 'ALERTS' && (
            <View style={styles.section}>
              {announcements.map((ann) => (
                <View key={ann.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.alertTypeBadge}>
                      <TriangleAlert size={14} color="#F59E0B" />
                      <Text style={styles.alertTypeText}>{ann.tipoNombre}</Text>
                    </View>
                    <Text style={styles.dateText}>{ann.fechaPublicacion}</Text>
                  </View>
                  <Text style={styles.annTitle}>{ann.titulo}</Text>
                  <Text style={styles.annContent}>{ann.contenido}</Text>
                  <Text style={styles.authorText}>Emitido por: {ann.publicadoPorNombre}</Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: ESTADO DE SERVICIOS */}
          {activeTab === 'HEALTH' && (
            <View style={styles.section}>
              <View style={styles.cloudHeaderBox}>
                <Cloud size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cloudHeaderTitle}>Estado de los Servicios</Text>
                  <Text style={styles.cloudHeaderSub}>
                    Monitoreo de disponibilidad en tiempo real
                  </Text>
                </View>
              </View>

              {services.map((svc) => (
                <View key={svc.id} style={styles.serviceCard}>
                  <View style={styles.serviceTop}>
                    <View style={styles.serviceNameRow}>
                      <Server size={16} color="#818CF8" />
                      <Text style={styles.serviceName}>{svc.nombre}</Text>
                    </View>
                    <View style={styles.statusPill}>
                      <CheckCircle2 size={13} color="#10B981" />
                      <Text style={styles.statusPillText}>{svc.estado}</Text>
                    </View>
                  </View>

                  <Text style={styles.serviceDesc}>{svc.descripcion}</Text>

                  <View style={styles.serviceMetrics}>
                    <Text style={styles.metricItemText}>Latencia: {svc.latenciaMs} ms</Text>
                    <Text style={styles.metricItemText}>Uptime: {svc.uptimeMensual}%</Text>
                    <Text style={styles.metricItemText}>{svc.regionAws}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: CHANGELOG DE VERSIONES */}
          {activeTab === 'CHANGELOG' && (
            <View style={styles.section}>
              {changelogs.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.versionBadge}>
                      <Text style={styles.versionText}>{item.version}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.fechaLanzamiento}</Text>
                  </View>
                  <Text style={styles.annTitle}>{item.titulo}</Text>
                  <Text style={styles.annContent}>{item.notas}</Text>
                  <Text style={styles.authorText}>Redactado por: {item.redactadoPorNombre}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '600',
  },
  screenTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0F172A',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#F8FAFC',
  },
  container: {
    padding: 16,
  },
  section: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertTypeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  versionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    color: '#64748B',
    fontSize: 11,
  },
  annTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  annContent: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  authorText: {
    color: '#64748B',
    fontSize: 11,
  },
  cloudHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 4,
  },
  cloudHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  cloudHeaderSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  serviceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serviceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  serviceDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  serviceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  metricItemText: {
    color: '#64748B',
    fontSize: 11,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
