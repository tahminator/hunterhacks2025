import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const FoodResultItem = ({ food, status, explanation }) => {
  // Define colors and dots based on status
  const getStatusInfo = (status) => {
    switch (status) {
      case "high":
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: "#93A829" }]} />
              <View style={[styles.dot, { backgroundColor: "#93A829" }]} />
              <View style={[styles.dot, { backgroundColor: "#93A829" }]} />
            </View>
          ),
        };
      case "med":
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: "#F8CBA0" }]} />
              <View style={[styles.dot, { backgroundColor: "#F8CBA0" }]} />
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
            </View>
          ),
        };
      case "low":
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: "#EFA6A6" }]} />
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
            </View>
          ),
        };
      default:
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
              <View style={[styles.dot, { backgroundColor: "#D9D9D9" }]} />
            </View>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <View style={styles.resultItem}>
      <View style={styles.resultContentLeft}>
        <Text style={styles.foodTitle}>{food}</Text>
        <Text style={styles.explanationText}>{explanation}</Text>
      </View>
      <View style={styles.resultContentRight}>
        <Text style={styles.statusText}>{status}</Text>
        {statusInfo.dots}
      </View>
    </View>
  );
};

type Data = {
  message: string;
  data: {
    name: string;
    foods: {
      title: string;
      description: string;
      severity: "low" | "med" | "high";
    }[];
  }[];
};

const AllergenResultsScreen = ({ data }: { data: Data }) => {
  console.log(data);
  const [selected, setSelected] = useState(data.data[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const selectProfile = (person: {
    name: string;
    foods: {
      title: string;
      description: string;
      severity: "low" | "med" | "high";
    }[];
  }) => {
    setSelected(person);
  };

  return (
    <View style={styles.container}>
      {/* Header with background image */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://media.discordapp.net/attachments/1365530505860087808/1368286169582014554/Group_40.png?ex=6817ab4c&is=681659cc&hm=57185bdd0ed140137b9d57869d4453fd7616d430ea3d162a1c4062040b54e0cc&=&width=920&height=538",
          }}
          style={styles.headerBackgroundImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerText}>So...</Text>
          <Text style={styles.headerTitle}>Can I Eat it?</Text>
        </View>
        {/* <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity> */}
      </View>

      {/* Results content */}
      <View style={styles.contentContainer}>
        <Text style={styles.foundText}>Here's What We Found</Text>

        {/* Profile selector dropdown - Only shown if not in personal profile mode AND there are multiple profiles */}
        {data.data.length > 1 && (
          <View style={styles.profileSelector}>
            <Text style={styles.profileSelectorLabel}>
              Showing Results for:{" "}
            </Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={toggleDropdown}
            >
              <Text style={styles.dropdownButtonText}>{selected.name}</Text>
              <Text style={styles.dropdownArrow}>
                {showDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {/* Dropdown menu */}
            {showDropdown && (
              <View style={styles.dropdown}>
                {data.data.map((profile, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      selectProfile(profile);
                      toggleDropdown();
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selected.name === profile.name &&
                          styles.activeDropdownItem,
                      ]}
                    >
                      {profile.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Results list */}
        <ScrollView style={styles.resultsContainer}>
          {selected.foods.map(({ title, severity, description }, index) => (
            <FoodResultItem
              key={index}
              food={title}
              status={severity}
              explanation={description}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 60,
  },
  header: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  headerBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    marginTop: 0,
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    left: 0,
    bottom: 90,
    paddingLeft: 20,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#000000",
    fontSize: 27,
    fontWeight: "bold",
    lineHeight: 48,
    paddingBottom: 15,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "#E6E6E6",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: -78,
    paddingTop: 0,
  },
  foundText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  profileSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profileSelectorLabel: {
    fontSize: 20,
    marginRight: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    width: 150,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  activeDropdownItem: {
    fontWeight: "bold",
    color: "#93A829",
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 15,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  resultContentLeft: {
    flex: 1,
    padding: 20,
  },
  resultContentRight: {
    width: 120,
    backgroundColor: "#1C2600",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: "#666666",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  saveButton: {
    backgroundColor: "#93A829",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    marginBottom: 130,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default AllergenResultsScreen;
