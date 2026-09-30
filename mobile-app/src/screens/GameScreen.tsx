import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { Button, RoundCard, CallsTricksSheet, SkeletonElement } from '../components';
import { CallsTricksSheetRef } from '../components';
import { useGame } from '../context/GameContext';
import { RootStackParamList, CellCoords } from '../types';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const {
    activeUsers,
    playerCalls,
    playerTricks,
    playerScores,
    dealerAndCards,
    totalScores,
    isLoading,
    refreshGameData,
    submitCall,
    submitTrick,
    setFirstDealer,
    loadExistingGame,
  } = useGame();

  const callsTricksSheetRef = useRef<CallsTricksSheetRef>(null);
  const [selectedCell, setSelectedCell] = useState<CellCoords | null>(null);
  const [maxValue, setMaxValue] = useState(13);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null);

  // Load game data on mount
  useEffect(() => {
    loadExistingGame();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshGameData();
    setRefreshing(false);
  }, [refreshGameData]);

  // Get current round info
  const currentRoundNo = playerCalls?.length ? playerCalls.length + 1 : 1;
  const lastRoundNo = dealerAndCards.slice(-1)[0]?.roundno || 0;
  const isGameComplete = lastRoundNo === (playerCalls?.length || 0);

  // Handle cell press
  const handleCellPress = (player: string, roundNo: number) => {
    const dealerRow = dealerAndCards.find((d) => d.roundno === roundNo);
    const maxCards = dealerRow?.cards ?? 13;

    setSelectedCell({ player, roundNo });
    setMaxValue(maxCards);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callsTricksSheetRef.current?.open();
  };

  // Handle call submission
  const handleSubmitCall = async (value: number) => {
    if (!selectedCell) return;

    // Validate call sum doesn't equal cards
    const dealerRow = dealerAndCards.find((d) => d.roundno === selectedCell.roundNo);
    const currentCalls = playerCalls?.find((c) => c.roundno === selectedCell.roundNo);
    
    if (currentCalls && dealerRow) {
      let callSum = 0;
      activeUsers.forEach((_, idx) => {
        const key = `player${idx + 1}`;
        if (key !== selectedCell.player) {
          const val = currentCalls[key as keyof typeof currentCalls];
          if (typeof val === 'number') {
            callSum += val;
          }
        }
      });

      if (callSum + value === dealerRow.cards) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Call',
          text2: "Call sum can't match total tricks",
        });
        return;
      }
    }

    const success = await submitCall(selectedCell.roundNo, selectedCell.player, value);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Call Recorded',
        visibilityTime: 1000,
      });
    }
    setSelectedCell(null);
  };

  // Handle trick submission
  const handleSubmitTrick = async (value: number) => {
    if (!selectedCell) return;

    const success = await submitTrick(selectedCell.roundNo, selectedCell.player, value);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Trick Recorded',
        visibilityTime: 1000,
      });
    }
    setSelectedCell(null);
  };

  // Handle first dealer selection
  const handleDealerSelect = async (playerId: number) => {
    setSelectedDealer(playerId);
    const success = await setFirstDealer(playerId);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Dealer Set',
        visibilityTime: 1000,
      });
    }
  };

  // Handle end game
  const handleEndGame = () => {
    Alert.alert(
      'End Game',
      'Are you sure you want to end the current game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: () => navigation.navigate('EndGame'),
        },
      ]
    );
  };

  // Get player name for cell
  const getPlayerName = (playerKey: string): string => {
    const index = parseInt(playerKey.replace('player', '')) - 1;
    return activeUsers[index]?.username || 'Unknown';
  };

  // Build rounds data
  const buildRoundsData = () => {
    const rounds = [];
    const numRounds = Math.max(playerCalls?.length || 0, 1);

    for (let i = 0; i < numRounds; i++) {
      const roundNo = i + 1;
      const dealerInfo = dealerAndCards[i];
      const dealerIndex = dealerInfo ? parseInt(dealerInfo.dealerplayer) - 1 : -1;
      const dealerName = dealerIndex >= 0 ? activeUsers[dealerIndex]?.username : '';

      rounds.push({
        roundNo,
        cards: dealerInfo?.cards || 1,
        dealerName,
        calls: playerCalls?.[i],
        tricks: playerTricks?.[i],
        scores: playerScores?.[i],
        isCurrentRound: roundNo === currentRoundNo - 1 || (i === numRounds - 1 && !isGameComplete),
      });
    }

    // Add new round placeholder if game not complete
    if (!isGameComplete && dealerAndCards.length > (playerCalls?.length || 0)) {
      const nextRoundNo = (playerCalls?.length || 0) + 1;
      const dealerInfo = dealerAndCards[nextRoundNo - 1];
      const dealerIndex = dealerInfo ? parseInt(dealerInfo.dealerplayer) - 1 : -1;
      const dealerName = dealerIndex >= 0 ? activeUsers[dealerIndex]?.username : '';

      rounds.push({
        roundNo: nextRoundNo,
        cards: dealerInfo?.cards || 1,
        dealerName: nextRoundNo === 1 ? '' : dealerName,
        calls: undefined,
        tricks: undefined,
        scores: undefined,
        isCurrentRound: true,
      });
    }

    return rounds;
  };

  const roundsData = buildRoundsData();

  // Render total scores header
  const renderTotalsHeader = () => (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.totalsContainer}
    >
      <Text style={styles.totalsTitle}>Total Scores</Text>
      <View style={styles.totalsRow}>
        {activeUsers.map((user, index) => (
          <View key={user.id || index} style={styles.totalItem}>
            <Text style={styles.totalPlayerName} numberOfLines={1}>
              {user.username}
            </Text>
            <View style={styles.totalScoreBubble}>
              <Text style={styles.totalScore}>{totalScores[index] || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // Render dealer selector for first round
  const renderDealerSelector = () => {
    if (dealerAndCards.length > 0) return null;

    return (
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.dealerSelector}
      >
        <Text style={styles.dealerSelectorTitle}>Who deals first?</Text>
        <View style={styles.dealerPicker}>
          <Picker
            selectedValue={selectedDealer}
            onValueChange={(value: number | null) => value && handleDealerSelect(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select dealer..." value={null} />
            {activeUsers.map((user) => (
              <Picker.Item
                key={user.id}
                label={user.username}
                value={user.id}
              />
            ))}
          </Picker>
        </View>
      </Animated.View>
    );
  };

  const renderRound = ({ item, index }: { item: any; index: number }) => (
    <RoundCard
      roundNo={item.roundNo}
      cards={item.cards}
      dealerName={item.dealerName}
      players={activeUsers}
      calls={item.calls}
      tricks={item.tricks}
      scores={item.scores}
      isCurrentRound={item.isCurrentRound}
      onCellPress={handleCellPress}
      index={index}
    />
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Totals Header */}
        {activeUsers.length > 0 && renderTotalsHeader()}

        {/* Dealer Selector */}
        {renderDealerSelector()}

        {/* Rounds List */}
        <FlatList
          data={roundsData}
          renderItem={renderRound}
          keyExtractor={(item) => item.roundNo.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.skeletonContainer}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.roundCardSkeleton}>
                    <View style={styles.skeletonHeader}>
                      <SkeletonElement width={50} height={40} borderRadius={borderRadius.md} />
                      <View style={styles.skeletonHeaderText}>
                        <SkeletonElement width={40} height={12} />
                        <SkeletonElement width={70} height={16} style={{ marginTop: spacing.xs }} />
                      </View>
                    </View>
                    <View style={styles.skeletonScores}>
                      {[1, 2, 3, 4].map((j) => (
                        <View key={j} style={styles.skeletonScoreItem}>
                          <SkeletonElement width={40} height={12} />
                          <SkeletonElement width={65} height={65} borderRadius={32} style={{ marginTop: spacing.xs }} />
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="game-controller-outline" size={60} color={colors.text.muted} />
                <Text style={styles.emptyText}>No rounds yet</Text>
                <Text style={styles.emptySubtext}>Select a dealer to start</Text>
              </View>
            )
          }
        />

        {/* End Game Button */}
        <View style={styles.footer}>
          <Button
            title="End Game"
            onPress={handleEndGame}
            variant="accent"
            size="lg"
            style={styles.endButton}
          />
        </View>

        {/* Bottom Sheet */}
        <CallsTricksSheet
          ref={callsTricksSheetRef}
          onSubmitCall={handleSubmitCall}
          onSubmitTrick={handleSubmitTrick}
          maxValue={maxValue}
          playerName={selectedCell ? getPlayerName(selectedCell.player) : undefined}
          roundNo={selectedCell?.roundNo}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  safeArea: {
    flex: 1,
  },
  totalsContainer: {
    backgroundColor: colors.background.card,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.muted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  totalPlayerName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    maxWidth: 60,
  },
  totalScoreBubble: {
    backgroundColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalScore: {
    color: colors.text.light,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  dealerSelector: {
    backgroundColor: colors.background.card,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  dealerSelectorTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  dealerPicker: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  listContent: {
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  skeletonContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  roundCardSkeleton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  skeletonHeaderText: {
    marginLeft: spacing.md,
  },
  skeletonScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  skeletonScoreItem: {
    alignItems: 'center',
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  endButton: {
    borderRadius: borderRadius.lg,
  },
});

export default GameScreen;



