// Base spacing unit (8px is common in mobile)
const BASE_SPACING = 8;

// Scale using golden ratio
const scale = (ratio: number) => Math.round(BASE_SPACING * ratio);

export const spacing = {
  // Core spacing values
  xxs: scale(0.382), // ~3px
  xs: scale(0.618),  // ~5px
  sm: scale(1),      // 8px (base)
  md: scale(1.618),  // ~13px
  lg: scale(2.618),  // ~21px
  xl: scale(4.236),  // ~34px
  xxl: scale(6.854), // ~55px
  
  // Specific spacing for consistent padding/margins
  inset: {
    xs: scale(0.618),
    sm: scale(1),
    md: scale(1.618),
    lg: scale(2.618),
    xl: scale(4.236),
  },
  
  // Layout specific spacing
  layout: {
    xs: scale(1.618),
    sm: scale(2.618),
    md: scale(4.236),
    lg: scale(6.854),
    xl: scale(11.09),
  },
};
