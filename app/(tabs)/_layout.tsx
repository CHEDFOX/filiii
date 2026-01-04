import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, MessageCircle, Waves, User } from 'lucide-react-native';
import { colors, typography, spacing } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textQuaternary,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.cardGray,
          borderTopColor: colors.separator,
          borderTopWidth: 0.5,
          paddingTop: spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
          height: Platform.OS === 'ios' ? 88 : 64,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              tint="dark"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.glass.background,
              }}
            />
          ) : null,
        tabBarLabelStyle: {
          fontSize: typography.fontSizes.xxs,
          fontWeight: typography.fontWeights.semibold,
          letterSpacing: typography.letterSpacing.wide,
          marginTop: spacing.xxs,
        },
        tabBarIconStyle: {
          marginTop: spacing.xxs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Home
              size={focused ? size + 2 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Coach',
          tabBarIcon: ({ size, color, focused }) => (
            <MessageCircle
              size={focused ? size + 2 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="frequencies"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ size, color, focused }) => (
            <Waves
              size={focused ? size + 2 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <User
              size={focused ? size + 2 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
