import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 14,
          left: 18,
          right: 18,
          backgroundColor: isDark ? '#11131D' : '#FFFFFF',
          borderRadius: 34,
          borderWidth: 1.2,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.45 : 0.15,
          shadowRadius: 18,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          marginTop: 1,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Inter_700Bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />

      {/* Activity / Transactions Tab */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarButtonTestID: 'tab-activity',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />

      {/* Center Elevated Floating Add Button */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          headerTitle: 'Add Transaction',
          tabBarButton: (props) => (
            <AnimatedPressable
              {...props}
              onPress={(e) => {
                props.onPress?.(e);
                router.push('/(tabs)/add');
              }}
              scaleTo={0.92}
              testID="tab-add"
              style={[props.style, styles.addButtonContainer]}
              accessibilityRole="button"
              accessibilityLabel="Add new transaction"
            >
              <View
                style={[
                  styles.addButton,
                  {
                    backgroundColor: colors.primary,
                    borderColor: isDark ? '#11131D' : '#FFFFFF',
                    shadowColor: colors.primary,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
            </AnimatedPressable>
          ),
        }}
      />

      {/* Reports Tab */}
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          headerShown: false,
          tabBarButtonTestID: 'tab-reports',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'pie-chart' : 'pie-chart-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings & Profile',
          tabBarButtonTestID: 'tab-settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
  },
});
