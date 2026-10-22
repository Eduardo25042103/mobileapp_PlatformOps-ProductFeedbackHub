import React, { useState } from 'react';
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
import { ticketsApi } from '../api/ticketsApi';
import { Button } from '../components/Button';

type TicketFormNavProp = NativeStackNavigationProp<AppStackParamList, 'TicketForm'>;

const CATEGORIES: { id: TicketCategory; label: string }[] = [
  { id: 'AUTENTICACION', label: '🔐 Autenticación' },
  { id: 'FIRMA_ELECTRONICA', label: '✍️ Firma Electrónica' },
  { id: 'BASE_DE_DATOS', label: '🗄️ Base de Datos' },
  { id: 'API', label: '⚡ APIs & Webhooks' },
  { id: 'IMPRESION', label: '🖨️ Impresión' },
  { id: 'OTRO', label: '⚙️ Otros' },
];

const PRIORITIES: { id: TicketPriority; label: string; color: string; desc: string }[] = [
  { id: 'P1', label: 'P1 CRÍTICO', color: '#EF4444', desc: 'Servicio caído' },
  { id: 'P2', label: 'P2 ALTA', color: '#F59E0B', desc: 'Fallo bloqueante' },
  { id: 'P3', label: 'P3 MEDIA', color: '#3B82F6', desc: 'Degradación parcial' },
  { id: 'P4', label: 'P4 BAJA', color: '#94A3B8', desc: 'Detalle cosmético' },
];

const SAAS_CLIENTS = [
  { nombre: 'Acme Logistics SaaS', plan: 'Plan Enterprise' },
  { nombre: 'Fintech Solutions S.A.C.', plan: 'Plan Pro' },
  { nombre: 'Grupo Comercial Andino', plan: 'Plan Enterprise' },
  { nombre: 'Retail Fast Express', plan: 'Plan Básico' },
];

export const TicketFormScreen: React.FC = () => {
  const navigation = useNavigation<TicketFormNavProp>();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<TicketCategory>('AUTENTICACION');
  const [prioridad, setPrioridad] = useState<TicketPriority>('P1');
  const [clienteIndex, setClienteIndex] = useState(0);
  const [descripcion, setDescripcion] = useState('');

  // Estado multimedia (Amazon S3)
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selector de imagen con expo-image-picker
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
    if (!descripcion.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor describe el error y la traza encontrada.');
      return;
    }

    setSubmitting(true);
    let s3AttachmentUrl: string | undefined = undefined;
    let s3AttachmentName: string | undefined = undefined;
    let s3AttachmentSize: number | undefined = undefined;

    try {
      // Si el usuario seleccionó una imagen, realizamos el flujo de subida S3
      if (selectedImage) {
        setUploadingS3(true);
        const fileName = selectedImage.fileName || `screenshot_${Date.now()}.jpg`;
        const mimeType = selectedImage.mimeType || 'image/jpeg';

        // 1. Pide URL prefirmada al backend
        const { uploadUrl, fileKey } = await ticketsApi.getPresignedUploadUrl(
          fileName,
          mimeType
        );

        // 2. Sube el binario directamente a Amazon S3
        await ticketsApi.uploadFileToS3(uploadUrl, selectedImage.uri, mimeType);

        s3AttachmentUrl = selectedImage.uri;
        s3AttachmentName = fileName;
        s3AttachmentSize = selectedImage.fileSize || 180000;
        setUploadingS3(false);
      }

      // 3. Registra el ticket
      const selectedClient = SAAS_CLIENTS[clienteIndex];
      const newTicket = await ticketsApi.createTicket({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        prioridad,
        clienteNombre: selectedClient.nombre,
        clientePlan: selectedClient.plan,
        adjuntoUrl: s3AttachmentUrl,
        adjuntoNombre: s3AttachmentName,
        adjuntoBytes: s3AttachmentSize,
      });

      Alert.alert(
        '¡Incidencia Creada con Éxito!',
        `Se ha registrado el ticket ${newTicket.codigo} (versión v1) con prioridad ${newTicket.prioridad}.\n\n` +
          (selectedImage ? '• Captura subida a Amazon S3 correctamente.\n' : '') +
          '• Se ha notificado al equipo de TI en tiempo real vía SSE.',
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
            <Text style={styles.backButtonText}>← Cancelar</Text>
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
            {/* Título */}
            <View style={styles.section}>
              <Text style={styles.label}>TÍTULO DE LA INCIDENCIA</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Fallo en firma de comprobantes electrónicos..."
                placeholderTextColor="#64748B"
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            {/* Nivel de Prioridad */}
            <View style={styles.section}>
              <Text style={styles.label}>NIVEL DE PRIORIDAD</Text>
              <View style={styles.priorityGrid}>
                {PRIORITIES.map((p) => {
                  const isSelected = prioridad === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.priorityCard,
                        { borderColor: isSelected ? p.color : '#334155' },
                        isSelected && { backgroundColor: `${p.color}15` },
                      ]}
                      onPress={() => setPrioridad(p.id)}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                      <Text style={[styles.priorityLabel, { color: isSelected ? p.color : '#F8FAFC' }]}>
                        {p.label}
                      </Text>
                      <Text style={styles.priorityDesc}>{p.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Categoría Técnica */}
            <View style={styles.section}>
              <Text style={styles.label}>CATEGORÍA TÉCNICA</Text>
              <View style={styles.chipsWrap}>
                {CATEGORIES.map((c) => {
                  const isSelected = categoria === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                      onPress={() => setCategoria(c.id)}
                    >
                      <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Cliente SaaS Afectado */}
            <View style={styles.section}>
              <Text style={styles.label}>CLIENTE SAAS AFECTADO</Text>
              <View style={styles.clientsList}>
                {SAAS_CLIENTS.map((client, idx) => {
                  const isSelected = clienteIndex === idx;
                  return (
                    <TouchableOpacity
                      key={client.nombre}
                      style={[styles.clientCard, isSelected && styles.clientCardSelected]}
                      onPress={() => setClienteIndex(idx)}
                    >
                      <Text style={[styles.clientName, isSelected && styles.clientNameSelected]}>
                        🏢 {client.nombre}
                      </Text>
                      <Text style={styles.clientPlan}>{client.plan}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Descripción Técnica */}
            <View style={styles.section}>
              <Text style={styles.label}>DESCRIPCIÓN Y TRAZABILIDAD DEL ERROR</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe el comportamiento erróneo, código de respuesta HTTP o logs relevantes..."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={4}
                value={descripcion}
                onChangeText={setDescripcion}
              />
            </View>

            {/* Subida Multimedia a Amazon S3 */}
            <View style={styles.section}>
              <Text style={styles.label}>CAPTURA DE PANTALLA (AMAZON S3)</Text>

              {selectedImage ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                  <View style={styles.previewMeta}>
                    <Text style={styles.previewName} numberOfLines={1}>
                      📎 {selectedImage.fileName || 'captura_error.jpg'}
                    </Text>
                    <Text style={styles.previewSub}>
                      {((selectedImage.fileSize || 180000) / 1024).toFixed(0)} KB • Listo para URL Prefirmada S3
                    </Text>
                    <TouchableOpacity
                      style={styles.removeImgBtn}
                      onPress={() => setSelectedImage(null)}
                    >
                      <Text style={styles.removeImgText}>Eliminar imagen</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadTitle}>Adjuntar Captura desde la Galería</Text>
                  <Text style={styles.uploadSubtitle}>
                    Se subirá como binario directo a Amazon S3 (caducidad 5 min)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Botón de Envío */}
            <View style={{ marginTop: 8, marginBottom: 20 }}>
              <Button
                title={
                  uploadingS3
                    ? 'Subiendo captura a Amazon S3...'
                    : 'Crear Incidencia y Notificar a TI'
                }
                onPress={handleSubmit}
                loading={submitting || uploadingS3}
              />
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  priorityDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  categoryChipSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#818CF8',
    fontWeight: '600',
  },
  clientsList: {
    gap: 8,
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
  },
  clientCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  clientName: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  clientNameSelected: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  clientPlan: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '600',
  },
  uploadBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#334155',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  uploadTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    alignItems: 'center',
    gap: 12,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  previewMeta: {
    flex: 1,
  },
  previewName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  previewSub: {
    color: '#10B981',
    fontSize: 10,
    marginTop: 2,
  },
  removeImgBtn: {
    marginTop: 6,
  },
  removeImgText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },
});
