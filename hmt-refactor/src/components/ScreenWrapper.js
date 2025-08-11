import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../styles';

export default function ScreenWrapper({ title, children }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.screenBody}>
        {children || <Text style={styles.placeholder}>Coming soon…</Text>}
      </View>
    </ScrollView>
  );
}
