import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

type HomeNavProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeNavProp>();
  const [pulse] = useState(new Animated.Value(1));
  const [kpiTickets, setKpiTickets] = useState(14);

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
  }, []);

  const getDeptLabel = (dept?: string) => {
    switch (dept) {
      case 'TI_DESARROLLO':
        return 'TI / Desarrollo';
      case 'SOPORTE':
        return 'Soporte Técnico';
      case 'VENTAS':
        return 'Ventas SaaS';
      case 'MARKETING':
        return 'Marketing / Prod';
      default:
        return 'Operaciones';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Identity & Logout Header */}
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.nombre || 'Usuario Conectado'}</Text>
              <View style={styles.deptPill}>
                <Text style={styles.deptPillText}>{getDeptLabel(user?.departamento)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Live SSE Banner */}
        <View style={styles.sseCard}>
          <View style={styles.sseStatus}>
            <Animated.View style={[styles.pulseDot, { opacity: pulse }]} />
            <Text style={styles.sseTitle}>CANAL SSE ACTIVO</Text>
          </View>
          <Text style={styles.sseSub}>
            Escuchando eventos de AWS App Runner en tiempo real
          </Text>
        </View>

        {/* Critical Maintenance / Incident Banner */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Mantenimiento Programado</Text>
            <Text style={styles.alertDesc}>
              Reindexación de base de datos PostgreSQL a las 23:00 UTC. La latencia podría aumentar brevemente.
            </Text>
          </View>
        </View>

        {/* KPI Grid */}
        <Text style={styles.sectionTitle}>MÉTRICAS DEL SISTEMA</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>TOTAL ABIERTOS</Text>
            <Text style={styles.kpiNumber}>{kpiTickets}</Text>
            <Text style={styles.kpiNote}>Actualizado vía SSE</Text>
          </View>

          <View style={[styles.kpiCard, styles.kpiCardP1]}>
            <Text style={[styles.kpiLabel, { color: '#EF4444' }]}>P1 CRÍTICOS</Text>
            <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>2</Text>
            <Text style={[styles.kpiNote, { color: 'rgba(239, 68, 68, 0.7)' }]}>
              Atención prioritaria
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>ASIGNADOS A MÍ</Text>
            <Text style={styles.kpiNumber}>4</Text>
            <Text style={styles.kpiNote}>En diagnóstico</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>CUMPLIMIENTO SLA</Text>
            <Text style={[styles.kpiNumber, { color: '#10B981' }]}>96.4%</Text>
            <Text style={styles.kpiNote}>Meta mensual</Text>
          </View>
        </View>

        {/* Quick Operations */}
        <Text style={styles.sectionTitle}>ACCIONES OPERATIVAS</Text>
        <View style={styles.actions}>
          <Button
            title="+ Reportar Nueva Incidencia (S3)"
            onPress={() => navigation.navigate('TicketForm')}
            style={{ marginBottom: 10 }}
          />
          <Button
            title="Explorar Bandeja de Tickets"
            variant="secondary"
            onPress={() => navigation.navigate('TicketList', undefined)}
          />
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
    padding: 20,
    backgroundColor: '#0F172A',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  deptPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: 2,
  },
  deptPillText: {
    color: '#06B6D4',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },
  sseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  sseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  sseTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  sseSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 20,
    gap: 10,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
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
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  kpiNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  kpiNote: {
    fontSize: 10,
    color: '#64748B',
  },
  actions: {
    marginBottom: 20,
  },
});
