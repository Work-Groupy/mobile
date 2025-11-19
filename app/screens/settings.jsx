import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={{ flex: 1 }}>
        <View style={styles.center}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Preferências e ajustes do app.</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#CFCFCF' },
});