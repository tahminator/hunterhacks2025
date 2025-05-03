import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
} from 'react-native';
import AddOtherAllergenProfileModal from './ProfileAdd';

type Allergy = {
  name: string;
  severity: string;
  color: string;
};

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

  // Optional: Confirm before deleting
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
        <Button title="Edit" color="#fff" onPress={() => setModalVisible(true)} />
      </ImageBackground>

      <AddOtherAllergenProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialProfileName={name}
        initialAllergies={allergies}
        // You can toggle between confirmDelete and handleDelete
        onDelete={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  leftSection: {
    flex: 2,
    padding: 15,
  },
  editSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    padding: 5,
  },
  swooshImage: {
    width: '100%',
    height: '100%',
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