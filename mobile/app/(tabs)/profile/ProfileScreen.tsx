import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import Header from '../../../components/profiles/Header';
import AllergyDashboard from '../../../components/profiles/AllergyDashboard';
import ProfileCard from '../../../components/profiles/ProfileCard';
import AddAllergyModal from '../../../components/profiles/AllergyModal';
import AddOtherAllergenProfileModal from '../../../components/profiles/ProfileAdd';
import { useAuthQuery } from '../../../apis/queries/auth';

export default function ProfileScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { data: envelope, status } = useAuthQuery();
  const [scrollY, setScrollY] = useState(0);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [showOtherProfileModal, setShowOtherProfileModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [mainAllergies, setMainAllergies] = useState<
    { name: string; severity: string; color?: string }[]
  >([]);

  const [profiles, setProfiles] = useState<
    { name: string; allergies: { name: string; severity: string; color?: string }[] }[]
  >([]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const velocityY = event.nativeEvent.velocity?.y ?? 0;

    if (offsetY < scrollY && velocityY < 0) {
      scrollRef.current?.scrollTo({ y: scrollY, animated: false });
    } else {
      setScrollY(offsetY);
    }
  };

  const handleAddOrEditProfile = (profile: {
    username: string;
    profileName: string;
    allergies: { name: string; severity: string; color?: string }[];
  }) => {
    if (editingIndex !== null) {
      setProfiles(prev => {
        const updated = [...prev];
        updated[editingIndex] = { name: profile.profileName, allergies: profile.allergies };
        return updated;
      });
    } else {
      setProfiles(prev => [...prev, { name: profile.profileName, allergies: profile.allergies }]);
    }
    setShowOtherProfileModal(false);
    setEditingIndex(null);
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(prev => prev.filter((_, i) => i !== index));
  }

  // Loading state
  if (status !== "success" || !envelope) {
    return <Text>Loading…</Text>;
  }

  // Safely access user profile data with optional chaining and defaults
  const userName = envelope?.data?.user?.activeProfile?.firstName || 'User';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Header />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Allergies</Text>
          {mainAllergies.map((a, i) => (
            <AllergyDashboard
              key={i}
              name={userName}
              severity={['Severe', 'Medium', 'Slight'].includes(a.severity) ? a.severity as 'Severe' | 'Medium' | 'Slight' : 'Slight'}
              onRemove={() =>
                setMainAllergies(prev => prev.filter((_, idx) => idx !== i))
              }
            />
          ))}
          <TouchableOpacity
            style={styles.addAllergyButton}
            onPress={() => setShowAddAllergyModal(true)}
          >
            <Text style={styles.addAllergyText}>+ Allergy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.otherProfilesHeader}>
            <Text style={styles.otherProfilesTitle}>Other Profiles</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subText}>
            Add allergens for your friends, family, coworkers...
          </Text>

          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              name={profile.name}
              allergies={profile.allergies.map(allergy => ({
                ...allergy,
                color: allergy.color ?? 'defaultColor',
              }))}
              onEdit={() => {
                setEditingIndex(index);
                setShowOtherProfileModal(true);
              }}
              onDelete={() => handleRemoveProfile(index)}
            />
          ))}

          <TouchableOpacity
            style={styles.addProfileButton}
            onPress={() => {
              setEditingIndex(null);
              setShowOtherProfileModal(true);
            }}
          >
            <Text>Add Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddAllergyModal
        visible={showAddAllergyModal}
        onClose={() => setShowAddAllergyModal(false)}
        onSubmit={(newAllergy) => {
          setMainAllergies(prev => [...prev, newAllergy]);
          setShowAddAllergyModal(false);
        }}
      />

      <AddOtherAllergenProfileModal
        visible={showOtherProfileModal}
        onClose={() => {
          setShowOtherProfileModal(false);
          setEditingIndex(null);
        }}
        onSubmit={handleAddOrEditProfile}
        initialProfileName={editingIndex !== null ? profiles[editingIndex].name : ''}
        initialAllergies={editingIndex !== null ? profiles[editingIndex].allergies : []}
        onDelete={
          editingIndex !== null
            ? () => {
                handleRemoveProfile(editingIndex);
                setShowOtherProfileModal(false);
                setEditingIndex(null);
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: '#f8f8f8',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  addAllergyButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: '#94b000',
    borderRadius: 8,
  },
  addAllergyText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otherProfilesHeader: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  otherProfilesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 6,
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
    textAlign: 'center',
  },
  addProfileButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
});