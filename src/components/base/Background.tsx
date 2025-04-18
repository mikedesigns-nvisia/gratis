import React from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/provider';

interface BackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showWaves?: boolean;
  waveColor?: string;
  backgroundColor?: string;
}

const { width } = Dimensions.get('window');

export const Background: React.FC<BackgroundProps> = ({
  children,
  style,
  contentStyle,
  showWaves = true,
  waveColor,
  backgroundColor,
}) => {
  const { theme } = useTheme();
  
  // Default colors from theme
  const bgColor = backgroundColor || theme.colors.background.primary;
  const wavesColor = waveColor || 'rgba(115, 69, 214, 0.08)'; // Purple with opacity
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }, style]}>
      {showWaves && (
        <View style={styles.wavesContainer} pointerEvents="none">
          {/* Top waves */}
          <Svg
            height={200}
            width={width}
            style={styles.topWaves}
            viewBox={`0 0 ${width} 200`}
            preserveAspectRatio="none"
          >
            <Path
              d={`M0,50 
                 C${width * 0.3},10 ${width * 0.6},80 ${width},30 
                 L${width},0 
                 L0,0 Z`}
              fill={wavesColor}
            />
            <Path
              d={`M0,100 
                 C${width * 0.4},60 ${width * 0.7},140 ${width},90 
                 L${width},0 
                 L0,0 Z`}
              fill={wavesColor}
              opacity={0.5}
              transform="translate(0, 20)"
            />
          </Svg>
          
          {/* Bottom waves */}
          <Svg
            height={200}
            width={width}
            style={styles.bottomWaves}
            viewBox={`0 0 ${width} 200`}
            preserveAspectRatio="none"
          >
            <Path
              d={`M0,150 
                 C${width * 0.3},180 ${width * 0.6},120 ${width},160 
                 L${width},200 
                 L0,200 Z`}
              fill={wavesColor}
            />
            <Path
              d={`M0,100 
                 C${width * 0.4},140 ${width * 0.7},60 ${width},110 
                 L${width},200 
                 L0,200 Z`}
              fill={wavesColor}
              opacity={0.5}
              transform="translate(0, 50)"
            />
          </Svg>
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  topWaves: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomWaves: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default Background;
