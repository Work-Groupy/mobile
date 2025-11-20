import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';

const senhaRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|:;\"'<>,.?/])[A-Za-z\d!@#$%^&*()_+\-={}\[\]|:;\"'<>,.?/]{8,}$/;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // E-mail verificação
  const [emailEmUso, setEmailEmUso] = useState(false);
  const [checandoEmail, setChecandoEmail] = useState(false);
  const [erroChecagemEmail, setErroChecagemEmail] = useState(null);
  const ultimaConsultaRef = useRef('');

  // Validações
  const emailValido = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const nomeValido = useMemo(() => nome.trim().length > 1, [nome]);

  // Critérios de senha individuais
  const temMinuscula = /[a-z]/.test(senha);
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /\d/.test(senha);
  const temEspecial = /[!@#$%^&*()_+\-={}\[\]|:;\"'<>,.?/]/.test(senha);
  const tamanhoOk = senha.length >= 8;

  const senhaValida = useMemo(
    () => senhaRegex.test(senha),
    [senha]
  );

  const podeEnviar =
    nomeValido && emailValido && senhaValida && !emailEmUso && !checandoEmail;

  // Verificação de e-mail (debounce)
  useEffect(() => {
    setEmailEmUso(false);
    setErroChecagemEmail(null);

    if (!emailValido) return;

    const emailNormalizado = email.trim().toLowerCase();
    const handle = setTimeout(async () => {
      if (ultimaConsultaRef.current === emailNormalizado) return;
      setChecandoEmail(true);
      try {
        const resp = await axios.get(`${API_URL}/user/exists`, {
          params: { email: emailNormalizado },
          headers: { Accept: 'application/json' },
        });
        const exists = !!resp.data?.exists;
        setEmailEmUso(exists);
        ultimaConsultaRef.current = emailNormalizado;
      } catch (err) {
        console.log('Erro verificando email:', err?.message);
        setErroChecagemEmail('Não foi possível verificar o e-mail agora.');
      } finally {
        setChecandoEmail(false);
      }
    }, 600);

    return () => clearTimeout(handle);
  }, [email, emailValido]);

  const handleRegister = async () => {
    if (!podeEnviar) return;

    const payload = {
      name: nome.trim(),
      email: email.trim().toLowerCase(),
      password: senha,
    };

    try {
      const response = await axios.post(
        `${API_URL}/user/create`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Usuário criado:', response.data);
      Alert.alert('Conta criada com sucesso!', 'Perfeito!');
      navigation.navigate('Login');
    } catch (err) {
      if (err?.response?.status === 409) {
        setEmailEmUso(true);
        Alert.alert('E-mail já utilizado', 'Escolha outro e-mail.');
      } else {
        console.log('Erro:', err);
        Alert.alert('Erro ao criar conta', 'Tente novamente.');
      }
    }
  };

  const renderSenhaRequisitos = () => {
    if (senha.length === 0) return null;
    const itens = [
      { label: 'Mínimo 8 caracteres', ok: tamanhoOk },
      { label: 'Letra minúscula (a-z)', ok: temMinuscula },
      { label: 'Letra maiúscula (A-Z)', ok: temMaiuscula },
      { label: 'Número (0-9)', ok: temNumero },
      { label: 'Caractere especial (!@#$... etc.)', ok: temEspecial },
    ];
    return (
      <View style={{ marginTop: 8 }}>
        {!senhaValida && (
          <Text style={styles.hintTextError}>
            Senha não atende aos requisitos:
          </Text>
        )}
        {itens.map(i => (
          <Text
            key={i.label}
            style={[styles.reqItem, i.ok ? styles.reqOk : styles.reqPending]}
          >
            {i.ok ? '• ' : '○ '} {i.label}
          </Text>
        ))}
      </View>
    );
  };

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
                <View
                  style={[
                    styles.inputBoxRow,
                    email.length > 0 && !emailValido && styles.inputError,
                    emailValido && emailEmUso && styles.inputError,
                  ]}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="joao.campos@example.com"
                    placeholderTextColor="#8A8A8A"
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                  {checandoEmail && (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />
                  )}
                </View>
                {email.length > 0 && !emailValido && (
                  <Text style={styles.hintText}>Digite um e-mail válido.</Text>
                )}
                {emailValido && emailEmUso && (
                  <Text style={styles.hintTextError}>E-mail ja utilizado</Text>
                )}
                {erroChecagemEmail && !emailEmUso && (
                  <Text style={styles.hintTextWarn}>{erroChecagemEmail}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View
                  style={[
                    styles.inputBoxRow,
                    senha.length > 0 && !senhaValida && styles.inputError,
                  ]}
                >
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
                  <TouchableOpacity
                    onPress={() => setMostrarSenha(v => !v)}
                    style={styles.toggleBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.toggleBtnText}>{mostrarSenha ? 'Ocultar' : 'Mostrar'}</Text>
                  </TouchableOpacity>
                </View>
                {renderSenhaRequisitos()}
              </View>

              <View style={styles.ctaStack}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.primaryButton, !podeEnviar && styles.primaryButtonDisabled]}
                  disabled={!podeEnviar}
                  onPress={handleRegister}
                >
                  <Text
                    style={[styles.primaryButtonText, !podeEnviar && styles.primaryButtonTextDisabled]}
                  >
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

  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#1C0000',
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

  primaryButtonTextDisabled: {
    color: '#999999',
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

  hintText: {
    marginTop: 6,
    fontSize: 12,
    color: '#C2C2C2',
    fontWeight: '600',
  },

  hintTextError: {
    marginTop: 6,
    fontSize: 12,
    color: '#FF5F56',
    fontWeight: '700',
  },

  hintTextWarn: {
    marginTop: 6,
    fontSize: 11.5,
    color: '#FFA34D',
    fontWeight: '600',
  },

  reqItem: {
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: '600',
  },

  reqOk: {
    color: '#4CAF50',
  },

  reqPending: {
    color: '#888888',
  },

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
