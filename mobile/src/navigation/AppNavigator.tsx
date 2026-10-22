import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { TicketListScreen } from '../screens/TicketListScreen';
import { TicketDetailScreen } from '../screens/TicketDetailScreen';
import { TicketFormScreen } from '../screens/TicketFormScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F172A' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="TicketForm" component={TicketFormScreen} />
    </Stack.Navigator>
  );
};
