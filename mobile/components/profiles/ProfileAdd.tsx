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
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import AddAllergyModal from '../profiles/AllergyModal';

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

export default function ProfileAdd({
  visible,
  onClose,
  onSubmit,
  initialProfileName = '',
  initialAllergies = [],
  onDelete,
}: Props) {
  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState(initialProfileName || '');
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const severityImages: Record<string, any> = {
    Severe: require('../../assets/images/Circle.png'),
    Medium: require('../../assets/images/Circle1.png'),
    Slight: require('../../assets/images/Circle2.png'),
  };

  const severityGradients: Record<string, readonly [string, string]> = {
    Severe: ['#E66D57', '#4B0505'],
    Medium: ['#f5a623', '#d97706'],
    Slight: ['#a8e063', '#56ab2f'],
  };

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
                {initialProfileName ? 'Edit Profile' : 'Profile'}
              </Text>

              {!initialProfileName && (
                <>
                  <Text style={styles.label}>Search by Username:</Text>
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
              {allergies.map((a, i) => {
                const severityKey = a.severity.trim();
                const gradient = severityGradients[severityKey] || ['#ccc', '#999'];
                const image = severityImages[severityKey] || require('../../assets/images/Circle.png');

                return (
                  <View key={i} style={styles.allergyItem}>
                    <TouchableOpacity onPress={() => removeAllergy(i)}>
                      <Text style={styles.remove}>x</Text>
                    </TouchableOpacity>

                    <Text style={styles.allergyName}>{a.name}</Text>

                    <MaskedView maskElement={<Text style={styles.severity}>{a.severity}</Text>}>
                      <LinearGradient
                        colors={gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={[styles.severity, { opacity: 0 }]}>{a.severity}</Text>
                      </LinearGradient>
                    </MaskedView>

                    <Image source={image} style={styles.arcImage} resizeMode="contain" />
                  </View>
                );
              })}

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
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  remove: { marginRight: 10, fontSize: 16 },
  allergyName: { fontWeight: 'bold', color: '#6a762c', flex: 1 },
  severity: { fontWeight: 'bold', marginRight: 10, fontSize: 14 },
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