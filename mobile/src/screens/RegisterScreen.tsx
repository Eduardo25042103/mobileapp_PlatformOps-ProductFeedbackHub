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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../types/navigation';
import { Department } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { Code, Headset, LucideIcon, Megaphone, TrendingUp } from 'lucide-react-native';

const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Introduce un correo corporativo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  departamento: z.enum(['SOPORTE', 'TI_DESARROLLO', 'VENTAS', 'MARKETING']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const DEPARTMENTS: { id: Department; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'TI_DESARROLLO', label: 'TI / Desarrollo', icon: Code, desc: 'Resolución de fallos y logs' },
  { id: 'SOPORTE', label: 'Soporte Técnico', icon: Headset, desc: 'Recepción y escalación de tickets' },
  { id: 'VENTAS', label: 'Ventas SaaS', icon: TrendingUp, desc: 'Canalización de pedidos y clientes' },
  { id: 'MARKETING', label: 'Marketing / Prod', icon: Megaphone, desc: 'Changelogs y comunicados' },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

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
      email: '',
      password: '',
      departamento: 'TI_DESARROLLO',
    },
  });

  const selectedDept = watch('departamento');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
    } catch (err: any) {
      Alert.alert(
        'Error de Registro',
        err.response?.data?.message || 'No fue posible completar el registro.'
      );
    } finally {
      setLoading(false);
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Registro de Empleado</Text>
              <Text style={styles.subtitle}>
                Crea tu perfil asignado para interactuar con el Hub de Operaciones
              </Text>
            </View>

            {/* Form */}
            <View style={styles.card}>
              <Controller
                control={control}
                name="nombre"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Nombre Completo"
                    placeholder="Ej. Carlos Mendoza"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.nombre?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    label="Correo Corporativo"
                    placeholder="carlos@empresa.com"
                    keyboardType="email-address"
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

              {/* Department Selector */}
              <Text style={styles.sectionLabel}>DEPARTAMENTO ASIGNADO</Text>
              <View style={styles.deptGrid}>
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDept === dept.id;
                  return (
                    <TouchableOpacity
                      key={dept.id}
                      activeOpacity={0.8}
                      style={[styles.deptCard, isSelected && styles.deptCardSelected]}
                      onPress={() => setValue('departamento', dept.id)}
                    >
                      <View style={styles.deptIcon}>
                        <dept.icon color={isSelected ? '#818CF8' : '#94A3B8'} size={20} />
                      </View>
                      <Text
                        style={[styles.deptName, isSelected && styles.deptNameSelected]}
                      >
                        {dept.label}
                      </Text>
                      <Text style={styles.deptDesc}>{dept.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Button
                title="Completar Registro"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={{ marginTop: 20 }}
              />
            </View>

            {/* Back to Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta interna? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Iniciar Sesión</Text>
              </TouchableOpacity>
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
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  deptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  deptCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
  },
  deptCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  deptIcon: {
    marginBottom: 6,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  deptNameSelected: {
    color: '#818CF8',
  },
  deptDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerLink: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 13,
  },
});
