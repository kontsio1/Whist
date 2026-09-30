import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Button } from '../components';
import { TabParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<TabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Pulsating animation for the start button
  const pulse = useSharedValue(1);
  
  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleStartGame = () => {
    navigation.navigate('GameTab' as any);
  };

  const handleResumeGame = () => {
    navigation.navigate('GameTab' as any, {
      screen: 'Game',
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.dark, colors.primary, colors.accent]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="game-controller" size={60} color={colors.text.light} />
          </View>
          <Text style={styles.title}>Whiiist</Text>
          <Text style={styles.subtitle}>Track your card game scores</Text>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Start Game Button */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={[styles.buttonWrapper, pulseStyle]}
          >
            <Button
              title="Start New Game"
              onPress={handleStartGame}
              variant="secondary"
              size="xl"
              style={styles.mainButton}
              textStyle={styles.mainButtonText}
            />
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.quickActions}
          >
            <Button
              title="Resume Game"
              onPress={handleResumeGame}
              variant="outline"
              size="lg"
              style={styles.secondaryButton}
            />
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeIn.delay(800).duration(600)}
          style={styles.footer}
        >
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <Ionicons name="people" size={24} color={colors.secondary} />
              <Text style={styles.featureText}>2-6 Players</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="stats-chart" size={24} color={colors.secondary} />
              <Text style={styles.featureText}>Statistics</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="trophy" size={24} color={colors.secondary} />
              <Text style={styles.featureText}>Leaderboard</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: 'bold',
    color: colors.text.light,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.text.light,
    opacity: 0.8,
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  mainButton: {
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainButtonText: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  quickActions: {
    width: '100%',
  },
  secondaryButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    color: colors.text.light,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    opacity: 0.8,
  },
});

export default HomeScreen;

