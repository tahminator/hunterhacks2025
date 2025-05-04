import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

import Header from "../../../components/profiles/Header";
import AllergyDashboard from "../../../components/profiles/AllergyDashboard";
import ProfileCard from "../../../components/profiles/ProfileCard";
import AddAllergyModal from "../../../components/profiles/AllergyModal";
import ProfileAdd from "../../../components/profiles/ProfileAdd";
import { useLogoutMutation, useAuthQuery } from "@/apis/queries/auth";
import { useRouter } from "expo-router";
import { z } from "zod";
import { severitySchema } from "@/apis/schema/allergies";
import { useProfilesQuery } from "@/apis/queries/profiles";
import { useAddAllergyMutation } from "@/apis/queries/allergy";

type InternalSeverity = "high" | "med" | "low";
type LabelSeverity = "Severe" | "Medium" | "Slight";

const severityToLabel = (severity: InternalSeverity): LabelSeverity => {
  switch (severity) {
    case "high":
      return "Severe";
    case "med":
      return "Medium";
    case "low":
      return "Slight";
  }
};

export default function ProfileScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { data: envelope, status } = useAuthQuery();

  const [scrollY, setScrollY] = useState(0);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [showOtherProfileModal, setShowOtherProfileModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const router = useRouter();
  const { status: profileStatus, data } = useProfilesQuery();
  const { mutate: addAllergyMutate } = useAddAllergyMutation();

  const [mainAllergies, setMainAllergies] = useState<
    {
      itemName: string;
      severity: z.infer<typeof severitySchema>;
      color?: string;
    }[]
  >([]);

  const [profiles, setProfiles] = useState<
    {
      name: string;
      allergies: {
        itemName: string;
        severity: z.infer<typeof severitySchema>;
        color?: string;
      }[];
    }[]
  >([]);

  const { mutate } = useLogoutMutation();

  useEffect(() => {
    if (profileStatus === "success") {
      if (data) {
        setProfiles(data.data);
      }
    }
  }, [data, profileStatus]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const velocityY = event.nativeEvent.velocity?.y ?? 0;

    if (offsetY < scrollY && velocityY < 0) {
      scrollRef.current?.scrollTo({ y: scrollY, animated: false });
    } else {
      setScrollY(offsetY);
    }
  };
  const handleRemoveProfile = (index: number) => {
    setProfiles((prev) => prev.filter((_, i) => i !== index));
  };
  if (status !== "success" || !envelope) {
    return <Text>Loading…</Text>;
  }
  const name =
    envelope?.data?.user?.activeProfile?.firstName ||
    "Guest" ||
    envelope?.data?.user?.username;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Header
          username={name}
          onLogout={() => {
            mutate(void 0, {
              onSuccess: () => {
                router.push("/");
              },
            });
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Allergies</Text>
          {envelope.data.user?.activeProfile.allergies.map((a, i) => (
            <AllergyDashboard
              key={i}
              name={a.itemName}
              severity={severityToLabel(a.severity)}
              onRemove={() =>
                setMainAllergies((prev) => prev.filter((_, idx) => idx !== i))
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

          {profiles.map((profile, index) => {
            if (index === 0) return null;
            return (
              <ProfileCard
                key={index}
                name={profile.name}
                allergies={profile.allergies.map((allergy) => ({
                  ...allergy,
                  color: allergy.color ?? "defaultColor",
                }))}
                onEdit={() => {
                  setEditingIndex(index);
                  setShowOtherProfileModal(true);
                }}
                onDelete={() => handleRemoveProfile(index)}
              />
            );
          })}

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
          if (status !== "success") {
            return;
          }

          addAllergyMutate({
            profileId: envelope.data.user?.activeProfileId ?? "",
            allergies: [
              {
                itemName: newAllergy.itemName,
                severity: (() => {
                  const severityString = newAllergy.severity as string;
                  if (severityString === "Slight") {
                    return "low";
                  }
                  if (severityString === "Medium") {
                    return "med";
                  }
                  if (severityString === "Severe") {
                    return "high";
                  }
                  return "low";
                })(),
              },
            ],
          });
          setShowAddAllergyModal(false);
        }}
      />

      <ProfileAdd
        visible={showOtherProfileModal}
        onClose={() => {
          setShowOtherProfileModal(false);
          setEditingIndex(null);
        }}
        initialAllergies={
          editingIndex !== null ? profiles[editingIndex].allergies : []
        }
        initialProfileName={
          editingIndex !== null ? profiles[editingIndex].name : ""
        }
        onSubmit={(updatedProfile) => {
          if (editingIndex !== null) {
            setProfiles((prev) =>
              prev.map((profile, index) =>
                index === editingIndex ? updatedProfile : profile,
              ),
            );
          } else {
            setProfiles((prev) => [...prev, updatedProfile]);
          }
          setShowOtherProfileModal(false);
          setEditingIndex(null);
        }}
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
    backgroundColor: "#f8f8f8",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#000000",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  addAllergyButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#94b000",
    borderRadius: 8,
  },
  addAllergyText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  otherProfilesHeader: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderRadius: 4,
  },
  otherProfilesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 6,
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
    textAlign: "center",
  },
  addProfileButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
});
