import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Text as SvgText, Polygon } from 'react-native-svg';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { statsService } from '../utils/api';
import { StatsGetRequest, RootStackParamList } from '../types';
import { calculateAverage, findMaxValue } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PlayerStatsRouteProp = RouteProp<RootStackParamList, 'PlayerStats'>;

// Simple Radar Chart Component
interface RadarChartProps {
  data: { precision: number; recall: number; accuracy: number }[];
  size: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size }) => {
  const center = size / 2;
  const radius = size / 2 - 40;
  const axes = ['Precision', 'Recall', 'Accuracy'];
  const angleStep = (2 * Math.PI) / axes.length;
  const chartColors = [colors.accent, colors.primary, colors.secondary];

  const getPoint = (value: number, axisIndex: number): { x: number; y: number } => {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = value * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const renderAxes = () => {
    return axes.map((axis, i) => {
      const point = getPoint(1, i);
      const labelPoint = getPoint(1.2, i);
      return (
        <React.Fragment key={axis}>
          <Line
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke={colors.background.secondary}
            strokeWidth={1}
          />
          <SvgText
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize={10}
            fill={colors.text.secondary}
            textAnchor="middle"
          >
            {axis}
          </SvgText>
        </React.Fragment>
      );
    });
  };

  const renderGridCircles = () => {
    return [0.25, 0.5, 0.75, 1].map((scale) => (
      <Circle
        key={scale}
        cx={center}
        cy={center}
        r={radius * scale}
        fill="none"
        stroke={colors.background.secondary}
        strokeWidth={1}
        strokeDasharray="4,4"
      />
    ));
  };

  const renderDataPolygons = () => {
    return data.slice(0, 3).map((item, dataIndex) => {
      const values = [item.precision || 0, item.recall || 0, item.accuracy || 0];
      const points = values
        .map((value, i) => {
          const clampedValue = Math.min(1, Math.max(0, isNaN(value) ? 0 : value));
          const point = getPoint(clampedValue, i);
          return `${point.x},${point.y}`;
        })
        .join(' ');

      return (
        <Polygon
          key={dataIndex}
          points={points}
          fill={chartColors[dataIndex % chartColors.length]}
          fillOpacity={0.2}
          stroke={chartColors[dataIndex % chartColors.length]}
          strokeWidth={2}
        />
      );
    });
  };

  return (
    <Svg width={size} height={size}>
      {renderGridCircles()}
      {renderAxes()}
      {renderDataPolygons()}
    </Svg>
  );
};

const PlayerStatsScreen: React.FC = () => {
  const route = useRoute<PlayerStatsRouteProp>();
  const { player } = route.params;

  const [stats, setStats] = useState<StatsGetRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [player]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getPlayerStats(player);
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color={colors.error} />
          <Text style={styles.errorTitle}>Unable to Load Stats</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const bestCall = findMaxValue(stats.F1Score);
  const avgPrecision = calculateAverage(stats.precision);
  const avgRecall = calculateAverage(stats.recall);
  const avgF1 = calculateAverage(stats.F1Score);

  // Prepare radar chart data
  const radarData = stats.precision.map((_, index) => ({
    precision: isNaN(stats.precision[index]) || !isFinite(stats.precision[index]) 
      ? 0 : stats.precision[index],
    recall: isNaN(stats.recall[index]) || !isFinite(stats.recall[index]) 
      ? 0 : stats.recall[index],
    accuracy: stats.accuracy || 0,
  }));

  const chartColors = [colors.accent, colors.primary, colors.secondary];

  // Stat card component
  const StatCard: React.FC<{
    title: string;
    value: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    delay: number;
  }> = ({ title, value, description, icon, delay }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={styles.statCard}
    >
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statDescription}>{description}</Text>
    </Animated.View>
  );

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
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {player.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.playerName}>{player}</Text>
        </Animated.View>

        {/* Overall Stats */}
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Accuracy"
              value={`${((stats.accuracy || 0) * 100).toFixed(1)}%`}
              description="Correct call predictions"
              icon="checkmark-circle"
              delay={300}
            />
            <StatCard
              title="Precision"
              value={`${(parseFloat(avgPrecision) * 100).toFixed(1)}%`}
              description="Consistency of calls"
              icon="analytics"
              delay={400}
            />
            <StatCard
              title="Recall"
              value={`${(parseFloat(avgRecall) * 100).toFixed(1)}%`}
              description="Completeness of predictions"
              icon="refresh"
              delay={500}
            />
            <StatCard
              title="F1 Score"
              value={`${(parseFloat(avgF1) * 100).toFixed(1)}%`}
              description="Overall performance"
              icon="trophy"
              delay={600}
            />
          </View>
        </Animated.View>

        {/* Best Call */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={styles.bestCallSection}
        >
          <Ionicons name="star" size={32} color="#FFD700" />
          <View style={styles.bestCallInfo}>
            <Text style={styles.bestCallLabel}>Best Call</Text>
            <Text style={styles.bestCallValue}>{bestCall.maxIndex} tricks</Text>
            <Text style={styles.bestCallScore}>
              Score: {(bestCall.max * 100).toFixed(1)}%
            </Text>
          </View>
        </Animated.View>

        {/* Radar Chart */}
        <Animated.View
          entering={FadeIn.delay(800).duration(400)}
          style={styles.chartSection}
        >
          <Text style={styles.sectionTitle}>Performance by Call Number</Text>
          <View style={styles.chartContainer}>
            <RadarChart 
              data={radarData} 
              size={Math.min(SCREEN_WIDTH - spacing.lg * 4, 280)} 
            />
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {radarData.slice(0, 3).map((_, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: chartColors[index % chartColors.length] },
                  ]}
                />
                <Text style={styles.legendText}>{index} Calls</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Detailed Breakdown */}
        <Animated.View
          entering={FadeIn.delay(900).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Breakdown by Calls</Text>
          {stats.precision.map((precision, index) => (
            <View key={index} style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownIndex}>{index}</Text>
                <Text style={styles.breakdownText}>calls</Text>
              </View>
              <View style={styles.breakdownBars}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.precisionBar,
                      { width: `${Math.max((precision || 0) * 100, 5)}%` },
                    ]}
                  />
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.recallBar,
                      { width: `${Math.max((stats.recall[index] || 0) * 100, 5)}%` },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.breakdownScore}>
                {isNaN(stats.F1Score[index]) || !isFinite(stats.F1Score[index])
                  ? '-'
                  : `${(stats.F1Score[index] * 100).toFixed(0)}%`}
              </Text>
            </View>
          ))}
          <View style={styles.barLegend}>
            <View style={styles.barLegendItem}>
              <View style={[styles.barLegendDot, styles.precisionBar]} />
              <Text style={styles.barLegendText}>Precision</Text>
            </View>
            <View style={styles.barLegendItem}>
              <View style={[styles.barLegendDot, styles.recallBar]} />
              <Text style={styles.barLegendText}>Recall</Text>
            </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.hero,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  playerName: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIconContainer: {
    marginRight: spacing.xs,
  },
  statTitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statDescription: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  bestCallSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  bestCallInfo: {
    marginLeft: spacing.md,
  },
  bestCallLabel: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  bestCallValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  bestCallScore: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  chartSection: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  breakdownLabel: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  breakdownIndex: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  breakdownText: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginLeft: 2,
  },
  breakdownBars: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  precisionBar: {
    backgroundColor: colors.accent,
  },
  recallBar: {
    backgroundColor: colors.secondary,
  },
  breakdownScore: {
    width: 45,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'right',
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  barLegendText: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
});

export default PlayerStatsScreen;

