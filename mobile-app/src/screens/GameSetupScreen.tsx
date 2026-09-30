import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { Button, PlayerCard } from '../components';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../types';

type GameSetupNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GameSetupScreen: React.FC = () => {
  const navigation = useNavigation<GameSetupNavigationProp>();
  const { players, addPlayer, removePlayer, startGame, loadExistingGame, isLoading } = useGame();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      if (players.length >= 6) {
        Toast.show({
          type: 'error',
          text1: 'Maximum Players',
          text2: 'You can have at most 6 players',
        });
        return;
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addPlayer(playerName.trim());
      Toast.show({
        type: 'success',
        text1: 'Player Added',
        text2: `${playerName.trim()} has been added`,
        visibilityTime: 1500,
      });
      setPlayerName('');
      setModalVisible(false);
    }
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Not Enough Players',
        text2: 'You need at least 2 players to start',
      });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const success = await startGame();
    if (success) {
      navigation.navigate('Game');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to Start',
        text2: 'Could not connect to server',
      });
    }
  };

  const handleResumeGame = async () => {
    const success = await loadExistingGame();
    if (success) {
      navigation.navigate('Game');
    } else {
      Toast.show({
        type: 'info',
        text1: 'No Existing Game',
        text2: 'Start a new game to play',
      });
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const renderPlayer = ({ item, index }: { item: any; index: number }) => (
    <PlayerCard
      name={item.username}
      index={index}
      onRemove={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        removePlayer(index);
      }}
    />
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.emptyState}
    >
      <Ionicons name="people-outline" size={80} color={colors.text.muted} />
      <Text style={styles.emptyTitle}>No Players Yet</Text>
      <Text style={styles.emptyText}>
        Add 2-6 players to start the game
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header Info */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <View style={styles.playerCount}>
            <Text style={styles.playerCountNumber}>{players.length}</Text>
            <Text style={styles.playerCountLabel}>/ 6 Players</Text>
          </View>
        </Animated.View>

        {/* Players List */}
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Player Button */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.addButtonContainer}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={openModal}
            disabled={players.length >= 6}
          >
            <Ionicons name="add" size={32} color={colors.text.light} />
            <Text style={styles.addButtonText}>Add Player</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.actions}
        >
          <Button
            title="Start Game"
            onPress={handleStartGame}
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={players.length < 2}
            style={styles.startButton}
          />
          <Button
            title="Resume Existing Game"
            onPress={handleResumeGame}
            variant="outline"
            size="md"
            style={styles.resumeButton}
          />
        </Animated.View>

        {/* Add Player Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={styles.modalContent}
                >
                  <Text style={styles.modalTitle}>Add New Player</Text>
                  
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Player name"
                    placeholderTextColor={colors.text.muted}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                    autoCapitalize="words"
                    maxLength={20}
                  />

                  <View style={styles.modalButtons}>
                    <Button
                      title="Cancel"
                      onPress={() => setModalVisible(false)}
                      variant="ghost"
                      size="md"
                      style={styles.modalButton}
                    />
                    <Button
                      title="Add"
                      onPress={handleAddPlayer}
                      variant="primary"
                      size="md"
                      disabled={!playerName.trim()}
                      style={styles.modalButton}
                    />
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  playerCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  playerCountNumber: {
    fontSize: fontSize.hero,
    fontWeight: 'bold',
    color: colors.primary,
  },
  playerCountLabel: {
    fontSize: fontSize.lg,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
  },
  addButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  addButtonText: {
    color: colors.text.light,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  startButton: {
    borderRadius: borderRadius.lg,
  },
  resumeButton: {
    borderRadius: borderRadius.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default GameSetupScreen;

