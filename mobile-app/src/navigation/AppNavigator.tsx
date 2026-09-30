import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { RootStackParamList, TabParamList } from '../types';

// Screen imports
import HomeScreen from '../screens/HomeScreen';
import GameSetupScreen from '../screens/GameSetupScreen';
import GameScreen from '../screens/GameScreen';
import EndGameScreen from '../screens/EndGameScreen';
import StatsScreen from '../screens/StatsScreen';
import PlayerStatsScreen from '../screens/PlayerStatsScreen';
import RulesScreen from '../screens/RulesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Game flow stack (Setup -> Game -> EndGame)
const GameStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.text.light,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="GameSetup"
        component={GameSetupScreen}
        options={{ title: 'New Game' }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: 'Whist', headerLeft: () => null }}
      />
      <Stack.Screen
        name="EndGame"
        component={EndGameScreen}
        options={{ title: 'Game Over', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
};

// Stats stack (Stats list -> Player details)
const StatsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.text.light,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="StatsMain" 
        component={StatsScreen}
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen
        name="PlayerStats"
        component={PlayerStatsScreen}
        options={({ route }) => ({ 
          title: (route.params as { player: string })?.player || 'Player Stats'
        })}
      />
    </Stack.Navigator>
  );
};

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'GameTab':
              iconName = focused ? 'game-controller' : 'game-controller-outline';
              break;
            case 'Stats':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Rules':
              iconName = focused ? 'book' : 'book-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: colors.background.secondary,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="GameTab"
        component={GameStack}
        options={{ title: 'Game' }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsStack}
        options={{ title: 'Stats' }}
      />
      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{ title: 'Rules' }}
      />
    </Tab.Navigator>
  );
};

// Root navigator
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

export default AppNavigator;
