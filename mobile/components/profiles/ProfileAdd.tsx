import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import AddAllergyModal from '../profiles/AlleryModal';

type Allergy = { name: string; severity: string; color?: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profile: {
    username: string;
    profileName: string;
    allergies: Allergy[];
  }) => void;
  initialProfileName?: string;
  initialAllergies?: Allergy[];
  onDelete?: () => void;
};

export default function AddOtherAllergenProfileModal({
  visible,
  onClose,
  onSubmit,
  initialProfileName = '',
  initialAllergies = [],
  onDelete,
}: Props) {
  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState(initialProfileName);
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const removeAllergy = (index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (newAllergy: Allergy) => {
    setAllergies([...allergies, newAllergy]);
    setIsModalVisible(false);
  };

  const handleDone = () => {
    if (!profileName.trim()) {
      alert('Please fill in the profile name.');
      return;
    }
    onSubmit({
      username: username.trim() || profileName.trim(),
      profileName: profileName.trim(),
      allergies,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalWrapper}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.header}>
                {initialProfileName ? 'Edit Allergen Profile' : 'Add Allergen Profile'}
              </Text>

              {/* Only show username field for new profiles */}
              {!initialProfileName && (
                <>
                  <Text style={styles.label}>Search by Username (optional):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                  />
                </>
              )}

              <Text style={styles.label}>Profile Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the profile name"
                value={profileName}
                onChangeText={setProfileName}
              />

              <Text style={styles.label}>Allergies:</Text>
              {allergies.map((a, i) => (
                <View key={i} style={styles.allergyItem}>
                  <TouchableOpacity onPress={() => removeAllergy(i)}>
                    <Text style={styles.remove}>x</Text>
                  </TouchableOpacity>
                  <Text style={styles.allergyName}>{a.name}</Text>
                  <Text style={[styles.severity, { color: a.color || 'black' }]}>
                    {a.severity}
                  </Text>
                  <Image
                    source={require('../../assets/images/Circle.png')}
                    style={styles.arcImage}
                    resizeMode="contain"
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Allergy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>

              {onDelete && (
                <TouchableOpacity
                  style={[styles.doneButton, { backgroundColor: 'darkred' }]}
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}
                >
                  <Text style={styles.doneButtonText}>Delete Profile</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        <AddAllergyModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleAddAllergy}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  content: { paddingBottom: 20 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a762c',
    marginBottom: 20,
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    backgroundColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  remove: { marginRight: 10, fontSize: 16 },
  allergyName: { fontWeight: 'bold', color: '#6a762c', flex: 1 },
  severity: { color: 'darkred', marginRight: 10 },
  arcImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#a3b73b',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  doneButton: {
    backgroundColor: '#000',
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
}); 