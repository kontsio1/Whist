import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize } from '../theme';

interface PlayerCardProps {
  name: string;
  index: number;
  onRemove: () => void;
  isDealer?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  index,
  onRemove,
  isDealer = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0, { damping: 15 }, () => {
      // Animation complete
    });
    onRemove();
  };

  const getAvatarColor = (idx: number): string => {
    const avatarColors = [
      colors.primary,
      colors.accent,
      colors.secondary,
      '#E53E3E',
      '#ED8936',
      '#4299E1',
    ];
    return avatarColors[idx % avatarColors.length];
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={[styles.container, animatedStyle]}
    >
      <View style={[styles.avatar, { backgroundColor: getAvatarColor(index) }]}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Player {index + 1}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {isDealer && (
        <View style={styles.dealerBadge}>
          <Ionicons name="star" size={12} color={colors.text.light} />
          <Text style={styles.dealerText}>Dealer</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleRemove}
        style={styles.removeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-circle" size={24} color={colors.error} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.text.light,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.text.primary,
    fontWeight: '600',
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dealerBadge: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  dealerText: {
    fontSize: fontSize.xs,
    color: colors.text.light,
    fontWeight: '600',
    marginLeft: 4,
  },
  removeButton: {
    padding: spacing.xs,
  },
});

export default PlayerCard;

