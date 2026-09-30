import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import Button from './Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CallsTricksSheetProps {
  onSubmitCall: (value: number) => void;
  onSubmitTrick: (value: number) => void;
  maxValue: number;
  playerName?: string;
  roundNo?: number;
}

export interface CallsTricksSheetRef {
  open: () => void;
  close: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CallsTricksSheet = forwardRef<CallsTricksSheetRef, CallsTricksSheetProps>(
  ({ onSubmitCall, onSubmitTrick, maxValue, playerName, roundNo }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const snapPoints = ['55%'];

    useImperativeHandle(ref, () => ({
      open: () => {
        setValue(0);
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const increment = () => {
      if (value < maxValue) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setValue((v) => v + 1);
      }
    };

    const decrement = () => {
      if (value > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setValue((v) => v - 1);
      }
    };

    const handleSubmitCall = async () => {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onSubmitCall(value);
      setIsLoading(false);
      bottomSheetRef.current?.close();
    };

    const handleSubmitTrick = async () => {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onSubmitTrick(value);
      setIsLoading(false);
      bottomSheetRef.current?.close();
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How many?</Text>
            {playerName && roundNo && (
              <Text style={styles.subtitle}>
                {playerName} · Round {roundNo}
              </Text>
            )}
          </View>

          {/* Number Picker */}
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              onPress={decrement}
              style={[styles.pickerButton, value === 0 && styles.pickerButtonDisabled]}
              disabled={value === 0}
            >
              <Ionicons
                name="remove"
                size={32}
                color={value === 0 ? colors.text.muted : colors.text.primary}
              />
            </TouchableOpacity>

            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{value}</Text>
            </View>

            <TouchableOpacity
              onPress={increment}
              style={[styles.pickerButton, value === maxValue && styles.pickerButtonDisabled]}
              disabled={value === maxValue}
            >
              <Ionicons
                name="add"
                size={32}
                color={value === maxValue ? colors.text.muted : colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Submit Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.submitButton, styles.tricksButton]}
              onPress={handleSubmitTrick}
              disabled={isLoading}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.text.primary} />
              <Text style={[styles.buttonText, styles.tricksButtonText]}>Tricks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.callsButton]}
              onPress={handleSubmitCall}
              disabled={isLoading}
            >
              <Ionicons name="megaphone" size={24} color={colors.text.primary} />
              <Text style={[styles.buttonText, styles.callsButtonText]}>Calls</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Select */}
          <View style={styles.quickSelectContainer}>
            <Text style={styles.quickSelectLabel}>Quick select:</Text>
            <View style={styles.quickSelectButtons}>
              {Array.from({ length: Math.min(maxValue + 1, 7) }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.quickSelectButton,
                    value === i && styles.quickSelectButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setValue(i);
                  }}
                >
                  <Text
                    style={[
                      styles.quickSelectText,
                      value === i && styles.quickSelectTextActive,
                    ]}
                  >
                    {i}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handleIndicator: {
    backgroundColor: colors.text.muted,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  pickerButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  valueContainer: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  valueText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButton: {
    width: (SCREEN_WIDTH - spacing.lg * 4) / 2,
    height: 80,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  tricksButton: {
    backgroundColor: colors.secondary,
  },
  callsButton: {
    backgroundColor: colors.highlight,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  tricksButtonText: {
    color: colors.text.primary,
  },
  callsButtonText: {
    color: colors.text.primary,
  },
  quickSelectContainer: {
    width: '100%',
    alignItems: 'center',
  },
  quickSelectLabel: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  quickSelectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  quickSelectButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSelectButtonActive: {
    backgroundColor: colors.primary,
  },
  quickSelectText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  quickSelectTextActive: {
    color: colors.text.light,
  },
});

export default CallsTricksSheet;

