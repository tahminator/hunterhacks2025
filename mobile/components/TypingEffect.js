import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Animated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { ImageBackground } from 'react-native';

const TypingEffect = ({ phrasesToType, textStyle, imageUrl, typingSpeed = 35, pauseTime = 1000, backspaceSpeed = 15 }) => {
  // Using a regular state for the display text
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);
  
  // Add animation opacity for smoother transitions
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Ensure we have phrases to work with
  useEffect(() => {
    // Clear any existing timeout when component unmounts or effect reruns
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Ensure we have phrases to work with
    if (!phrasesToType || phrasesToType.length === 0) return;
    
    const currentPhrase = phrasesToType[currentPhraseIndex];
    
    const handleTyping = () => {
      // If we're typing and haven't completed the word
      if (isTyping && !isDeleting && displayText.length < currentPhrase.length) {
        // Get the next character to type
        const nextChar = currentPhrase.charAt(displayText.length);
        
        // Add slight randomness to typing speed for realism (between 80% and 120% of typingSpeed)
        const randomizedSpeed = Math.floor(typingSpeed * (0.8 + Math.random() * 0.4));
        
        // Update the text
        setDisplayText(prevText => prevText + nextChar);
        
        // Schedule the next character
        timeoutRef.current = setTimeout(handleTyping, randomizedSpeed);
      } 
      // If we've finished typing the current phrase
      else if (isTyping && !isDeleting && displayText.length === currentPhrase.length) {
        // Add a slight fade effect while waiting
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: pauseTime * 0.3,
            useNativeDriver: true
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: pauseTime * 0.7,
            useNativeDriver: true
          })
        ]).start();
        
        // Schedule deletion after pause
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          handleTyping();
        }, pauseTime);
      }
      // If we're deleting
      else if (isDeleting && displayText.length > 0) {
        // Add slight randomness to backspace speed for realism
        const randomizedSpeed = Math.floor(backspaceSpeed * (0.9 + Math.random() * 0.2));
        
        // Delete one character
        setDisplayText(prevText => prevText.substring(0, prevText.length - 1));
        
        // Schedule next deletion
        timeoutRef.current = setTimeout(handleTyping, randomizedSpeed);
      }
      // If we've deleted everything, move to next phrase
      else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        
        // Move to the next phrase in the array
        const nextIndex = (currentPhraseIndex + 1) % phrasesToType.length;
        setCurrentPhraseIndex(nextIndex);
        
        // Fade in for the new phrase
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true
        }).start(() => {
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
          }).start();
        });
        
        // Small delay before starting to type the next phrase
        timeoutRef.current = setTimeout(() => {
          setIsTyping(true);
          handleTyping();
        }, 150);
      }
    };

    // Kickstart the typing effect
    timeoutRef.current = setTimeout(handleTyping, 100);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isTyping, isDeleting, currentPhraseIndex, phrasesToType, typingSpeed, backspaceSpeed, pauseTime, opacityAnim]);

  // Using the same masking technique as your original code
  const isTitle = true; // This is the title text
  // Increase the multiplier to make the container wider
  const containerWidth = textStyle.fontSize * (displayText ? displayText.length : 1) * (isTitle ? 0.5 : 0.65);

  return (
    <Animated.View style={{ 
      alignSelf: 'flex-end',
      paddingRight: 15, // Add padding to move text away from the right edge
      marginRight: 5, // Additional margin to ensure nothing gets cut off
      opacity: opacityAnim, // Use animated opacity
    }}>
      <MaskedView
        maskElement={
          <Text style={textStyle}>
            {displayText}
          </Text>
        }
      >
        <View style={{
          height: textStyle.fontSize * 1.2,
          width: containerWidth,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <ImageBackground
            source={{ uri: imageUrl }}
            style={{
              width: textStyle.fontSize * (displayText ? displayText.length : 1) * 30,
              height: textStyle.fontSize * 4,
              right: -270,
              top: 40,
            }}
          >
            <Text style={[textStyle, { opacity: 0 }]}>
              {displayText}
            </Text>
          </ImageBackground>
        </View>
      </MaskedView>
    </Animated.View>
  );
};

export default TypingEffect;