import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize } from '../theme';

interface AccordionSection {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string[];
}

const sections: AccordionSection[] = [
  {
    title: 'Overview',
    icon: 'information-circle',
    content: [
      'Whist is a classic English trick-taking card game which was widely played in the 18th and 19th centuries.',
      'Although the rules are simple, there is scope for strategic play.',
    ],
  },
  {
    title: 'History',
    icon: 'time',
    content: [
      'Whist is a descendant of the 16th-century game of trump or ruff.',
      'The game takes its name from the 17th-century word "whist" meaning quiet, silent, attentive.',
      'Edmond Hoyle published "A Short Treatise on the Game of Whist" in 1742, which became the standard text for the next hundred years.',
      'In the 1890s, bridge whist became popular and eventually evolved into contract bridge.',
    ],
  },
  {
    title: 'Basic Rules',
    icon: 'book',
    content: [
      'A standard 52-card pack is used.',
      'Cards rank from highest to lowest: A K Q J 10 9 8 7 6 5 4 3 2.',
      'Whist is played by four players in two partnerships, sitting opposite each other.',
      'One may not comment upon the hand one was dealt nor signal to one\'s partner.',
    ],
  },
  {
    title: 'Dealing',
    icon: 'shuffle',
    content: [
      'Cards can be shuffled by any player, though usually by the player to dealer\'s left.',
      'The dealer deals out cards one at a time, face down, so each player has thirteen cards.',
      'The final card, belonging to the dealer, is turned face up to indicate the trump suit.',
      'The deal advances clockwise after each hand.',
    ],
  },
  {
    title: 'Play',
    icon: 'play',
    content: [
      'The player to the dealer\'s left leads to the first trick with any card.',
      'Players must follow suit by playing a card of the suit led if held.',
      'A player with no card of the suit led may play any card (discard or trump).',
      'The trick is won by the highest card of the suit led, unless a trump is played.',
      'The winner of each trick leads the next trick.',
    ],
  },
  {
    title: 'Scoring',
    icon: 'calculator',
    content: [
      'After all tricks are played, the side that won more tricks scores one point for each trick won in excess of six.',
      'A game is over when one team reaches a score of five.',
      '"Honours" rules give bonus points if partners hold the top four trump cards.',
    ],
  },
  {
    title: 'Tactics',
    icon: 'bulb',
    content: [
      '• Lead your strongest (usually longest) suit on the opening lead.',
      '• Lead the king from a sequence including it (including AK).',
      '• 2nd hand usually plays low, especially with a single honour.',
      '• 3rd hand usually plays high, using the lowest of touching honours.',
      '• Discards are usually low cards of an unwanted suit.',
    ],
  },
];

const AccordionItem: React.FC<{
  section: AccordionSection;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}> = ({ section, isOpen, onToggle, index }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
  }, [isOpen]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300)}
      style={styles.accordionItem}
    >
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.accordionTitleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={section.icon} size={24} color={colors.primary} />
          </View>
          <Text style={styles.accordionTitle}>{section.title}</Text>
        </View>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-down" size={24} color={colors.text.secondary} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.accordionContent}
        >
          {section.content.map((paragraph, idx) => (
            <Text key={idx} style={styles.contentText}>
              {paragraph}
            </Text>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const RulesScreen: React.FC = () => {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
          <View style={styles.headerIcon}>
            <Ionicons name="book" size={40} color={colors.text.light} />
          </View>
          <Text style={styles.title}>How to Play Whist</Text>
          <Text style={styles.subtitle}>
            A classic trick-taking card game
          </Text>
        </Animated.View>

        {/* Accordion Sections */}
        <View style={styles.accordionContainer}>
          {sections.map((section, index) => (
            <AccordionItem
              key={index}
              section={section}
              isOpen={openSections.has(index)}
              onToggle={() => toggleSection(index)}
              index={index}
            />
          ))}
        </View>

        {/* Quick Tips */}
        <Animated.View
          entering={FadeIn.delay(800).duration(400)}
          style={styles.tipsSection}
        >
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Watch what cards have been played to deduce what remains
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Only the last trick played can be reviewed by request
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Communication between partners must only be through cards played
            </Text>
          </View>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  accordionContainer: {
    gap: spacing.sm,
  },
  accordionItem: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accordionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  accordionContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
  },
  contentText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  tipsSection: {
    marginTop: spacing.xl,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  tipsTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});

export default RulesScreen;

