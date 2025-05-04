import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import LoginModal from "../../components/LoginModal";
import TypingEffect from "../../components/TypingEffect";
import { apiFetch } from "@/lib/apiFetch";
import { useAuthQuery, useGuestLoginMutation } from "@/apis/queries/auth";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  // state for controlling the login modal visibility and mode
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const router = useRouter();

  const { status, data } = useAuthQuery();

  const { mutate: guestLoginMutate } = useGuestLoginMutation();

  const onGuestPress = () => {
    guestLoginMutate();
  };

  // image URL (pasta) for text background
  const imageUrl =
    "https://media.discordapp.net/attachments/1365530505860087808/1368248570783862896/landing-bg.jpg?ex=68178848&is=681636c8&hm=2f2730a0a9d2bb25a237aef612f85e9889485a76895699ae55a0bd58cfe0872e&=&width=1448&height=1050";

  // logo (Aller free) image URL
  const logoUrl =
    "https://media.discordapp.net/attachments/1365530505860087808/1368248587959537866/Logo.png?ex=6817884c&is=681636cc&hm=fd23ddbda5ddf30b345db0391a369eb58cd9e436a25ad6af19c1a81f1ff06141&=&width=544&height=520";

  // phrases for the typing effect
  const allergicPhrases = [
    "I'm allergic to",
    "My brother is allergic to",
    "My mother is allergic to",
    "My father is allergic to",
    "My friend is allergic to",
    "My coworker is allergic to",
  ];

  useEffect(() => {
    if (status === "success") {
      if (data.data.user && data.data.session) {
        router.push("/profile/ProfileScreen");
      }
    }
  }, [status, data, router]);

  // function to create text with image background
  const renderTextWithImageBackground = (text, textStyle) => {
    // Determine if this is the title text ("I'm allergic to")
    const isTitle = textStyle === styles.allergicText;

    // adjusting container width based on text length and font size
    const containerWidth =
      textStyle.fontSize * text.length * (isTitle ? 0.4 : 0.65);

    return (
      <View style={{ alignSelf: "flex-end" }}>
        <MaskedView maskElement={<Text style={textStyle}>{text}</Text>}>
          <View
            style={{
              height: textStyle.fontSize * 1.2,
              width: containerWidth,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <ImageBackground
              source={{ uri: imageUrl }}
              style={{
                width: textStyle.fontSize * text.length * 4, // wider than needed
                height: textStyle.fontSize * 4, // taller than needed for zoom effect
                right: -270, // x-axis
                top: 40, // y-axis
              }}
            >
              <Text style={[textStyle, { opacity: 0 }]}>{text}</Text>
            </ImageBackground>
          </View>
        </MaskedView>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[
        "rgba(24, 41, 2, 1)",
        "rgba(24, 41, 2, 1)",
        "rgba(24, 41, 2, 1)",
        "rgba(24, 41, 2, 1)",
        "rgba(158, 179, 64, 1)",
        "rgba(246, 216, 92, 1)",
        "rgba(246, 216, 92, 1)",
      ]}
      locations={[0.0, 0.1, 0.2, 0.3, 0.6, 0.8, 1.0]}
      start={{ x: 0, y: 0.4 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* using to add a tad space above allergic text*/}
        <View style={styles.header}></View>

        {/* allergen text content */}
        <View style={styles.allergenContent}>
          {/* replacing static text with typing effect component */}
          <TypingEffect
            phrasesToType={allergicPhrases}
            textStyle={styles.allergicText}
            imageUrl={imageUrl}
            typingSpeed={60}
            pauseTime={1000}
            backspaceSpeed={30}
          />

          {/* allergens with image backgrounds */}
          {renderTextWithImageBackground("Gluten", styles.allergenItem)}
          {renderTextWithImageBackground("Peanuts", styles.allergenItem)}
          {renderTextWithImageBackground("Pistachios", styles.allergenItem)}

          {/* logo image replacing the "Aller free" circle */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: logoUrl }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {renderTextWithImageBackground("Corn", styles.allergenItem)}
          {renderTextWithImageBackground("Soy", styles.allergenItem)}
          {renderTextWithImageBackground("Shellfish", styles.allergenItem)}

          {/* applying both image background and faded effect to "Avocados" */}
          <View style={{ opacity: 0.6 }}>
            {renderTextWithImageBackground("Avocados", styles.allergenItem)}
          </View>
        </View>

        {/* buttons at the bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              setModalMode("login");
              setLoginModalVisible(true);
            }} // opening login modal in login mode
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => {
              setModalMode("register");
              setLoginModalVisible(true);
            }} // opening login modal in register mode
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGuestPress}>
            <Text style={[styles.guestText, { textDecorationLine: "none" }]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* login Modal Component */}
      <LoginModal
        visible={loginModalVisible}
        initialMode={modalMode}
        onClose={() => setLoginModalVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 20,
    paddingRight: 10,
  },
  allergenContent: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    position: "relative",
  },
  allergicText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#e5a268",
    textAlign: "right",
  },
  allergenItem: {
    fontSize: 67,
    fontWeight: "bold",
    textAlign: "right",
    lineHeight: 76,
    marginVertical: 0, // added to ensure proper spacing between items
    paddingRight: 15,
  },
  logoContainer: {
    position: "absolute",
    alignSelf: "center",
    left: 18,
    top: "33.6%",
    zIndex: 10,
    width: 300,
    height: 243,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: "#414a15",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  signupButton: {
    backgroundColor: "#828e3f",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  guestText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontStyle: "italic",
  },
});
