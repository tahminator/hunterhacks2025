import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  TouchableOpacity,
  Switch,
  PanResponder,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import MaskedView from "@react-native-masked-view/masked-view";
import PhotoModal from "../../../components/PhotoModal";
import { useGenerateReportMutation } from "@/apis/queries/report";
import { useProfilesQuery } from "@/apis/queries/profiles";
import { z } from "zod";
import { severitySchema } from "@/apis/schema/allergies";
import { useAuthQuery } from "@/apis/queries/auth";
import { toDisplaySeverity } from "@/lib/severity";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.43;
const CARD_SPACING = 10;

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

const TextWithImageBackground = ({ text, imageUrl, textStyle }) => {
  return (
    <MaskedView
      style={{ height: 40, marginBottom: 10 }}
      maskElement={
        <Text style={[textStyle, { backgroundColor: "transparent" }]}>
          {text}
        </Text>
      }
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      />
    </MaskedView>
  );
};

// Individual profile card component
const ProfileCard = ({ name, allergies, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.profileCard, isSelected && styles.selectedProfileCard]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <Text style={styles.profileName}>{name}</Text>
      <View style={styles.profileDivider} />
      {allergies.map((allergy, index) => (
        <View
          key={index}
          style={styles.allergyTag}
          backgroundColor={getColorBySeverity(allergy.severity)}
        >
          <Text style={styles.allergyText}>{allergy.itemName}</Text>
          <Text style={styles.allergySeverity}>
            ({toDisplaySeverity(allergy.severity)})
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );
};

// Pagination dots component
const PaginationDots = ({ total, active }) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === active ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

// Profile selection item component
const ProfileSelectionItem = ({ name, isSelected, onToggle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.profileSelectionItem,
        isSelected && styles.selectedProfileItem,
      ]}
      onPress={onToggle}
    >
      <View
        style={[
          styles.selectionIndicator,
          isSelected && styles.selectedIndicator,
        ]}
      />
      <Text
        style={[
          styles.profileSelectionName,
          isSelected && styles.selectedProfileText,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

type Severity = z.infer<typeof severitySchema>;

const severityColorMap: Record<Severity, string> = {
  high: "#EFA6A6",
  med: "#F8CBA0",
  low: "#D3D99C",
};

function getColorBySeverity(severity: Severity): string {
  return severityColorMap[severity];
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [isProfileToggleOn, setIsProfileToggleOn] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [currentScreen, setCurrentScreen] = useState("main");
  const [previousScreen, setPreviousScreen] = useState(null);
  const isModalOpen = modalVisible && uri;
  const scrollViewRef = useRef(null);
  const [base64, setBase64] = useState<string>();
  const [restaurantText, setRestaurantText] = useState<string>();
  const { mutate, status: mutateStatus } = useGenerateReportMutation();
  const [data, setData] = useState<Data>();
  const [profiles, setProfiles] = useState<
    {
      name: string;
      firstName: string;
      lastName: string;
      allergies: {
        itemName: string;
        severity: z.infer<typeof severitySchema>;
        color?: string;
      }[];
    }[]
  >();
  const { status: profileStatus, data: profileData } = useProfilesQuery();
  const { status: authStatus, data: authData } = useAuthQuery();

  useEffect(() => {
    if (!isProfileToggleOn) {
      if (profileStatus === "success") {
        setProfiles(profileData.data);
      }
    } else {
      if (authStatus === "success") {
        if (authData.data && authData.data.user?.activeProfile) {
          setProfiles([
            {
              ...authData.data.user?.activeProfile,
              name:
                authData.data.user.activeProfile.firstName +
                " " +
                authData.data.user.activeProfile.lastName,
            },
          ]);
        }
      }
    }
  }, [
    authData?.data,
    authStatus,
    isProfileToggleOn,
    profileData?.data,
    profileStatus,
  ]);

  useEffect(() => {
    if (profileStatus === "success") {
      setProfiles(profileData.data);
    }
  }, [profileData?.data, profileStatus]);

  const onSubmit = async () => {
    if (!uri) {
      return;
    }

    const fileRes = await fetch(uri);
    const blob = await fileRes.blob();

    const fileName = uri.split("/").pop() || "photo.jpg";
    const mimeType = blob.type || "image/jpeg"; // fallback if .type is missing

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: fileName,
      type: mimeType,
    } as any);
    formData.append("restaurantName", restaurantText as string);
    formData.append("isJustMe", Boolean(!isProfileToggleOn).toString());

    mutate(formData, {
      onSuccess: (data) => {
        setData(data);
        setCurrentScreen("results");
      },
    });
  };
  const cameraTransition = useRef(new Animated.Value(uri ? 1 : 0)).current;

  const navigateToScreen = (screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleBackButton = () => {
    if (!isModalOpen) return;

    if (currentScreen === "results") {
      navigateToScreen("profileSelection");
    } else if (currentScreen === "profileSelection") {
      navigateToScreen("main");
    } else if (uri) {
      closePhotoView();
    }
  };

  const closePhotoView = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(cameraTransition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setUri(null);
      setModalVisible(false);
      setCurrentScreen(previousScreen || "main");
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return evt.nativeEvent.locationY < 50;
      },
      onPanResponderMove: (evt, gs) => {
        if (gs.dy > 0) {
          slideAnimation.setValue(Math.max(0, 1 - gs.dy / 300));
        }
      },
      onPanResponderRelease: (evt, gs) => {
        if (gs.dy > 100) closePhotoView();
        else
          Animated.spring(slideAnimation, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
      },
    }),
  ).current;

  useEffect(() => {
    if (uri) {
      // Reset to main screen when taking a new picture
      setCurrentScreen("main");

      setModalVisible(true);
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      cameraTransition.setValue(1);
    }
  }, [uri]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_SPACING));
    setActiveCardIndex(index);
  };

  const scrollToCard = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (CARD_WIDTH + CARD_SPACING),
        animated: true,
      });
    }
  };

  const toggleProfileSelection = (index) => {
    const updatedProfiles = [...profiles];
    updatedProfiles[index].selected = !updatedProfiles[index].selected;
    setProfiles(updatedProfiles);
  };

  const handleCheckAllergens = () => {
    // For now, nothing happens when Check Allergens is clicked
    console.log(
      "Check Allergens clicked - no action for now, should go to the report screen",
    );
  };

  const handleAddProfile = () => {
    // Only show profile selection when the + button is clicked
    navigateToScreen("profileSelection");
  };

  const handleDone = () => {
    // Go back to main screen when Done is clicked from profile selection
    console.log(
      "Check Allergens clicked - no action for now, should go to the report screen",
    );
  };

  const handleSaveResults = () => {
    closePhotoView();
  };

  function base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setBase64(photo?.base64);
    setUri(photo?.uri as string);
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const renderMainScreen = () => (
    <ScrollView
      style={styles.scrollableContent}
      showsVerticalScrollIndicator={false}
    >
      {/* What's the Name Section */}
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <TextWithImageBackground
            text="What's the Name"
            imageUrl="https://media.discordapp.net/attachments/1365530505860087808/1368248570783862896/landing-bg.jpg?ex=68178848&is=681636c8&hm=2f2730a0a9d2bb25a237aef612f85e9889485a76895699ae55a0bd58cfe0872e&=&width=1448&height=1050"
            textStyle={styles.sectionTitle}
          />
        </View>
        <Text style={styles.sectionSubtitle}>
          First, let us know the name of the restaurant you're eating at.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Restaurant Name (eg. McDonalds)"
          placeholderTextColor="#999"
          onChangeText={(text) => {
            setRestaurantText(text);
          }}
        />
        <View style={styles.divider} />
      </View>

      {/* Profiles Section */}
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <TextWithImageBackground
            text="Profiles"
            imageUrl="https://media.discordapp.net/attachments/1365530505860087808/1368248570783862896/landing-bg.jpg?ex=68178848&is=681636c8&hm=2f2730a0a9d2bb25a237aef612f85e9889485a76895699ae55a0bd58cfe0872e&=&width=1448&height=1050"
            textStyle={styles.sectionTitle}
          />
        </View>
        <View style={styles.profilesRow}>
          <Text style={styles.profilesTitle}>Checking just for you?</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#93a829" }}
            value={isProfileToggleOn}
            onValueChange={setIsProfileToggleOn}
          />
        </View>

        {isProfileToggleOn ? (
          <>
            <Text style={styles.profilesSubtitle}>
              Just making sure, we know you can't eat...
            </Text>
            {profiles?.at(0)?.allergies.map((allergy, index) => (
              <View style={styles.allergenBox} key={index}>
                <Text style={styles.allergenName}>{allergy.itemName}</Text>
                <View style={styles.severityIndicator}>
                  <Text style={styles.severityText}>
                    {toDisplaySeverity(allergy.severity)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.profilesSubtitle}>
              Let's make sure other people can eat too.
            </Text>
            {/* Improved Profile cards carousel */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              onMomentumScrollEnd={handleScroll}
              pagingEnabled={false}
              snapToAlignment="center"
            >
              {profiles?.map((profile, index) => (
                <ProfileCard
                  key={index}
                  name={profile.name}
                  allergies={profile.allergies}
                  onSelect={() => toggleProfileSelection(index)}
                />
              ))}
            </ScrollView>

            {/* Pagination dots - now clickable */}
            <View style={styles.paginationContainer}>
              {profiles?.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => scrollToCard(index)}
                  style={styles.paginationTouchable}
                >
                  <View
                    style={[
                      styles.paginationDot,
                      index === activeCardIndex
                        ? styles.activeDot
                        : styles.inactiveDot,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.checkAllergensButton,
              !isProfileToggleOn && { marginRight: 8 },
              mutateStatus === "pending" && { opacity: 0.5 }, // manually dim
            ]}
            onPress={onSubmit}
            activeOpacity={1} // keep this 1 so the manual style takes effect
            disabled={mutateStatus === "pending"}
          >
            <Text style={styles.checkAllergensText}>
              {mutateStatus === "pending" && (
                <ActivityIndicator
                  size="small"
                  color="#00000"
                  style={{ marginLeft: 8 }}
                />
              )}{" "}
              Check Allergens
            </Text>
          </TouchableOpacity>

          {!isProfileToggleOn && (
            <TouchableOpacity
              style={styles.addProfileButton}
              onPress={handleAddProfile}
            >
              <Text style={styles.addProfileButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Add extra padding at the bottom */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  const renderProfileSelectionScreen = () => {
    return (
      <View style={styles.profileSelectionContainer}>
        <Text style={styles.profileSelectionHeader}>Add Allergen Profiles</Text>
        <ScrollView
          style={styles.profilesScrollView}
          showsVerticalScrollIndicator={false}
        >
          {profiles?.map((profile, index) => (
            <ProfileSelectionItem
              key={index}
              name={profile.name}
              isSelected={profile.selected}
              onToggle={() => toggleProfileSelection(index)}
            />
          ))}
        </ScrollView>

        {/* Done button positioned at the bottom */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Camera view (always present, but opacity changes) */}
      <Animated.View
        style={[
          styles.fullScreenContainer,
          {
            opacity: cameraTransition.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0], // Hide camera when showing photo
            }),
            zIndex: isModalOpen ? 0 : 2,
            elevation: isModalOpen ? 0 : 2,
          },
        ]}
        pointerEvents={isModalOpen ? "none" : "auto"}
      >
        {/* Instruction text ABOVE the container */}
        <View style={styles.instructionTextContainer}>
          <Text style={styles.instructionText}>
            Take a picture of the menu / food item
          </Text>
        </View>

        <CameraView style={styles.camera} ref={ref}>
          {/* Darkened overlay */}
          <View style={styles.darkOverlay} />
          {/* Clear center rectangle */}
          <View style={styles.centerRectangle} />
          {/* Bottom dark overlay */}
          <View style={styles.bottomDarkOverlay} />
        </CameraView>

        <View style={styles.shutterContainer}>
          <Pressable style={styles.shutterBtn} onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtnInner,
                  { backgroundColor: pressed ? "#ccc" : "white" },
                ]}
              />
            )}
          </Pressable>
        </View>
      </Animated.View>

      {/* Photo view with modal (conditionally rendered) */}
      {modalVisible && (
        <PhotoModal
          uri={uri}
          currentScreen={currentScreen}
          panResponder={panResponder}
          slideAnimation={slideAnimation}
          handleBackButton={handleBackButton}
          renderMainScreen={renderMainScreen}
          renderProfileSelectionScreen={renderProfileSelectionScreen}
          isModalOpen={isModalOpen}
          cameraTransition={cameraTransition}
          profiles={profiles}
          data={data}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  instructionTextContainer: {
    position: "absolute",
    top: "6%",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  instructionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 38,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    paddingTop: 21,
  },
  centerRectangle: {
    position: "absolute",
    top: "15%",
    bottom: "20%",
    left: 30,
    right: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
  },
  bottomDarkOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "20%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 70,
    height: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  capturedImage: {
    width: "100%",
    height: "35%",
    position: "absolute",
    top: 0,
  },
  swipeIndicator: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    paddingVertical: 10,
  },
  swipeIndicatorBar: {
    width: 60,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    opacity: 0.7,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  wavyBorder: {
    height: 60,
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    top: -60,
    backgroundColor: "#EAEA00",
  },
  modalContent: {
    flex: 1,
  },
  scrollableContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
    position: "relative",
    paddingTop: 9,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 9,
    color: "#B07C25",
  },
  titleContainer: {
    marginBottom: 0,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 45,
    marginBottom: -10,
  },
  profilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profilesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profilesSubtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  allergenBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  allergenName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6E8C39",
  },
  severityIndicator: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 4,
    paddingHorizontal: 16,
  },
  severityText: {
    fontSize: 16,
    color: "#D57472",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  checkAllergensButton: {
    backgroundColor: "#EAEA00",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 60,
  },
  checkAllergensText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addProfileButton: {
    backgroundColor: "#EAEAEA",
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    marginBottom: 60,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addProfileButtonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 50,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Carousel styles
  carouselContainer: {
    paddingLeft: 10,
    paddingRight: 30,
  },
  profileCard: {
    width: CARD_WIDTH,
    height: 200,
    marginRight: CARD_SPACING,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedProfileCard: {
    borderColor: "#A4BE4C",
    backgroundColor: "#F7F9F0",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  profileDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },
  allergyTag: {
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  allergyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  allergySeverity: {
    fontSize: 14,
    color: "#555",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  paginationTouchable: {
    padding: 8,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "black",
  },
  inactiveDot: {
    backgroundColor: "#CCCCCC",
  },
  // Profile selection screen styles
  profileSelectionContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // This ensures space between content and button
  },
  profileSelectionHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    marginTop: 10,
  },
  profilesScrollView: {
    flex: 1,
    marginBottom: 20, // Add space before the button
  },
  profileSelectionItem: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  selectedProfileItem: {
    backgroundColor: "#1C2600", // Dark green/black background for selected items
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#CCCCCC", // Gray indicator for unselected
    marginRight: 15,
  },
  selectedIndicator: {
    backgroundColor: "#EAEA00", // Bright yellow indicator for selected
  },
  profileSelectionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark text for unselected
  },
  selectedProfileText: {
    color: "#FFFFFF", // White text for selected items
  },
  doneButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#000", // Black button
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Make sure it's not absolute positioned
    bottom: 75,
    borderRadius: 30, // No rounded corners for the Done button
  },
  doneButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
});
