import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGuestLoginMutation } from "@/apis/queries/auth";

const { height } = Dimensions.get("window");

const LoginModal = ({ visible, onClose, initialMode = "login" }) => {
  const [slideAnim] = useState(new Animated.Value(height));
  const [isLogin, setIsLogin] = useState(initialMode === "login");

  useEffect(() => {
    if (visible) {
      // Set the form mode based on initialMode prop each time the modal opens
      setIsLogin(initialMode === "login");

      // Animate the modal sliding up from the bottom
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate the modal sliding down
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, initialMode]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const onClick = async () => {
    const res = await fetch("");
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#333"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#333"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.authButton}>
        <Text style={styles.authButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(false)}>
        <Text style={styles.switchModeText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#333"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#333"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#333"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#333"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.authButton}>
          <Text style={styles.authButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(true)}>
          <Text style={styles.switchModeText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
              style={styles.keyboardAvoidingView}
            >
              <Animated.View
                style={[
                  styles.modalContainer,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <View style={styles.headerContainer}>
                  <Image
                    source={{
                      uri: "https://media.discordapp.net/attachments/1365530505860087808/1368286169582014554/Group_40.png?ex=6817ab4c&is=681659cc&hm=57185bdd0ed140137b9d57869d4453fd7616d430ea3d162a1c4062040b54e0cc&=&width=920&height=538",
                    }}
                    style={styles.headerImage}
                    resizeMode="cover"
                  />
                  <View style={styles.headerOverlay}>
                    <Text style={styles.title}>
                      {isLogin ? "Login" : "Register"}
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.whiteFormContainer}>
                  {isLogin ? renderLoginForm() : renderRegisterForm()}
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalContainer: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    maxHeight: "100%", // Limit the modal height to prevent it from going off-screen
  },
  headerContainer: {
    position: "relative",
    height: 210,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  whiteFormContainer: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 120,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    marginBottom: 45,
    marginTop: -45,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    marginBottom: 20,
    paddingBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#414a15",
    fontSize: 14,
  },
  authButton: {
    backgroundColor: "#7C7F1B",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  switchModeText: {
    textAlign: "center",
    color: "#414a15",
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoginModal;
