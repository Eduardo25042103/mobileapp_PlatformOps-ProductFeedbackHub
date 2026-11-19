import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { TicketListScreen } from '../screens/TicketListScreen';
import { TicketDetailScreen } from '../screens/TicketDetailScreen';
import { TicketFormScreen } from '../screens/TicketFormScreen';
import { ClientsScreen } from '../screens/ClientsScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { AnnouncementsScreen } from '../screens/AnnouncementsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F172A' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="TicketForm" component={TicketFormScreen} />
      <Stack.Screen name="Clients" component={ClientsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    </Stack.Navigator>
  );
};
