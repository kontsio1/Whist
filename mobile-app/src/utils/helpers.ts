/**
 * Helper utilities - Ported from whist-game
 */

export const calculateAverage = (arr: number[] | undefined): string => {
  if (!arr || arr.length === 0) return '0';
  const validNumbers = arr.filter((n) => !isNaN(n) && isFinite(n));
  if (validNumbers.length === 0) return '0';
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return (sum / validNumbers.length).toFixed(2);
};

export const findMaxValue = (
  arr: number[] | undefined
): { max: number; maxIndex: number } => {
  if (!arr || arr.length === 0) return { max: 0, maxIndex: 0 };
  
  let max = -Infinity;
  let maxIndex = 0;
  
  arr.forEach((val, index) => {
    if (!isNaN(val) && isFinite(val) && val > max) {
      max = val;
      maxIndex = index;
    }
  });
  
  return { max: isFinite(max) ? max : 0, maxIndex };
};

export const getPlayerKey = (index: number): string => {
  return `player${index + 1}`;
};

export const formatScore = (score: number | undefined): string => {
  if (score === undefined || score === null) return '-';
  return score.toString();
};

