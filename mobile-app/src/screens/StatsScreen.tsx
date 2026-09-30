import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { SkeletonLoader, SkeletonElement } from '../components';
import { userService } from '../utils/api';
import { User, RootStackParamList } from '../types';

type StatsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StatsScreen: React.FC = () => {
  const navigation = useNavigation<StatsScreenNavigationProp>();
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getUsers();
      setPlayers(users);
    } catch (err) {
      setError('No active game found');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPress = (player: User) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PlayerStats', { player: player.username });
  };

  const getAvatarColor = (index: number): string => {
    const avatarColors = [
      colors.primary,
      colors.accent,
      colors.secondary,
      '#E53E3E',
      '#ED8936',
      '#4299E1',
    ];
    return avatarColors[index % avatarColors.length];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header skeleton */}
          <View style={styles.header}>
            <SkeletonElement width={150} height={32} borderRadius={borderRadius.md} />
            <SkeletonElement width="100%" height={44} borderRadius={borderRadius.md} style={{ marginTop: spacing.sm }} />
          </View>
          
          {/* Player cards skeleton grid */}
          <View style={styles.playersGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.playerCardSkeleton}>
                <SkeletonElement width={60} height={60} borderRadius={borderRadius.full} />
                <SkeletonElement width={50} height={16} borderRadius={borderRadius.full} style={{ marginTop: spacing.sm }} />
                <SkeletonElement width={80} height={18} borderRadius={borderRadius.sm} style={{ marginTop: spacing.xs }} />
                <SkeletonElement width={70} height={14} borderRadius={borderRadius.sm} style={{ marginTop: spacing.sm }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || players.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart-outline" size={80} color={colors.text.muted} />
          <Text style={styles.emptyTitle}>No Statistics Available</Text>
          <Text style={styles.emptyText}>
            Start a game to see player statistics
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.header}
        >
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>
            Analyze individual performances and find your biggest strengths and weaknesses
          </Text>
        </Animated.View>

        {/* Players Grid */}
        <View style={styles.playersGrid}>
          {players.map((player, index) => (
            <Animated.View
              key={player.id || index}
              entering={FadeInDown.delay(100 + index * 100).duration(400)}
            >
              <TouchableOpacity
                style={styles.playerCard}
                onPress={() => handlePlayerPress(player)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: getAvatarColor(index) },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {player.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Player {index + 1}</Text>
                </View>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.username}
                </Text>
                <View style={styles.viewStats}>
                  <Text style={styles.viewStatsText}>View Stats</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Info Section */}
        <Animated.View
          entering={FadeIn.delay(600).duration(400)}
          style={styles.infoSection}
        >
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            Statistics include accuracy, precision, and recall metrics based on
            your calls vs actual tricks won
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  playerCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '47%',
    minWidth: 150,
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerCardSkeleton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '47%',
    minWidth: 150,
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.primary,
  },
  playerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  viewStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStatsText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default StatsScreen;

