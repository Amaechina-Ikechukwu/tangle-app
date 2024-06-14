import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const SpeechBubbleCutout = () => {
  return (
    <Svg width="100%" height="50" viewBox="0 0 400 50" style={{ position: 'absolute', bottom: 0, left: 0 }}>
      <Rect x="0" y="0" width="400" height="40" fill="white" />
      <Path d="M 180 40 L 200 50 L 220 40 Z" fill="white" />
    </Svg>
  );
};

export default SpeechBubbleCutout;
