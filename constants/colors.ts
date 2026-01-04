export const colors = {
  black: '#000000',
  darkGray: '#121212',
  mediumGray: '#1E1E1E',
  lightGray: '#2A2A2A',
  borderGray: '#3A3A3A',
  cardGray: '#1A1A1A',
  cardLight: '#252525',

  textPrimary: '#FFFFFF',
  textSecondary: '#E8E8E8',
  textTertiary: '#9E9E9E',
  textQuaternary: '#5A5A5A',

  accent: '#007AFF',
  accentLight: '#0A84FF',
  accentDark: '#0051D5',
  accentGradientStart: '#007AFF',
  accentGradientEnd: '#00C7BE',

  success: '#34C759',
  successLight: '#30D158',
  successDark: '#248A3D',

  warning: '#FF9F0A',
  warningLight: '#FFD60A',
  warningDark: '#FF6B00',

  error: '#FF3B30',
  errorLight: '#FF453A',
  errorDark: '#D70015',

  focus: '#5AC8FA',
  focusGradientStart: '#5AC8FA',
  focusGradientEnd: '#007AFF',

  calm: '#32D74B',
  calmGradientStart: '#32D74B',
  calmGradientEnd: '#30B0C7',

  sleep: '#BF5AF2',
  sleepGradientStart: '#BF5AF2',
  sleepGradientEnd: '#5856D6',

  energy: '#FF9F0A',
  energyGradientStart: '#FF9F0A',
  energyGradientEnd: '#FF453A',

  pinterest: {
    rose: '#FFB6C1',
    coral: '#FF7F7F',
    peach: '#FFD4A3',
    mint: '#B2E4D5',
    lavender: '#E6E6FA',
    sky: '#A8D8EA',
    sage: '#C7CEAA',
    blush: '#FFC9D4',
  },

  gradients: {
    sunset: ['#FF6B9D', '#FFA07A'],
    ocean: ['#4FACFE', '#00F2FE'],
    forest: ['#56CCF2', '#2F80ED'],
    berry: ['#FA709A', '#FEE140'],
    dream: ['#A8EDEA', '#FED6E3'],
    night: ['#667EEA', '#764BA2'],
    gold: ['#FFD89B', '#FF9A76'],
    purple: ['#C471F5', '#FA71CD'],
  },

  shadow: {
    small: 'rgba(0, 0, 0, 0.15)',
    medium: 'rgba(0, 0, 0, 0.2)',
    large: 'rgba(0, 0, 0, 0.3)',
    colored: 'rgba(0, 122, 255, 0.35)',
  },

  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.75)',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  },

  glass: {
    background: 'rgba(26, 26, 26, 0.85)',
    border: 'rgba(255, 255, 255, 0.1)',
  },

  separator: 'rgba(84, 84, 88, 0.65)',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 9999,
};

export const typography = {
  fontSizes: {
    xxs: 11,
    xs: 13,
    sm: 15,
    md: 17,
    lg: 20,
    xl: 28,
    xxl: 34,
    xxxl: 48,
  },
  fontWeights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    body: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 1.2,
  },
};

export const elevation = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};
