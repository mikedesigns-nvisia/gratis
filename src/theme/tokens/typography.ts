// Base on golden ratio (1.618)
const BASE_FONT_SIZE = 16;

// Scale using golden ratio
const scale = (ratio: number) => Math.round(BASE_FONT_SIZE * ratio);

export const typography = {
  // Font families
  fontFamily: {
    primary: 'Inter-Regular', // Primary font
    secondary: 'Inter-Medium', // Medium weight
    bold: 'Inter-Bold', // Bold weight
  },
  
  // Font sizes using golden ratio
  fontSize: {
    xxs: scale(0.618), // ~10px
    xs: scale(0.764),  // ~12px
    sm: scale(0.882),  // ~14px
    md: scale(1),      // 16px (base)
    lg: scale(1.236),  // ~20px
    xl: scale(1.618),  // ~26px
    xxl: scale(2),     // ~32px
    xxxl: scale(2.618), // ~42px
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  
  // Line heights (1.5x for body text, 1.2x for headings)
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },
};
