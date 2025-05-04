import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated 
} from 'react-native';

const CARD_WIDTH = 180;
const CARD_SPACING = 10;

const PhotoModal = ({ 
  uri, 
  currentScreen, 
  panResponder, 
  slideAnimation, 
  handleBackButton, 
  renderMainScreen, 
  renderProfileSelectionScreen 
}) => {
  return (
    <Animated.View
      style={[
        styles.fullScreenContainer,
      ]}
    >
      {/* Top portion showing captured image - only show for main and profile selection screens */}
      {currentScreen !== 'allergenResults' && (
        <Image
          source={{ uri: uri }}
          style={styles.capturedImage}
        />
      )}
      
      {/* Swipe indicator - only show for main and profile selection screens */}
      {currentScreen !== 'allergenResults' && (
        <View style={styles.swipeIndicator}>
          <View style={styles.swipeIndicatorBar} />
        </View>
      )}
      
      {/* Modal content without allergenResults branch */}
      {currentScreen !== 'allergenResults' && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.modal,
            {
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Wavy top border */}
          <View style={styles.wavyBorder} />
          <View style={styles.modalContent}>
            {/* Render content based on current screen */}
            {currentScreen === 'main' ? renderMainScreen() : renderProfileSelectionScreen()}
          </View>
        </Animated.View>
      )}
      
      {/* Button to take another picture - positioned outside the modal */}
      {currentScreen !== 'allergenResults' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  capturedImage: {
    width: "100%",
    height: "35%",
    position: "absolute",
    top: 0,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingVertical: 10,
  },
  swipeIndicatorBar: {
    width: 60,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    opacity: 0.7,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  wavyBorder: {
    height: 60,
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    top: -60,
    backgroundColor: "#EAEA00"
  },
  modalContent: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PhotoModal;