import React, { useState, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons } from "@expo/vector-icons";
import AddAllergyModal from "../profiles/AllergyModal";
import { useNewProfileMutation } from "@/apis/queries/profiles";
import { severitySchema } from "@/apis/schema/allergies";
import { z } from "zod";

type Allergy = {
  itemName: string;
  severity: z.infer<typeof severitySchema>;
  color?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profileData: {
    name: string;
    allergies: Allergy[];
  }) => void;
  initialProfileName: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialAllergies?: Allergy[];
  onDelete?: () => void;
};

export default function ProfileAdd({
  visible,
  onClose,
  onSubmit,
  initialProfileName = "",
  initialFirstName = "",
  initialLastName = "",
  initialAllergies = [],
  onDelete,
}: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mutate } = useNewProfileMutation();

  const severityImages: Record<string, any> = {
    Severe: require("../../assets/images/Circle.png"),
    Medium: require("../../assets/images/Circle1.png"),
    Slight: require("../../assets/images/Circle2.png"),
  };

  const severityGradients: Record<string, readonly [string, string]> = {
    Severe: ["#E66D57", "#4B0505"],
    Medium: ["#f5a623", "#d97706"],
    Slight: ["#a8e063", "#56ab2f"],
  };

  useEffect(() => {
    if (visible) {
      if (initialProfileName && initialProfileName.includes(" ")) {
        const [first, ...rest] = initialProfileName.split(" ");
        setFirstName(first || initialFirstName);
        setLastName(rest.join(" ") || initialLastName);
      } else {
        setFirstName(initialFirstName);
        setLastName(initialLastName);
      }
      setAllergies(initialAllergies);
    }
  }, [visible, initialProfileName, initialFirstName, initialLastName, initialAllergies]);

  const removeAllergy = (index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (newAllergy: Allergy) => {
    setAllergies([...allergies, newAllergy]);
    setIsModalVisible(false);
  };

  const severityTranslater = (initial: string) => {
    switch (initial) {
      case "Severe":
        return "high";
      case "Medium":
        return "med";
      case "Slight":
        return "low";
      default:
        return "low";
    }
  };

  const handleDone = () => {
    if (!firstName.trim()) {
      alert("Please fill in at least the first name.");
      return;
    }


    const profileData = {
      name: `${firstName} ${lastName}`.trim(),
      allergies: allergies
    };

    onSubmit(profileData);

    try {
      mutate({
        firstName,
        lastName,
        allergies: allergies.map(({ severity, itemName }) => ({
          severity: severityTranslater(severity),
          itemName,
        })),
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalWrapper}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.header}>Profile</Text>

              <Text style={styles.label}>First Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.label}>Last Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />

              <Text style={styles.label}>Allergies:</Text>
              {allergies.map((a, i) => {
                const severityKey = a.severity.trim();
                const gradient = severityGradients[severityKey] || [
                  "#ccc",
                  "#999",
                ];
                const image =
                  severityImages[severityKey] ||
                  require("../../assets/images/Circle.png");

                return (
                  <View key={i} style={styles.allergyItem}>
                    <TouchableOpacity
                      onPress={() => removeAllergy(i)}
                      style={{ paddingRight: 8 }}
                    >
                      <Ionicons name="close" size={20} color="#444" />
                    </TouchableOpacity>

                    <Text style={styles.allergyName}>{a.itemName}</Text>

                    <MaskedView
                      maskElement={
                        <Text style={styles.severity}>{a.severity}</Text>
                      }
                    >
                      <LinearGradient
                        colors={gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={[styles.severity, { opacity: 0 }]}>
                          {a.severity}
                        </Text>
                      </LinearGradient>
                    </MaskedView>

                    <Image
                      source={image}
                      style={styles.arcImage}
                      resizeMode="contain"
                    />
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+ Allergy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>

              {onDelete && (
                <TouchableOpacity
                  style={[styles.doneButton, { backgroundColor: "darkred" }]}
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  content: { paddingBottom: 20 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a762c",
    marginBottom: 20,
  },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    backgroundColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  allergyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  allergyName: { fontWeight: "bold", color: "#6a762c", flex: 1 },
  severity: { fontWeight: "bold", marginRight: 10, fontSize: 14 },
  arcImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#a3b73b",
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  doneButton: {
    backgroundColor: "#000",
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});