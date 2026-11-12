import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';

interface InputTextProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const InputText: React.FC<InputTextProps> = ({
  label,
  error,
  isPassword = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#64748B"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#131B2E',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    height: 44,
    color: '#F8FAFC',
    fontSize: 14,
  },
  eyeButton: {
    padding: 6,
  },
  eyeText: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
});
