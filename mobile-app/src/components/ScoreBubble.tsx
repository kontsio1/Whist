import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, fontSize } from '../theme';

interface ScoreBubbleProps {
  calls?: number | string;
  tricks?: number | string;
  score?: number | string;
  highlighted?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ScoreBubble: React.FC<ScoreBubbleProps> = ({
  calls,
  tricks,
  score,
  highlighted = false,
  onPress,
  size = 'md',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { container: 50, scoreBubble: 32, smallBubble: 22, scoreFontSize: 14, smallFontSize: 10 };
      case 'lg':
        return { container: 80, scoreBubble: 50, smallBubble: 32, scoreFontSize: 22, smallFontSize: 14 };
      default:
        return { container: 65, scoreBubble: 40, smallBubble: 26, scoreFontSize: 18, smallFontSize: 12 };
    }
  };

  const sizes = getSizes();

  const renderBubble = () => (
    <View style={[styles.container, { width: sizes.container, height: sizes.container }]}>
      {/* Main score bubble (purple) */}
      <View
        style={[
          styles.scoreBubble,
          {
            width: sizes.scoreBubble,
            height: sizes.scoreBubble,
            borderRadius: sizes.scoreBubble / 2,
            opacity: highlighted ? 1 : 0.8,
          },
        ]}
      >
        <Text style={[styles.scoreText, { fontSize: sizes.scoreFontSize }]}>
          {score !== undefined && score !== '' ? score : '-'}
        </Text>
      </View>

      {/* Calls bubble (lavender - top right) */}
      <View
        style={[
          styles.callsBubble,
          {
            width: sizes.smallBubble,
            height: sizes.smallBubble,
            borderRadius: sizes.smallBubble / 2,
            opacity: highlighted ? 1 : 0.8,
          },
        ]}
      >
        <Text style={[styles.smallText, { fontSize: sizes.smallFontSize }]}>
          {calls !== undefined && calls !== '' ? calls : '?'}
        </Text>
      </View>

      {/* Tricks bubble (mint - bottom left) */}
      <View
        style={[
          styles.tricksBubble,
          {
            width: sizes.smallBubble,
            height: sizes.smallBubble,
            borderRadius: sizes.smallBubble / 2,
            opacity: highlighted ? 1 : 0.8,
          },
        ]}
      >
        <Text style={[styles.smallText, { fontSize: sizes.smallFontSize }]}>
          {tricks !== undefined && tricks !== '' ? tricks : '?'}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedTouchable
        style={animatedStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {renderBubble()}
      </AnimatedTouchable>
    );
  }

  return <Animated.View style={animatedStyle}>{renderBubble()}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBubble: {
    backgroundColor: colors.accent, // Purple
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  scoreText: {
    color: colors.text.light,
    fontWeight: 'bold',
  },
  callsBubble: {
    backgroundColor: colors.highlight, // Light lavender
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  tricksBubble: {
    backgroundColor: colors.secondary, // Mint
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  smallText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});

export default ScoreBubble;

