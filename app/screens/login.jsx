import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    if (!trimmedEmail || !trimmedSenha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      await login(trimmedEmail, trimmedSenha);
      setSenha('');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (e) {
      console.log('Erro login:', e.message);
      Alert.alert('Falha no login', formatErrorMessage(e.message));
    } finally {
      setLoading(false);
    }
  }

  function formatErrorMessage(msg) {
    if (!msg) return 'Erro desconhecido.';
    return msg;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.logoWrapper}>
              <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            </View>

            <Text style={styles.kicker}>Acessar conta</Text>
            <Text style={styles.heroTitle}>
              Entrar no <Text style={styles.heroAccent}>Work Group</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Bem-vindo de volta. Digite seus dados para continuar.
            </Text>

            <View style={styles.formWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seunome@exemplo.com"
                    placeholderTextColor="#8A8A8A"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputBoxRow}>
                  <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Sua senha"
                    placeholderTextColor="#8A8A8A"
                    style={[styles.input, { flex: 1 }]}
                    secureTextEntry={!mostrarSenha}
                    autoCapitalize="none"
                    textContentType="password"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setMostrarSenha(v => !v)}
                    style={styles.toggleBtn}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text style={styles.toggleBtnText}>
                      {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowBetween}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={loading}
                  // onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.linkText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ctaStack}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Register')}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Criar Conta</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerArea}>
              <View style={styles.footerLinksRow}>
                <Text style={styles.footerBrand}>© {new Date().getFullYear()} Work Group</Text>
                <Text style={styles.footerSep}>•</Text>
                <Text style={styles.footerLink}>Privacidade</Text>
                <Text style={styles.footerSep}>•</Text>
                <Text style={styles.footerLink}>Termos</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  kicker: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    alignSelf: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.3,
    paddingHorizontal: 28,
    textAlign: 'center',
  },
  heroAccent: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    textDecorationColor: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#D6D6D6',
    paddingHorizontal: 32,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
  },
  formWrapper: { paddingHorizontal: 24 },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    color: '#E6E6E6',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputBox: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 10,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 6,
    backgroundColor: '#161616',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262626',
  },
  toggleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  ctaStack: {
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#2A2A2A',
    borderColor: '#2A2A2A',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  secondaryButton: {
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  footerArea: {
    marginTop: 36,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  footerBrand: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
  },
  footerLink: {
    color: '#B5B5B5',
    fontSize: 12,
    fontWeight: '700',
  },
  footerSep: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '700',
  },
});