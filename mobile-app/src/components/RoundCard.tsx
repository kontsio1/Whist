import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import ScoreBubble from './ScoreBubble';
import { User, CallsGetRequest, TricksGetRequest, ScoresGetRequest } from '../types';

interface RoundCardProps {
  roundNo: number;
  cards: number;
  dealerName: string;
  players: User[];
  calls?: CallsGetRequest;
  tricks?: TricksGetRequest;
  scores?: ScoresGetRequest;
  isCurrentRound: boolean;
  onCellPress: (player: string, roundNo: number) => void;
  index: number;
}

const RoundCard: React.FC<RoundCardProps> = ({
  roundNo,
  cards,
  dealerName,
  players,
  calls,
  tricks,
  scores,
  isCurrentRound,
  onCellPress,
  index,
}) => {
  const getPlayerValue = (
    data: CallsGetRequest | TricksGetRequest | ScoresGetRequest | undefined,
    playerIndex: number
  ): number | undefined => {
    if (!data) return undefined;
    const key = `player${playerIndex + 1}` as keyof typeof data;
    const value = data[key];
    return typeof value === 'number' ? value : undefined;
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      style={[
        styles.container,
        isCurrentRound && styles.currentRound,
      ]}
    >
      {/* Round Info Header */}
      <View style={styles.header}>
        <View style={styles.roundInfo}>
          <View style={styles.cardsBadge}>
            <Text style={styles.cardsText}>{cards}</Text>
            <Text style={styles.cardsLabel}>cards</Text>
          </View>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerLabel}>Dealer</Text>
            <Text style={styles.dealerName}>{dealerName || 'TBD'}</Text>
          </View>
        </View>
        {isCurrentRound && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Current</Text>
          </View>
        )}
      </View>

      {/* Player Scores */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scoresContainer}
      >
        {players.map((player, playerIndex) => (
          <View key={player.id || playerIndex} style={styles.playerCell}>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.username}
            </Text>
            <ScoreBubble
              calls={getPlayerValue(calls, playerIndex)}
              tricks={getPlayerValue(tricks, playerIndex)}
              score={getPlayerValue(scores, playerIndex)}
              highlighted={isCurrentRound}
              onPress={() => onCellPress(`player${playerIndex + 1}`, roundNo)}
              size="md"
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentRound: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardsBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardsText: {
    color: colors.text.light,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  cardsLabel: {
    color: colors.text.light,
    fontSize: fontSize.xs,
    opacity: 0.8,
  },
  dealerInfo: {
    alignItems: 'flex-start',
  },
  dealerLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  dealerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  currentBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  currentBadgeText: {
    color: colors.text.light,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  scoresContainer: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  playerCell: {
    alignItems: 'center',
    marginRight: spacing.lg,
    minWidth: 80,
  },
  playerName: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    maxWidth: 70,
    textAlign: 'center',
  },
});

export default RoundCard;

