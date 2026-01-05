export const Colors = {
  background: '#0F0F1A',        // Deep dark for sunset night
  cardBackground: 'rgba(30, 20, 40, 0.65)', // Frosted glass effect
  sunsetPrimary: '#FF6B6B',      // Warm coral
  sunsetSecondary: '#FFA06B',    // Peach orange
  sunsetAccent: '#D48FF9',       // Soft lavender purple
  sunsetGlow: '#FF9F9F',        // Gentle pink
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0FF',
  success: '#A8E6CF',           // Soft mint for checkmarks
  border: 'rgba(255, 255, 255, 0.1)',
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
