import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  username?: string;
  onLogout?: () => void;
};

export default function Header({ username = 'User', onLogout }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/user.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.menuButton}>
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => setMenuVisible((prev) => !prev)}
          >
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>

          {menuVisible && (
            <TouchableOpacity style={styles.menuDropdown} onPress={onLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.greeting}>Hi, {username}!</Text>

        <TouchableOpacity style={styles.profileIcon} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.profilePhoto} />
          ) : (
            <Text style={styles.profileIconText}>👤</Text>
          )}
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    paddingTop: 70,
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
    alignItems: 'flex-end',
  },
  menuIcon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  menuIconText: {
    fontSize: 20,
    color: '#000',
  },
  menuDropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
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
    overflow: 'hidden',
  },
  profileIconText: {
    fontSize: 48,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  photoButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});