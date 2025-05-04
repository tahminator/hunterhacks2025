import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const FoodResultItem = ({ food, status, explanation }) => {
  // Define colors and dots based on status
  const getStatusInfo = (status) => {
    switch(status) {
      case 'Likely':
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: '#93A829' }]} />
              <View style={[styles.dot, { backgroundColor: '#93A829' }]} />
              <View style={[styles.dot, { backgroundColor: '#93A829' }]} />
            </View>
          )
        };
      case 'Caution':
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: '#F8CBA0' }]} />
              <View style={[styles.dot, { backgroundColor: '#F8CBA0' }]} />
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
            </View>
          )
        };
      case 'No Way':
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: '#EFA6A6' }]} />
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
            </View>
          )
        };
      default:
        return {
          color: "#1C2600",
          dots: (
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
              <View style={[styles.dot, { backgroundColor: '#D9D9D9' }]} />
            </View>
          )
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

const AllergenResultsScreen = ({ selectedProfiles, onSaveResults, isPersonalProfile = false }) => {
  // Get all profiles that were actually selected
  const availableProfiles = isPersonalProfile 
    ? [{ name: "You", selected: true }] 
    : selectedProfiles.filter(p => p.selected);
  
  // Set default active profile based on availability
  const [activeProfile, setActiveProfile] = useState(
    isPersonalProfile ? "You" : (availableProfiles.length > 0 ? availableProfiles[0].name : "You")
  );
  
  // Set showDropdown to true initially if we have multiple selected profiles
  const [showDropdown, setShowDropdown] = useState(availableProfiles.length > 1);
  
  // Reset active profile when isPersonalProfile changes
  useEffect(() => {
    if (isPersonalProfile) {
      setActiveProfile("You");
    } else if (availableProfiles.length > 0 && activeProfile === "You") {
      setActiveProfile(availableProfiles[0].name);
    }
    
    // Set dropdown visibility based on number of available profiles
    setShowDropdown(availableProfiles.length > 1);
  }, [isPersonalProfile, selectedProfiles]);

  // Sample results data - in a real app, this would be generated based on the analysis
  // In a real implementation, you would have different results per profile
  const resultsData = {
    "You": [
      { food: "French Fries", status: "Likely", explanation: "No allergens detected that match your profile." },
      { food: "Fried Rice", status: "Caution", explanation: "May contain traces of egg, which is a mild allergen for you." },
      { food: "Bread", status: "No Way", explanation: "Contains gluten which is a severe allergen for you." }
    ],
    "Daniel": [
      { food: "French Fries", status: "Likely", explanation: "No allergens detected that match Daniel's profile." },
      { food: "Fried Rice", status: "No Way", explanation: "Contains gluten which is a severe allergen for Daniel." },
      { food: "Bread", status: "No Way", explanation: "Contains gluten which is a severe allergen for Daniel." }
    ],
    "Bianca": [
      { food: "French Fries", status: "Caution", explanation: "May contain traces of sesame, which is a mild allergen for Bianca." },
      { food: "Fried Rice", status: "No Way", explanation: "Contains gluten which is a severe allergen for Bianca." },
      { food: "Bread", status: "No Way", explanation: "Contains gluten which is a severe allergen for Bianca." }
    ],
    "Gwen": [
      { food: "French Fries", status: "Likely", explanation: "No allergens detected that match Gwen's profile." },
      { food: "Fried Rice", status: "Caution", explanation: "May be prepared near shellfish, which is a severe allergen for Gwen." },
      { food: "Bread", status: "Likely", explanation: "No allergens detected that match Gwen's profile." }
    ],
    "Jacob": [
      { food: "French Fries", status: "Likely", explanation: "No allergens detected that match Jacob's profile." },
      { food: "Fried Rice", status: "No Way", explanation: "Contains eggs which is a mild allergen for Jacob." },
      { food: "Bread", status: "Caution", explanation: "May contain traces of dairy processed in the same facility." }
    ]
  };
  
  // Get results for the active profile
  const results = resultsData[activeProfile] || resultsData["You"];

  const toggleDropdown = () => {
    // Only toggle dropdown if not in personal profile mode AND there are multiple profiles
    if (isPersonalProfile || availableProfiles.length <= 1) return;
    setShowDropdown(!showDropdown);
  };

  const selectProfile = (profileName) => {
    setActiveProfile(profileName);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with background image */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://media.discordapp.net/attachments/1365530505860087808/1368286169582014554/Group_40.png?ex=6817ab4c&is=681659cc&hm=57185bdd0ed140137b9d57869d4453fd7616d430ea3d162a1c4062040b54e0cc&=&width=920&height=538" }}
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
        {!isPersonalProfile && availableProfiles.length > 1 && (
          <View style={styles.profileSelector}>
            <Text style={styles.profileSelectorLabel}>Showing Results for: </Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
              <Text style={styles.dropdownButtonText}>{activeProfile}</Text>
              <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {/* Dropdown menu */}
            {showDropdown && (
              <View style={styles.dropdown}>
                {availableProfiles.map((profile, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => selectProfile(profile.name)}
                  >
                    <Text 
                      style={[
                        styles.dropdownItemText,
                        activeProfile === profile.name && styles.activeDropdownItem
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
          {results.map((item, index) => (
            <FoodResultItem
              key={index}
              food={item.food}
              status={item.status}
              explanation={item.explanation}
            />
          ))}
        </ScrollView>

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={onSaveResults}>
          <Text style={styles.saveButtonText}>Save Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: -60
  },
  header: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  headerBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 0,
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    bottom: 90,
    paddingLeft: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 27,
    fontWeight: 'bold',
    lineHeight: 48,
    paddingBottom: 15
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#E6E6E6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: -78,
    paddingTop: 0,
  },
  foundText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  profileSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileSelectorLabel: {
    fontSize: 20,
    marginRight: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
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
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  activeDropdownItem: {
    fontWeight: 'bold',
    color: '#93A829',
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  resultContentLeft: {
    flex: 1,
    padding: 20,
  },
  resultContentRight: {
    width: 120,
    backgroundColor: '#1C2600',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#666666',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  saveButton: {
    backgroundColor: '#93A829',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    marginBottom: 130

  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AllergenResultsScreen;