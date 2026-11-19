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
import { Radio, Zap, Shield, Code, Headset, TrendingUp, Megaphone } from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { DEMO_USERS } from '../api/authApi';

const loginSchema = z.object({
  email: z.string().email('Introduce un correo corporativo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'aldair.cahuana@tunegocio.pe',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
    } catch (err: any) {
      Alert.alert(
        'Error de Autenticación',
        err.response?.data?.message || err.message || 'Credenciales incorrectas o servidor no disponible.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (userKey: keyof typeof DEMO_USERS) => {
    const demo = DEMO_USERS[userKey];
    setValue('email', demo.email);
    setValue('password', 'password123');
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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand Header */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Radio color="#818CF8" size={26} />
              </View>
              <Text style={styles.systemTitle}>PlatformOps Hub</Text>
              <Text style={styles.systemSubtitle}>TuNegocio.pe • Portal de Operaciones</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Iniciar Sesión</Text>
              <Text style={styles.cardSubtitle}>
                Ingresa tus credenciales para acceder a la plataforma
              </Text>

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
                    placeholder="••••••••"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <Button
                title="Iniciar Sesión"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={{ marginTop: 8 }}
              />

              {/* Demo Helper Button */}
              <TouchableOpacity
                style={styles.toggleDemoBtn}
                onPress={() => setShowDemoAccounts(!showDemoAccounts)}
                activeOpacity={0.7}
              >
                <Zap color="#F59E0B" size={14} />
                <Text style={styles.toggleDemoText}>
                  {showDemoAccounts ? 'Ocultar cuentas de prueba' : 'Cuentas de prueba rápidas'}
                </Text>
              </TouchableOpacity>

              {/* Demo Accounts List */}
              {showDemoAccounts && (
                <View style={styles.demoAccountsBox}>
                  <TouchableOpacity
                    style={styles.demoItem}
                    onPress={() => selectDemoUser('dev')}
                  >
                    <Code size={14} color="#818CF8" />
                    <Text style={styles.demoText}>Aldair Cahuana (TI / Desarrollo)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoItem}
                    onPress={() => selectDemoUser('soporte')}
                  >
                    <Headset size={14} color="#10B981" />
                    <Text style={styles.demoText}>Henry Monroy (Soporte Técnico)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoItem}
                    onPress={() => selectDemoUser('ventas')}
                  >
                    <TrendingUp size={14} color="#F59E0B" />
                    <Text style={styles.demoText}>Josue Morales (Ventas Corporativas)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoItem}
                    onPress={() => selectDemoUser('marketing')}
                  >
                    <Megaphone size={14} color="#EC4899" />
                    <Text style={styles.demoText}>Eduardo Sánchez (Marketing & Producto)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoItem}
                    onPress={() => selectDemoUser('admin')}
                  >
                    <Shield size={14} color="#EF4444" />
                    <Text style={styles.demoText}>Administrador General</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Crear Cuenta</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  systemTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  systemSubtitle: {
    fontSize: 12,
    fontWeight: '500',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  toggleDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
  },
  toggleDemoText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  demoAccountsBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    gap: 6,
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1E293B',
  },
  demoText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerLink: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '700',
  },
});
