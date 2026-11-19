import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { AppStackParamList } from '../types/navigation';
import { TicketCategory, TicketPriority } from '../types/ticket';
import { ClientSaas } from '../types/client';
import { ticketsApi } from '../api/ticketsApi';
import { clientsApi } from '../api/clientsApi';
import { useTickets } from '../context/TicketContext';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Building2,
  Camera,
  Database,
  Lock,
  LucideIcon,
  Paperclip,
  PenTool,
  Printer,
  Settings,
  Zap,
} from 'lucide-react-native';

type TicketFormNavProp = NativeStackNavigationProp<AppStackParamList, 'TicketForm'>;

const CATEGORIES: { id: TicketCategory; label: string; icon: LucideIcon }[] = [
  { id: 'AUTENTICACION', label: 'Autenticación', icon: Lock },
  { id: 'FIRMA_ELECTRONICA', label: 'Firma Electrónica', icon: PenTool },
  { id: 'BASE_DE_DATOS', label: 'Base de Datos', icon: Database },
  { id: 'API', label: 'APIs & Webhooks', icon: Zap },
  { id: 'IMPRESION', label: 'Impresión', icon: Printer },
  { id: 'OTRO', label: 'Otros', icon: Settings },
];

const PRIORITIES: { id: TicketPriority; label: string; color: string; desc: string }[] = [
  { id: 'P1', label: 'P1 CRÍTICO', color: '#EF4444', desc: 'Servicio caído' },
  { id: 'P2', label: 'P2 ALTA', color: '#F59E0B', desc: 'Fallo bloqueante' },
  { id: 'P3', label: 'P3 MEDIA', color: '#3B82F6', desc: 'Degradación parcial' },
  { id: 'P4', label: 'P4 BAJA', color: '#94A3B8', desc: 'Detalle cosmético' },
];

export const TicketFormScreen: React.FC = () => {
  const navigation = useNavigation<TicketFormNavProp>();
  const { createTicket } = useTickets();

  const [titulo, setTitulo] = useState('');
  const [telefono, setTelefono] = useState('+51 987 654 321');
  const [categoria, setCategoria] = useState<TicketCategory>('AUTENTICACION');
  const [prioridad, setPrioridad] = useState<TicketPriority>('P1');
  const [descripcion, setDescripcion] = useState('');

  // Clientes SaaS dinámicos desde Amazon RDS
  const [clients, setClients] = useState<ClientSaas[]>([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);

  // Multimedia (Amazon S3 Presigned URL)
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const list = await clientsApi.getClients();
        setClients(list);
      } catch {
        // Fallback predeterminado
      }
    };
    loadClients();
  }, []);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Requerido',
          'Se requiere acceso a la galería para adjuntar capturas de pantalla de los errores.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo abrir la galería: ' + e.message);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa un título para la incidencia.');
      return;
    }
    if (!telefono.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa un teléfono de contacto del cliente.');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor describe el error y la traza encontrada.');
      return;
    }

    setSubmitting(true);
    let s3AttachmentUrl: string | undefined = undefined;
    let s3AttachmentName: string | undefined = undefined;
    let s3AttachmentSize: number | undefined = undefined;
    let s3KeyCreated: string | undefined = undefined;

    try {
      // 1. Si seleccionó imagen, ejecutar flujo S3 con Presigned URL
      if (selectedImage) {
        setUploadingS3(true);
        const fileName = selectedImage.fileName || `screenshot_${Date.now()}.jpg`;
        const mimeType = selectedImage.mimeType || 'image/jpeg';

        const { uploadUrl, fileKey } = await ticketsApi.getPresignedUploadUrl(
          fileName,
          mimeType
        );

        await ticketsApi.uploadFileToS3(uploadUrl, selectedImage.uri, mimeType);

        s3AttachmentUrl = selectedImage.uri;
        s3AttachmentName = fileName;
        s3AttachmentSize = selectedImage.fileSize || 180000;
        s3KeyCreated = fileKey;
        setUploadingS3(false);
      }

      // 2. Registra el ticket en AWS
      const currentClient = clients[selectedClientIndex] || {
        id: 1,
        nombreComercial: 'Acme Logistics SaaS',
        planNombre: 'Plan Enterprise',
      };

      const newTicket = await createTicket({
        clienteId: currentClient.id,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        telefono: telefono.trim(),
        categoria,
        prioridad,
        clienteNombre: currentClient.nombreComercial,
        clientePlan: currentClient.planNombre,
        adjuntoUrl: s3AttachmentUrl,
        adjuntoNombre: s3AttachmentName,
        adjuntoBytes: s3AttachmentSize,
        s3Key: s3KeyCreated,
      });

      Alert.alert(
        '¡Incidencia Creada con Éxito!',
        `Se ha registrado la incidencia ${newTicket.codigo} con prioridad ${newTicket.prioridad}.\n\n` +
          (selectedImage ? '• Captura adjunta guardada exitosamente.\n' : '') +
          '• Se ha notificado al equipo de soporte para su atención.',
        [
          {
            text: 'Ver en Bandeja',
            onPress: () => navigation.navigate('TicketList', undefined),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No fue posible crear la incidencia.');
    } finally {
      setSubmitting(false);
      setUploadingS3(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={16} color="#818CF8" />
            <Text style={styles.backButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reportar Incidencia</Text>
          <View style={{ width: 60 }} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Título de la Incidencia */}
            <Text style={styles.label}>TÍTULO DE LA INCIDENCIA</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Fallo 401 intermitente al firmar facturas"
              placeholderTextColor="#64748B"
              value={titulo}
              onChangeText={setTitulo}
            />

            {/* Selector de Cliente */}
            <Text style={styles.label}>EMPRESA / CLIENTE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientScroll}>
              {clients.map((c, index) => {
                const isSelected = selectedClientIndex === index;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.clientChip, isSelected && styles.clientChipSelected]}
                    onPress={() => {
                      setSelectedClientIndex(index);
                      if (c.contactos?.[0]?.telefono) {
                        setTelefono(c.contactos[0].telefono);
                      }
                    }}
                  >
                    <Building2 size={14} color={isSelected ? '#818CF8' : '#94A3B8'} />
                    <View>
                      <Text style={[styles.clientChipText, isSelected && styles.clientChipTextSelected]}>
                        {c.nombreComercial}
                      </Text>
                      <Text style={styles.clientPlanSub}>{c.planNombre}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Teléfono de Contacto */}
            <Text style={styles.label}>TELÉFONO DE CONTACTO</Text>
            <TextInput
              style={styles.input}
              placeholder="+51 987 654 321"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            {/* Nivel de Prioridad */}
            <Text style={styles.label}>PRIORIDAD</Text>
            <View style={styles.priorityGrid}>
              {PRIORITIES.map((p) => {
                const isSelected = prioridad === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.priorityCard,
                      isSelected && { borderColor: p.color, backgroundColor: `${p.color}15` },
                    ]}
                    onPress={() => setPrioridad(p.id)}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                    <Text style={[styles.priorityLabel, isSelected && { color: p.color }]}>
                      {p.label}
                    </Text>
                    <Text style={styles.priorityDesc}>{p.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Categoría */}
            <Text style={styles.label}>CATEGORÍA TÉCNICA</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = categoria === cat.id;
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => setCategoria(cat.id)}
                  >
                    <Icon size={16} color={isSelected ? '#818CF8' : '#94A3B8'} />
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Descripción y Traza */}
            <Text style={styles.label}>DESCRIPCIÓN DEL FALLO Y LOGS</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalla el escenario de reproducción, código HTTP y datos del pod..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
              value={descripcion}
              onChangeText={setDescripcion}
            />

            {/* Evidencia Adjunta */}
            <Text style={styles.label}>EVIDENCIA ADJUNTA (OPCIONAL)</Text>
            {selectedImage ? (
              <View style={styles.imagePreviewBox}>
                <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.removeImageText}>Cambiar Imagen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
                <Camera size={24} color="#818CF8" />
                <Text style={styles.uploadTitle}>Seleccionar de Galería o Cámara</Text>
                <Text style={styles.uploadSub}>
                  Adjunta una captura del error o pantalla (Máx 10 MB)
                </Text>
              </TouchableOpacity>
            )}

            {/* Botón de Envío */}
            <Button
              title={uploadingS3 ? 'Subiendo imagen...' : 'Registrar Incidencia'}
              onPress={handleSubmit}
              loading={submitting || uploadingS3}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    gap: 4,
  },
  backButtonText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  clientScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  clientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  clientChipSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  clientChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  clientChipTextSelected: {
    color: '#818CF8',
  },
  clientPlanSub: {
    color: '#64748B',
    fontSize: 10,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 10,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  priorityLabel: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  priorityDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  categoryCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  categoryTextSelected: {
    color: '#818CF8',
    fontWeight: '700',
  },
  uploadBox: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#6366F1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  uploadSub: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
  },
  imagePreviewBox: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageBtn: {
    marginTop: 10,
    paddingVertical: 4,
  },
  removeImageText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
