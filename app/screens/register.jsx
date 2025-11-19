import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useMemo, useState } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const emailValido = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const senhaForte = useMemo(() => senha.length >= 6, [senha]);
  const nomeValido = useMemo(() => nome.trim().length > 1, [nome]);
  const podeEnviar = nomeValido && emailValido && senhaForte;

  const handleRegister = async () => {
  if (!podeEnviar) return;

  const payload = {
    name: nome.trim(),
    email: email.trim(),
    password: senha,
  };

  try {
    const response = await axios.post(
      `${API_URL}/user/create`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Usuário criado:", response.data);

    Alert.alert("Conta criada com sucesso!", "Perfeito!");
    navigation.navigate("Home");

  } catch (err) {
    console.log("Erro:", err);
    Alert.alert("Erro ao criar conta", "Tente novamente.");
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.logoWrapper}>
              <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.kicker}>Criar conta</Text>
            <Text style={styles.heroTitle}>
              Junte-se ao <Text style={styles.heroAccent}>Work Group</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Use seu nome, e-mail e uma senha forte para começar.
            </Text>
            <View style={styles.formWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome completo</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="João Campos"
                    placeholderTextColor="#8A8A8A"
                    style={styles.input}
                    autoCapitalize="words"
                    textContentType="name"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View style={[styles.inputBox, email.length > 0 && !emailValido && styles.inputError]}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="joao.campos@example.com"
                    placeholderTextColor="#8A8A8A"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                </View>
                {email.length > 0 && !emailValido && <Text style={styles.hintText}>Digite um e-mail válido.</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputBoxRow}>
                  <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="SenhaForte@123"
                    placeholderTextColor="#8A8A8A"
                    style={[styles.input, { flex: 1 }]}
                    secureTextEntry={!mostrarSenha}
                    autoCapitalize="none"
                    textContentType="newPassword"
                  />
                  <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} style={styles.toggleBtn} activeOpacity={0.7}>
                    <Text style={styles.toggleBtnText}>{mostrarSenha ? 'Ocultar' : 'Mostrar'}</Text>
                  </TouchableOpacity>
                </View>
                {senha.length > 0 && !senhaForte && <Text style={styles.hintText}>Use pelo menos 6 caracteres.</Text>}
              </View>

              <View style={styles.ctaStack}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.primaryButton, !podeEnviar && styles.primaryButtonDisabled]}
                  disabled={!podeEnviar}
                  onPress={handleRegister}
                >
                  <Text style={[styles.primaryButtonText, !podeEnviar && styles.primaryButtonTextDisabled]}>
                    Criar conta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
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
    backgroundColor: '#000' 
  },

  gradient: { 
    flex: 1 
  },

  scrollContent: { 
    paddingTop: 24, 
    paddingBottom: 40 
  },

  logoWrapper: { 
    alignItems: 'center', 
    marginBottom: 22 
  },

  logoImage: { 
    width: 100, 
    height: 100, 
    resizeMode: 'contain' 
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
  inputError: {
    borderColor: '#3A3A3A',
    backgroundColor: '#101010',
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
  ctaStack: 
  { 
    marginTop: 16, 
    gap: 12 
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
  primaryButtonText:{ 
    color: '#000000',
    fontSize: 16, 
    fontWeight: '800', 
    letterSpacing: 0.4 
  },
  primaryButtonTextDisabled: { 
    color: '#999999' 
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
    fontWeight: '700' 
  },
  footerArea: { 
    marginTop: 36, 
    alignItems: 'center', 
    paddingHorizontal: 24 
  },

  footerBrand: { 
    color: '#777777', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  footerLinksRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    flexWrap: 'wrap' 
  },

  footerLink: { 
    color: '#B5B5B5', 
    fontSize: 12, 
    fontWeight: '700' 
  },

  footerSep: { 
    color: '#333333', 
    fontSize: 12, 
    fontWeight: '700' 
  },
});