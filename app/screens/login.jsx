import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);

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
            bounces={false}
            keyboardShouldPersistTaps="handled"
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
                  />
                  <TouchableOpacity
                    onPress={() => setMostrarSenha(v => !v)}
                    style={styles.toggleBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.toggleBtnText}>
                      {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowBetween}>
                <TouchableOpacity
                  onPress={() => setLembrar(v => !v)}
                  activeOpacity={0.8}
                  style={styles.rememberRow}
                >
                  <View style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
                    {lembrar && <View style={styles.checkboxDot} />}
                  </View>
                  <Text style={styles.rememberText}>Lembrar de mim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.linkText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>

              {/* Actions */}
              <View style={styles.ctaStack}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.primaryButton}
                  // onPress={() => {}}
                >
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Register')}
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
    tintColor: undefined,
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

  /* Form */
  formWrapper: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
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
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  rememberText: {
    color: '#CFCFCF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  linkText: {
    color: '#BBBBBB',
    fontSize: 12.5,
    fontWeight: '700',
  },

  /* Actions */
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
  ghostButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#BEBEBE',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Divider */
  dividerRow: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#222222',
  },
  dividerText: {
    color: '#8C8C8C',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Social */
  socialRow: {
    marginTop: 14,
    gap: 10,
  },
  socialButton: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialText: {
    color: '#EDEDED',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Footer */
  footerArea: {
    marginTop: 36,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerBrand: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
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