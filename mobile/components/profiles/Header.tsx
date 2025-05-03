import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default function Header() {
  return (
    <ImageBackground
      source={require('../../assets/images/user.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.menuButton}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => { /* menu action */ }}>
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Hi, User!</Text>

        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    alignItems: 'center',
    width: '100%',
  },
  menuButton: {
    position: 'absolute',
    top: -20,
    right: 20,
  },
  menuIcon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  menuIconText: {
    fontSize: 40,
    color: '#000',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  profileIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 48,
  },
});