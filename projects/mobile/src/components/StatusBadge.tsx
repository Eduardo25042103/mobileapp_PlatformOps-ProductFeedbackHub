import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { TicketStatus } from '../types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const [pulse] = useState(new Animated.Value(1));

  const isLive = status === 'EN_DIAGNOSTICO' || status === 'EN_DESARROLLO';

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLive]);

  const config: Record<
    TicketStatus,
    { label: string; color: string; bg: string; border: string }
  > = {
    NUEVO: {
      label: 'NUEVO',
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.3)',
    },
    EN_DIAGNOSTICO: {
      label: 'EN DIAGNÓSTICO',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    EN_DESARROLLO: {
      label: 'EN DESARROLLO',
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)',
    },
    EN_QA: {
      label: 'EN QA',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    RESUELTO: {
      label: 'RESUELTO',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    CERRADO: {
      label: 'CERRADO',
      color: '#64748B',
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.3)',
    },
  };

  const current = config[status] || {
    label: status,
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.3)',
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
          paddingVertical: isSm ? 2 : 3,
          paddingHorizontal: isSm ? 6 : 8,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: current.color,
            opacity: isLive ? pulse : 1,
          },
        ]}
      />
      <Text
        style={[
          styles.text,
          {
            color: current.color,
            fontSize: isSm ? 9 : 11,
          },
        ]}
      >
        {current.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
