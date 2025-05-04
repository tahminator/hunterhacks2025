import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { z } from "zod";
import { severitySchema } from "@/apis/schema/allergies";
import { toDisplaySeverity } from "@/lib/severity";

type Props = {
  name: string;
  allergies: {
    itemName: string;
    severity: z.infer<typeof severitySchema>;
    color?: string;
  }[];
  onEdit: () => void;
  onDelete: () => void;
};

const severityGradients: Record<string, [string, string]> = {
  high: ["#E66D57", "#4B0505"],
  med: ["#f5a623", "#d97706"],
  low: ["#a8e063", "#56ab2f"],
};

export default function ProfileCard({ name, allergies, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Text style={styles.name}>{name}</Text>
        {allergies?.map((a, i) => {
          const gradient = severityGradients[a.severity] || ["#888", "#666"];
          return (
            <View key={i} style={styles.allergyRow}>
              <Text style={[styles.allergyText, { color: a.color }]}>
                • {a.itemName}{" "}
              </Text>
              <MaskedView
                maskElement={
                  <Text style={styles.level}>
                    ({toDisplaySeverity(a.severity)})
                  </Text>
                }
              >
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.level, { opacity: 0 }]}>
                    ({toDisplaySeverity(a.severity)})
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>
          );
        })}
      </View>

      <ImageBackground
        source={require("../../assets/images/Vector.png")}
        style={styles.editSection}
        resizeMode="cover"
        imageStyle={styles.swooshImage}
      >
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  swooshImage: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  editButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  allergyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  allergyText: {
    fontWeight: "bold",
  },
  level: {
    fontWeight: "normal",
    fontSize: 14,
    marginLeft: 4,
  },
});
