import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

type Props = {
  name: string;
  severity: 'Severe' | 'Medium' | 'Slight';
  onRemove?: () => void;
};

const severityGradients: Record<string, [ColorValue, ColorValue]> = {
  Severe: ['#E66D57', '#4B0505'],
  Medium: ['#f5a623', '#d97706'],
  Slight: ['#a8e063', '#56ab2f'],
};

const severityImages: Record<string, any> = {
  Severe: require('../../assets/images/Circle.png'),
  Medium: require('../../assets/images/Circle1.png'),
  Slight: require('../../assets/images/Circle2.png'),
};

export default function AllergyDashboard({ name, severity, onRemove }: Props) {
  const gradientColors = severityGradients[severity] || ['#ccc', '#999'];
  const severityImage = severityImages[severity] || require('../../assets/images/Circle.png');

  return (
    <View style={styles.allergyItem}>
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.allergyRemove}>x</Text>
      </TouchableOpacity>

      <Text style={styles.allergyName}>{name}</Text>

      <MaskedView maskElement={<Text style={styles.allergySeverity}>{severity}</Text>}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.allergySeverity, { opacity: 0 }]}>{severity}</Text>
        </LinearGradient>
      </MaskedView>

      <Image
        source={severityImage}
        style={styles.severityCircle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  allergyRemove: {
    fontSize: 18,
    color: '#000',
    marginRight: 12,
  },
  allergyName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#4B5320',
    fontSize: 16,
  },
  allergySeverity: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12,
  },
  severityCircle: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});