import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

type Props = {
  name: string;
  severity: string;
  onRemove?: () => void;
};

export default function AllergyDashboard({ name, severity, onRemove }: Props) {
  return (
    <View style={styles.allergyItem}>
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.allergyRemove}>x</Text>
      </TouchableOpacity>
      <Text style={styles.allergyName}>{name}</Text>
      <Text style={styles.allergySeverity}>{severity}</Text>
      <Image source={require('../../assets/images/Circle.png')} style={styles.severityCircle} />
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
    outlineWidth: 1,
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
    color: '#B22222', 
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