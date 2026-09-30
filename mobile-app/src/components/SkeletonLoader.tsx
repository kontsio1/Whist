import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius } from '../theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

interface SkeletonLoaderProps {
  variant?: 'card' | 'roundCard' | 'playerCard' | 'statCard' | 'text' | 'avatar' | 'custom';
  count?: number;
  children?: React.ReactNode;
}

// Single animated skeleton element
const SkeletonElement: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Player card skeleton
const PlayerCardSkeleton: React.FC = () => (
  <View style={styles.playerCard}>
    <SkeletonElement width={50} height={50} borderRadius={borderRadius.full} />
    <View style={styles.playerCardContent}>
      <SkeletonElement width={60} height={14} />
      <SkeletonElement width={100} height={18} style={{ marginTop: spacing.xs }} />
    </View>
  </View>
);

// Round card skeleton
const RoundCardSkeleton: React.FC = () => (
  <View style={styles.roundCard}>
    <View style={styles.roundCardHeader}>
      <SkeletonElement width={50} height={40} borderRadius={borderRadius.md} />
      <View style={styles.roundCardHeaderText}>
        <SkeletonElement width={40} height={12} />
        <SkeletonElement width={70} height={16} style={{ marginTop: spacing.xs }} />
      </View>
    </View>
    <View style={styles.roundCardScores}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.scoreBubbleSkeleton}>
          <SkeletonElement width={40} height={12} />
          <SkeletonElement width={65} height={65} borderRadius={borderRadius.full} style={{ marginTop: spacing.xs }} />
        </View>
      ))}
    </View>
  </View>
);

// Stat card skeleton
const StatCardSkeleton: React.FC = () => (
  <View style={styles.statCard}>
    <View style={styles.statCardHeader}>
      <SkeletonElement width={24} height={24} borderRadius={borderRadius.sm} />
      <SkeletonElement width={60} height={14} style={{ marginLeft: spacing.xs }} />
    </View>
    <SkeletonElement width={80} height={28} style={{ marginTop: spacing.sm }} />
    <SkeletonElement width={100} height={12} style={{ marginTop: spacing.xs }} />
  </View>
);

// Avatar skeleton
const AvatarSkeleton: React.FC = () => (
  <SkeletonElement width={60} height={60} borderRadius={borderRadius.full} />
);

// Text line skeleton
const TextSkeleton: React.FC = () => (
  <View style={styles.textLines}>
    <SkeletonElement width="100%" height={16} />
    <SkeletonElement width="80%" height={16} style={{ marginTop: spacing.sm }} />
    <SkeletonElement width="60%" height={16} style={{ marginTop: spacing.sm }} />
  </View>
);

// Generic card skeleton
const CardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <SkeletonElement width="100%" height={120} borderRadius={borderRadius.lg} />
  </View>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  children,
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'playerCard':
        return <PlayerCardSkeleton />;
      case 'roundCard':
        return <RoundCardSkeleton />;
      case 'statCard':
        return <StatCardSkeleton />;
      case 'avatar':
        return <AvatarSkeleton />;
      case 'text':
        return <TextSkeleton />;
      case 'custom':
        return children;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ marginBottom: index < count - 1 ? spacing.md : 0 }}>
          {renderSkeleton()}
        </View>
      ))}
    </View>
  );
};

// Export individual skeleton components for custom layouts
export { SkeletonElement, PlayerCardSkeleton, RoundCardSkeleton, StatCardSkeleton };

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  skeleton: {
    backgroundColor: colors.background.secondary,
  },
  playerCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerCardContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  roundCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roundCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  roundCardHeaderText: {
    marginLeft: spacing.md,
  },
  roundCardScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreBubbleSkeleton: {
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '47%',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textLines: {
    padding: spacing.md,
  },
});

export default SkeletonLoader;

