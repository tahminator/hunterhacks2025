import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function HomeScreen() {
  // Image URL for text background
  const imageUrl = "https://images.pexels.com/photos/4039710/pexels-photo-4039710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // Function to create text with image background
  const renderTextWithImageBackground = (text, textStyle) => {
    // Determine if this is the title text ("I'm allergic to")
    const isTitle = textStyle === styles.allergicText;
    
    // Adjust container width based on text length and font size
    const containerWidth = textStyle.fontSize * text.length * (isTitle ? 0.4 : 0.65);
    
    return (
      <View style={{ alignSelf: 'flex-end' }}>
        <MaskedView
          maskElement={
            <Text style={textStyle}>
              {text}
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
                width: textStyle.fontSize * text.length * 30, // Wider than needed
                height: textStyle.fontSize * 4, // Taller than needed for zoom effect
                right: -270, // Move image to the right
                top: 40,  // Move image up (negative value moves up)
              }}
            >
              <Text style={[textStyle, { opacity: 0 }]}>
                {text}
              </Text>
            </ImageBackground>
          </View>
        </MaskedView>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#414a15','#414a15','#414a15','#f1da71']} // Dark Olive Green to Light Sea Green
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Profile icon in top right */}
        <View style={styles.header}>
        </View>
        
        {/* Allergen text content */}
        <View style={styles.allergenContent}>
          {/* Apply image background to "I'm allergic to" text */}
          {renderTextWithImageBackground("I'm allergic to", styles.allergicText)}
          
          {/* Allergens with image backgrounds */}
          {renderTextWithImageBackground("Gluten", styles.allergenItem)}
          {renderTextWithImageBackground("Peanuts", styles.allergenItem)}
          {renderTextWithImageBackground("Pistachios", styles.allergenItem)}
          
          {/* Background circle for the "Aller free" overlay */}
          <View style={styles.allerFreeOuterContainer}>
            <View style={styles.allerFreeBackCircle}></View>
            <ImageBackground
              source={{ uri: "https://i.imgur.com/hCzWKIl.png" }} // Using the same texture image as text for consistency
              style={styles.allerFreeCircle}
              imageStyle={{ 
                borderRadius: 90, // Same as the container to make the image rounded
                opacity: 0.9, // Slightly transparent to ensure text readability
              }}
            >
              <Text style={styles.allerText}>Aller</Text>
              <Text style={styles.freeText}>free</Text>
            </ImageBackground>
          </View>
          
          {renderTextWithImageBackground("Corn", styles.allergenItem)}
          {renderTextWithImageBackground("Soy", styles.allergenItem)}
          {renderTextWithImageBackground("Shellfish", styles.allergenItem)}
          
          {/* Apply both image background and faded effect to "Avocados" */}
          <View style={{ opacity: 0.6 }}>
            {renderTextWithImageBackground("Avocados", styles.allergenItem)}
          </View>
        </View>
        
        {/* Buttons at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingRight: 10,
  },
  allergenContent: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 30,
  },
  allergicText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#e5a268',
    textAlign: 'right',
  },
  allergenItem: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#e5a268', // This color won't be visible with image background
    textAlign: 'right',
    lineHeight: 76,
    marginVertical: 4, // Added to ensure proper spacing between items
  },
  allerFreeOuterContainer: {
    position: 'absolute',
    alignSelf: 'center',
    left: 10,
    top: '45%',
    zIndex: 10,
  },
  allerFreeBackCircle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(130, 142, 63, 0.4)', // Light green with opacity
    left: -15,
    top: -15,
  },
  allerFreeCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#5e601a', // Updated color as requested
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // To ensure the grain stays within the circle
  },
  allerText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: -10,
    // In a real app, you would use: fontFamily: 'Playfair', 
    // Playfair Display Italic looks similar to the font in the image
  },
  freeText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
    fontStyle: 'italic',
    // In a real app, you would use: fontFamily: 'Playfair',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: '#414a15',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16
  },
  signupButton: {
    backgroundColor: '#828e3f',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  guestText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});