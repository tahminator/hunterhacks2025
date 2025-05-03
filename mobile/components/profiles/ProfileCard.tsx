import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ProfileAdd from './ProfileAdd';

type Allergy = { name: string; severity: string; color?: string };

type Props = {
  name: string;
  allergies: Allergy[];
  onSave?: (name: string, allergies: Allergy[]) => void;
  onDelete?: () => void;
};

export default function ProfileCard({
  name: initialName,
  allergies: initialAllergies,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState(initialName);
  const [allergies, setAllergies] = useState<Allergy[]>([...initialAllergies]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalSubmit = (profile: {
    username: string;
    profileName: string;
    allergies: Allergy[];
  }) => {
    setName(profile.profileName);
    setAllergies(profile.allergies);
    setModalVisible(false);
    onSave?.(profile.profileName, profile.allergies);
  };

  const handleDelete = () => {
    setModalVisible(false);
    onDelete?.();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Text style={styles.name}>{name}</Text>
        {allergies?.map((a, i) => (
          <Text key={i} style={[styles.allergyText, { color: a.color }]}>
            • {a.name} <Text style={styles.level}>({a.severity})</Text>
          </Text>
        ))}
      </View>

      <ImageBackground
        source={require('../../assets/images/Vector.png')}
        style={styles.editSection}
        resizeMode="cover"
        imageStyle={styles.swooshImage}
      >
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </ImageBackground>

      <ProfileAdd
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialProfileName={name}
        initialAllergies={allergies}
        onDelete={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  leftSection: {
    flex: 2,
    padding: 15,
  },
  editSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  swooshImage: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  editButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  allergyText: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  level: {
    fontWeight: 'normal',
    color: '#333',
  },
});