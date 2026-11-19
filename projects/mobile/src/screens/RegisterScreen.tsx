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
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../types/navigation';
import { CatalogDepartmentDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { ArrowLeft, Building, Code, Headset, Megaphone, TrendingUp } from 'lucide-react-native';

const registerSchema = z
  .object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    telefono: z.string().min(9, 'Ingresa un teléfono válido'),
    email: z.string().email('Introduce un correo corporativo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
    departamentoId: z.number().min(1, 'Selecciona un departamento'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<CatalogDepartmentDto[]>([]);
  const [loadingDeptos, setLoadingDeptos] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '+51 987 654 321',
      email: '',
      password: '',
      confirmPassword: '',
      departamentoId: 2,
    },
  });

  const selectedDeptId = watch('departamentoId');

  useEffect(() => {
    const fetchDeptos = async () => {
      try {
        const list = await authApi.getDepartmentsCatalog();
        setDepartments(list);
      } finally {
        setLoadingDeptos(false);
      }
    };
    fetchDeptos();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        email: data.email,
        password: data.password,
        departamento: String(data.departamentoId),
        departamentoId: data.departamentoId,
      });
      Alert.alert(
        '¡Registro Exitoso!',
        'Tu cuenta ha sido creada exitosamente. Ya puedes ingresar a la plataforma.'
      );
    } catch (err: any) {
      Alert.alert(
        'Error de Registro',
        err.response?.data?.message || err.message || 'No fue posible completar el registro.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getDeptIcon = (codigo: string) => {
    switch (codigo) {
      case 'TI':
        return Code;
      case 'SOP':
        return Headset;
      case 'VENTAS':
        return TrendingUp;
      case 'MKT':
        return Megaphone;
      default:
        return Building;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={16} color="#818CF8" />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Completa tus datos para registrarte en la plataforma
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.card}>
              <Controller
                control={control}
                name="nombre"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Nombres"
                    placeholder="Ej. Carlos"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.nombre?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="apellido"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Apellidos"
                    placeholder="Ej. Mendoza Quispe"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.apellido?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="telefono"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Teléfono Móvil"
                    placeholder="+51 987 654 321"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.telefono?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Correo Corporativo"
                    placeholder="usuario@tunegocio.pe"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Contraseña"
                    placeholder="Mínimo 6 caracteres"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Confirmar Contraseña"
                    placeholder="Repite tu contraseña"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              {/* Department Selector */}
              <Text style={styles.sectionLabel}>DEPARTAMENTO</Text>
              {loadingDeptos ? (
                <ActivityIndicator size="small" color="#6366F1" style={{ marginVertical: 10 }} />
              ) : (
                <View style={styles.deptGrid}>
                  {departments.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    const IconComponent = getDeptIcon(dept.codigo);
                    return (
                      <TouchableOpacity
                        key={dept.id}
                        activeOpacity={0.8}
                        style={[styles.deptCard, isSelected && styles.deptCardSelected]}
                        onPress={() => setValue('departamentoId', dept.id)}
                      >
                        <View style={styles.deptIcon}>
                          <IconComponent color={isSelected ? '#818CF8' : '#94A3B8'} size={18} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.deptName, isSelected && styles.deptNameSelected]}>
                            {dept.nombre}
                          </Text>
                          {dept.descripcion ? (
                            <Text style={styles.deptDesc} numberOfLines={2}>
                              {dept.descripcion}
                            </Text>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <Button
                title="Crear Cuenta"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={{ marginTop: 16 }}
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
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 8,
  },
  deptGrid: {
    gap: 8,
    marginBottom: 10,
  },
  deptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  deptCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  deptIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deptName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  deptNameSelected: {
    color: '#818CF8',
  },
  deptDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
});
