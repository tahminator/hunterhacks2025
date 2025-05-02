import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#414a15', '#828e3f', '#d4b84d']} // Dark olive green to yellow gradient
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
          <Text style={styles.allergicText}>I'm allergic to</Text>
          <Text style={styles.allergenItem}>Gluten</Text>
          <Text style={styles.allergenItem}>Peanuts</Text>
          <Text style={styles.allergenItem}>Pistachios</Text>
          
          {/* Background circle for the "Aller free" overlay */}
          <View style={styles.allerFreeOuterContainer}>
            <View style={styles.allerFreeBackCircle}></View>
            <View style={styles.allerFreeCircle}>
              <Text style={styles.allerText}>Aller</Text>
              <Text style={styles.freeText}>free</Text>
            </View>
          </View>
          
          <Text style={styles.allergenItem}>Corn</Text>
          <Text style={styles.allergenItem}>Soy</Text>
          <Text style={styles.allergenItem}>Shellfish</Text>
          <Text style={[styles.allergenItem, styles.fadedAllergen]}>Avocados</Text>
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
    marginBottom: 10,
  },
  allergenItem: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#e5a268',
    textAlign: 'right',
    lineHeight: 76,
  },
  fadedAllergen: {
    opacity: 0.6,
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