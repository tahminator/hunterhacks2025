import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import AllergenResultsScreen from "./AllergenResultsScreen";

const PhotoModal = ({
  uri,
  currentScreen,
  panResponder,
  slideAnimation,
  handleBackButton,
  renderMainScreen,
  renderProfileSelectionScreen,
  isModalOpen,
  cameraTransition,
  profiles, // Add this prop to receive profiles from parent component
  data,
}) => {
  const renderAllergenResultsScreen = () => {
    console.log(data.length);
    // Pass the actual selected profiles
    return (
      <AllergenResultsScreen
        data={data}
        selectedProfiles={profiles || []}
        onSaveResults={handleBackButton}
        isPersonalProfile={profiles?.length === 1 && profiles[0].name === "You"}
      />
    );
  };

  console.log(currentScreen);

  const renderScreenContent = () => {
    switch (currentScreen) {
      case "main":
        return renderMainScreen();
      case "profileSelection":
        return renderProfileSelectionScreen();
      case "results":
        return renderAllergenResultsScreen();
      default:
        return renderMainScreen();
    }
  };

  return (
    <Animated.View
      style={[
        styles.fullScreenContainer,
        {
          opacity: cameraTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          zIndex: isModalOpen ? 2 : 0,
          elevation: isModalOpen ? 2 : 0,
        },
      ]}
      pointerEvents={isModalOpen ? "auto" : "none"}
    >
      {/* Captured image */}
      <Image source={{ uri }} style={styles.capturedImage} />

      {/* Swipe indicator */}
      <Animated.View
        style={[
          styles.swipeIndicator,
          {
            opacity: slideAnimation,
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.swipeIndicatorBar} />
      </Animated.View>

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      {/* Modal content */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.wavyBorder} />
        <View style={styles.modalContent}>{renderScreenContent()}</View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  capturedImage: {
    width: "100%",
    height: "35%",
    position: "absolute",
    top: 0,
  },
  swipeIndicator: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    paddingVertical: 10,
  },
  swipeIndicatorBar: {
    width: 60,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    opacity: 0.7,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wavyBorder: {
    height: 20,
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    top: -20,
  },
  modalContent: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PhotoModal;
