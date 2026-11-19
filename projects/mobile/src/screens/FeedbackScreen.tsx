import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  ThumbsUp,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import { AppStackParamList } from '../types/navigation';
import { SugerenciaProducto } from '../types/feedback';
import { feedbackApi } from '../api/feedbackApi';

type FeedbackNavProp = NativeStackNavigationProp<AppStackParamList, 'Feedback'>;

export const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation<FeedbackNavProp>();
  const [suggestions, setSuggestions] = useState<SugerenciaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [votingId, setVotingId] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    try {
      const data = await feedbackApi.getSuggestions();
      setSuggestions(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSuggestions();
  };

  const handleVote = async (id: number) => {
    setVotingId(id);
    try {
      const result = await feedbackApi.toggleVote(id);
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, totalVotos: result.totalVotos, hasVoted: result.hasVoted }
            : s
        )
      );
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo procesar tu voto: ' + e.message);
    } finally {
      setVotingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANIFICADA':
        return '#38BDF8';
      case 'EN_DESARROLLO':
        return '#818CF8';
      case 'LANZADA':
        return '#10B981';
      case 'DESCARTADA':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const renderItem = ({ item }: { item: SugerenciaProducto }) => {
    const isVotingThis = votingId === item.id;

    return (
      <View style={styles.card}>
        {/* Encabezado con Módulo y Estado */}
        <View style={styles.cardHeader}>
          <View style={styles.moduleBadge}>
            <Text style={styles.moduleText}>{item.modulo}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { borderColor: getStatusColor(item.estado) },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.estado) },
              ]}
            >
              {item.estado}
            </Text>
          </View>
        </View>

        {/* Título y Descripción */}
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.description}>{item.descripcion}</Text>

        {/* Métricas de Impacto Comercial */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <TrendingUp size={13} color="#94A3B8" />
            <Text style={styles.metricText}>
              ARR Impactado: ${(item.arrInfluenciado || 0).toLocaleString()}
            </Text>
          </View>
          {item.scoreRice ? (
            <View style={styles.metricItem}>
              <Sparkles size={13} color="#F59E0B" />
              <Text style={styles.metricText}>Score RICE: {item.scoreRice}</Text>
            </View>
          ) : null}
        </View>

        {/* Footer con Autor y Botón de Votación Táctil */}
        <View style={styles.footerRow}>
          <Text style={styles.authorText}>
            Por {item.creadoPorNombre} ({item.creadoPorDepartamento})
          </Text>

          <TouchableOpacity
            style={[
              styles.voteButton,
              item.hasVoted && styles.voteButtonActive,
            ]}
            onPress={() => handleVote(item.id)}
            disabled={isVotingThis}
          >
            {isVotingThis ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <ThumbsUp
                  size={15}
                  color={item.hasVoted ? '#FFFFFF' : '#818CF8'}
                />
                <Text
                  style={[
                    styles.voteCount,
                    item.hasVoted && styles.voteCountActive,
                  ]}
                >
                  {item.totalVotos}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <Text style={styles.screenTitle}>Feedback & Roadmap</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Intro Banner */}
      <View style={styles.introBanner}>
        <Lightbulb size={20} color="#F59E0B" />
        <Text style={styles.introText}>
          Sugerencias de mejora y funcionalidades votadas por clientes y colaboradores.
        </Text>
      </View>

      {/* Lista */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando backlog de producto...</Text>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366F1"
            />
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
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  introText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 16,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  moduleText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  authorText: {
    color: '#64748B',
    fontSize: 11,
    flex: 1,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  voteButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  voteCount: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '700',
  },
  voteCountActive: {
    color: '#FFFFFF',
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
