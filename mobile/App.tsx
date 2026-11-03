import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TicketProvider } from './src/context/TicketContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <TicketProvider>
          <RootNavigator />
        </TicketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
