import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

interface AllergyData {
  name: string;
  severity: string;
  color: string;
}

interface AddAllergyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AllergyData) => void;
}

export default function AddAllergyModal({ visible, onClose, onSubmit }: AddAllergyModalProps) {
  const [slideAnim] = useState(new Animated.Value(height));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  const [allergy, setAllergy] = useState('');
  const [severity, setSeverity] = useState<string | null>(null);

  const severityColors: { [key: string]: string } = {
    slight: 'green',
    medium: 'orange',
    severe: 'darkred',
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: height, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim, scaleAnim]);

  const handleDone = () => {
    if (!allergy || !severity) return;
    onSubmit({
      name: allergy,
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      color: severityColors[severity],
    });
    setAllergy('');
    setSeverity(null);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}> 
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={60}
              style={styles.avoidingView}
            >
              <Animated.View
                style={[
                  styles.modalContainer,
                  { transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
                ]}
              >
                <LinearGradient
                  colors={['#6a9e1f', '#cde672']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.headerExpanded}
                >
                  <Image
                    source={require('../../assets/images/Vector.png')}
                    style={styles.arcImage}
                    resizeMode="contain"
                  />
                  <View style={styles.headerContentExpanded}>
                    <Text style={styles.title}>Add Allergy</Text>
                    <TouchableOpacity onPress={onClose}>
                      <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formOverlay}>
                    <Text style={styles.label}>Allergic to</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Strawberries"
                      value={allergy}
                      onChangeText={setAllergy}
                      placeholderTextColor="#666"
                    />
                  </View>
                </LinearGradient>

                <View style={styles.formBelow}>
                  <View style={styles.severityRow}>
                    {['slight', 'medium', 'severe'].map(level => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.severityButton,
                          severity === level && {
                            borderColor: severityColors[level],
                            backgroundColor: `${severityColors[level]}22`,
                          },
                        ]}
                        onPress={() => setSeverity(level)}
                      >
                        <Text style={{ color: severityColors[level], fontWeight: 'bold' }}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  avoidingView: {
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  headerExpanded: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContentExpanded: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    marginBottom: 20,
  },
  arcImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: '50%',
    zIndex: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    paddingTop: 10,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  formOverlay: {
    zIndex: 2,
  },
  formBelow: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  severityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});