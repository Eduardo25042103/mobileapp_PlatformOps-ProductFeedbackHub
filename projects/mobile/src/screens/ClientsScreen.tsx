import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';
import { AppStackParamList } from '../types/navigation';
import { ClientSaas } from '../types/client';
import { clientsApi } from '../api/clientsApi';

type ClientsNavProp = NativeStackNavigationProp<AppStackParamList, 'Clients'>;

export const ClientsScreen: React.FC = () => {
  const navigation = useNavigation<ClientsNavProp>();
  const [clients, setClients] = useState<ClientSaas[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = async () => {
    try {
      const data = await clientsApi.getClients();
      setClients(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.nombreComercial.toLowerCase().includes(term) ||
      c.razonSocial.toLowerCase().includes(term) ||
      c.ruc.includes(term) ||
      c.planCodigo.toLowerCase().includes(term)
    );
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {});
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const renderClientItem = ({ item }: { item: ClientSaas }) => {
    const mainContact = item.contactos.find((cto) => cto.esPrincipal) || item.contactos[0];

    return (
      <View style={styles.card}>
        {/* Header con Nombre y Plan */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.clientName}>{item.nombreComercial}</Text>
            <Text style={styles.clientRuc}>RUC: {item.ruc}</Text>
          </View>
          <View style={[styles.planBadge, item.planCodigo === 'ENTERPRISE' ? styles.enterpriseBadge : styles.proBadge]}>
            <Text style={styles.planBadgeText}>{item.planNombre}</Text>
          </View>
        </View>

        {/* KPIs Rápidos del Cliente */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>${(item.montoAnualContratado || 0).toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>ARR Anual</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{item.healthScore}%</Text>
            <Text style={styles.kpiLabel}>Health Score</Text>
          </View>
          <View style={styles.kpiItem}>
            <View style={styles.churnRow}>
              {item.churnRisk === 'ALTO' ? (
                <ShieldAlert size={14} color="#EF4444" />
              ) : (
                <ShieldCheck size={14} color="#10B981" />
              )}
              <Text
                style={[
                  styles.churnText,
                  { color: item.churnRisk === 'ALTO' ? '#EF4444' : '#10B981' },
                ]}
              >
                {item.churnRisk}
              </Text>
            </View>
            <Text style={styles.kpiLabel}>Riesgo Churn</Text>
          </View>
        </View>

        {/* Contacto Principal con Acciones Táctiles */}
        {mainContact && (
          <View style={styles.contactBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{mainContact.nombre}</Text>
              <Text style={styles.contactCargo}>{mainContact.cargo}</Text>
            </View>

            <View style={styles.actionButtons}>
              {mainContact.telefono && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleCall(mainContact.telefono)}
                >
                  <Phone size={16} color="#818CF8" />
                </TouchableOpacity>
              )}
              {mainContact.email && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEmail(mainContact.email)}
                >
                  <Mail size={16} color="#818CF8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Superior */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={16} color="#818CF8" />
          <Text style={styles.backButtonText}>Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Clientes SaaS</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por RUC, empresa o plan..."
          placeholderTextColor="#64748B"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Lista de Empresas */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Consultando directorio en Amazon RDS...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderClientItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Building2 size={40} color="#475569" />
              <Text style={styles.emptyTitle}>No se encontraron clientes SaaS</Text>
            </View>
          }
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    padding: 0,
  },
  listContainer: {
    padding: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  clientRuc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  enterpriseBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  proBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  planBadgeText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  kpiItem: {
    alignItems: 'center',
    flex: 1,
  },
  kpiValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  kpiLabel: {
    color: '#64748B',
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  churnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  churnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  contactName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  contactCargo: {
    color: '#94A3B8',
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
