import React, { useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

const SwipeCard = ({ card }) => {
  const [cardPosition, setCardPosition] = useState({
    x: 0,
    y: 0,
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        setCardPosition({
          x: gesture.dx,
          y: gesture.dy,
        });
      },
      onPanResponderRelease: (event, gesture) => {
        // Handle swipe event
        if (gesture.dx > 100) {
          // Swipe right
        } else if (gesture.dx < -100) {
          // Swipe left
        } else {
          // Reset card position
          setCardPosition({ x: 0, y: 0 });
        }
      },
    }),
  );

  const animatedStyle = {
    transform: [
      { translateX: cardPosition.x },
      { translateY: cardPosition.y },
    ],
  };

  return (
    <Animated.View style={animatedStyle} {...panResponder.current}>
      {card}
    </Animated.View>
  );
};

export default SwipeCard;