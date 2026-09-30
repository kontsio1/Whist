/**
 * Whist Mobile App Color Palette
 * Based on: https://coolors.co/100b00-694873-97d8c4-dcccff-046865
 */

export const colors = {
  // Primary brand colors
  primary: '#046865',      // Teal - Main brand color
  secondary: '#97d8c4',    // Mint green - Secondary/accent
  accent: '#694873',       // Purple - Highlights
  highlight: '#dcccff',    // Light lavender - Subtle accents
  dark: '#100b00',         // Near black - Text/dark elements

  // Extended palette
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    dark: '#1A1A2E',
    card: '#FFFFFF',
  },

  text: {
    primary: '#100b00',
    secondary: '#4A5568',
    light: '#FFFFFF',
    muted: '#718096',
  },

  // Semantic colors
  success: '#48BB78',
  error: '#E53E3E',
  warning: '#ED8936',
  info: '#4299E1',

  // Game-specific colors
  calls: '#dcccff',        // Light purple for calls
  tricks: '#97d8c4',       // Mint for tricks
  score: '#694873',        // Purple for score display
  dealer: '#046865',       // Teal for dealer indicator

  // Gradients (as start/end pairs)
  gradients: {
    primary: ['#046865', '#97d8c4'],
    accent: ['#694873', '#dcccff'],
    dark: ['#100b00', '#2D3748'],
  },

  // Transparency helpers
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
};

export type ColorKey = keyof typeof colors;

