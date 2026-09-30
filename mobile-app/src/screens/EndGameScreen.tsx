import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { Button } from '../components';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../types';

type EndGameNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EndGameScreen: React.FC = () => {
  const navigation = useNavigation<EndGameNavigationProp>();
  const { activeUsers, totalScores, clearPlayers } = useGame();

  // Determine winner and rankings
  const rankings = useMemo(() => {
    const playerScores = activeUsers.map((user, index) => ({
      user,
      score: totalScores[index] || 0,
      rank: 0,
    }));

    // Sort by score descending
    playerScores.sort((a, b) => b.score - a.score);

    // Assign ranks
    let currentRank = 1;
    playerScores.forEach((player, index) => {
      if (index > 0 && player.score < playerScores[index - 1].score) {
        currentRank = index + 1;
      }
      player.rank = currentRank;
    });

    return playerScores;
  }, [activeUsers, totalScores]);

  const winner = rankings[0];

  // Trophy animation
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    trophyScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 400 }),
        withTiming(1, { duration: 200 })
      )
    );

    trophyRotate.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-0.1, { duration: 150 }),
          withTiming(0.1, { duration: 300 }),
          withTiming(0, { duration: 150 })
        ),
        3
      )
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}rad` },
    ],
  }));

  const handlePlayAgain = () => {
    clearPlayers();
    navigation.reset({
      index: 0,
      routes: [{ name: 'GameSetup' as any }],
    });
  };

  const handleViewStats = () => {
    navigation.navigate('MainTabs' as any, {
      screen: 'Stats',
    });
  };

  const getMedalColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.text.muted;
    }
  };

  const getMedalIcon = (rank: number): keyof typeof Ionicons.glyphMap => {
    switch (rank) {
      case 1:
        return 'trophy';
      case 2:
        return 'medal';
      case 3:
        return 'ribbon';
      default:
        return 'person';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.accent, colors.dark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Winner Section */}
          <View style={styles.winnerSection}>
            <Animated.Text
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.gameOverText}
            >
              Game Over
            </Animated.Text>

            <Animated.View style={[styles.trophyContainer, trophyStyle]}>
              <Ionicons name="trophy" size={100} color="#FFD700" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).duration(400)}
              style={styles.winnerInfo}
            >
              <Text style={styles.winnerLabel}>Winner</Text>
              <Text style={styles.winnerName}>{winner?.user.username}</Text>
              <Text style={styles.winnerScore}>{winner?.score} points</Text>
            </Animated.View>
          </View>

          {/* Leaderboard */}
          <Animated.View
            entering={FadeIn.delay(800).duration(400)}
            style={styles.leaderboard}
          >
            <Text style={styles.leaderboardTitle}>Final Standings</Text>
            
            {rankings.map((player, index) => (
              <Animated.View
                key={player.user.id || index}
                entering={FadeInDown.delay(900 + index * 100).duration(300)}
                style={[
                  styles.leaderboardRow,
                  player.rank === 1 && styles.winnerRow,
                ]}
              >
                <View style={styles.rankContainer}>
                  <Ionicons
                    name={getMedalIcon(player.rank)}
                    size={24}
                    color={getMedalColor(player.rank)}
                  />
                  <Text style={styles.rankText}>#{player.rank}</Text>
                </View>
                
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.user.username}</Text>
                </View>
                
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{player.score}</Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Actions */}
          <Animated.View
            entering={FadeInUp.delay(1200).duration(400)}
            style={styles.actions}
          >
            <Button
              title="Play Again"
              onPress={handlePlayAgain}
              variant="secondary"
              size="lg"
              style={styles.playAgainButton}
            />
            <Button
              title="View Statistics"
              onPress={handleViewStats}
              variant="outline"
              size="md"
              style={styles.statsButton}
            />
          </Animated.View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  winnerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  gameOverText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.light,
    opacity: 0.8,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  trophyContainer: {
    marginVertical: spacing.xl,
  },
  winnerInfo: {
    alignItems: 'center',
  },
  winnerLabel: {
    fontSize: fontSize.md,
    color: colors.secondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  winnerName: {
    fontSize: fontSize.hero,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: spacing.sm,
  },
  winnerScore: {
    fontSize: fontSize.xl,
    color: colors.text.light,
    opacity: 0.9,
  },
  leaderboard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  leaderboardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  winnerRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
  },
  rankText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  scoreText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  actions: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  playAgainButton: {
    borderRadius: borderRadius.lg,
  },
  statsButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default EndGameScreen;

