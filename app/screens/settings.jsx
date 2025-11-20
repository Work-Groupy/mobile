import { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout, deleteAccount } = useAuth();
  const [loadingDelete, setLoadingDelete] = useState(false);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.navigate('WelcomeScreen');
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível realizar logout.');
          }
        },
      },
    ]);
  }

  function confirmDelete() {
    Alert.alert(
      'Deletar conta',
      'Tem certeza? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: handleDeleteAccount,
        },
      ]
    );
  }

  async function handleDeleteAccount() {
    setLoadingDelete(true);
    try {
      await deleteAccount();
      Alert.alert('Conta deletada', 'Sua conta foi removida com sucesso.');
    } catch (e) {
      Alert.alert('Erro', e.message || 'Falha ao deletar conta.');
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Preferências e ações da sua conta.</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Usuário</Text>
            {user ? (
              <View style={{ gap: 2 }}>
                <Text style={styles.value}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
            ) : (
              <Text style={styles.value}>Não autenticado</Text>
            )}
          </View>

          <View style={styles.buttons}>
            <ActionButton text="Logout" onPress={handleLogout} variant="secondary" disabled={!user} />
            <ActionButton
              text={loadingDelete ? 'Deletando...' : 'Deletar Conta'}
              onPress={confirmDelete}
              variant="danger"
              disabled={!user || loadingDelete}
              loading={loadingDelete}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function ActionButton({ text, onPress, variant = 'secondary', disabled, loading }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{text}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32, gap: 28 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#CFCFCF', fontSize: 14 },
  section: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, gap: 6 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
  email: { color: '#CFCFCF', fontSize: 13 },
  buttons: { gap: 12 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: { backgroundColor: '#333' },
  danger: { backgroundColor: '#9A1A1A' },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
