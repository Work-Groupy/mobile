import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const featureBullets = [
  { id: 'f1', icon: '⚡', text: 'Fluxo ágil de tarefas' },
  { id: 'f2', icon: '🔐', text: 'Dados protegidos' },
  { id: 'f3', icon: '💬', text: 'Comunicação direta' },
  { id: 'f4', icon: '📊', text: 'Métricas para a carreira' },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;

  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslate = useRef(new Animated.Value(16)).current;

  const valueOpacity = useRef(new Animated.Value(0)).current;
  const valueTranslate = useRef(new Animated.Value(16)).current;

  const featureAnims = useRef(featureBullets.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const logoIn = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]);

    const heroIn = Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const ctaIn = Animated.parallel([
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ctaTranslate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const valueIn = Animated.parallel([
      Animated.timing(valueOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(valueTranslate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const featuresIn = Animated.stagger(
      80,
      featureAnims.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    );

    Animated.sequence([logoIn, Animated.stagger(120, [heroIn, ctaIn, valueIn]), featuresIn]).start();
  }, [logoOpacity, logoScale, heroOpacity, heroTranslate, ctaOpacity, ctaTranslate, valueOpacity, valueTranslate, featureAnims]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image source={require('../assets/logo.png')} style={styles.logoImage} />
          </Animated.View>
          <Animated.View
            style={{
              opacity: heroOpacity,
              transform: [{ translateY: heroTranslate }],
            }}
          >
            <Text style={styles.kicker}>Bem-vindo</Text>
            <Text style={styles.heroTitle}>
              Conecte, Organize e Evolua com <Text style={styles.heroAccent}>Work Group</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Uma plataforma unificada para profissionais que querem segurança e oportunidades no futuro do trabalho. Conexões,
              confiança e crescimento em um só lugar.
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.ctaStack,
              {
                opacity: ctaOpacity,
                transform: [{ translateY: ctaTranslate }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryButtonText}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Entrar</Text>
            </TouchableOpacity>

          </Animated.View>
          <View style={styles.featuresWrapper}>
            {featureBullets.map((item, idx) => {
              const v = featureAnims[idx];
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    opacity: v,
                    transform: [
                      {
                        translateY: v.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <View style={styles.featureItem}>
                    <Text style={styles.featureIcon}>{item.icon}</Text>
                    <Text style={styles.featureText}>{item.text}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
          <Animated.View
            style={{
              opacity: valueOpacity,
              transform: [{ translateY: valueTranslate }],
            }}
          >
            <LinearGradient colors={['#1A1A1A', '#141414']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.valueCard}>
              <Text style={styles.valueTitle}>Produtividade Real</Text>
              <Text style={styles.valueDesc}>
                Conecte-se com profissionais, compartilhe experiências e acompanhe sua evolução com confiança. Work Group une
                praticidade e inovação para quem busca segurança nas mudanças do mercado de trabalho.
              </Text>
              <View style={styles.valueTagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Visionista</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Segurança</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Social</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          <View style={styles.footerArea}>
            <Text style={styles.footerBrand}>© {new Date().getFullYear()} Work Group</Text>
            <View style={styles.footerLinksRow}>
              <Text style={styles.footerLink}>Privacidade</Text>
              <Text style={styles.footerSep}>•</Text>
              <Text style={styles.footerLink}>Termos</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
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
    paddingBottom: 60,
  },

  /* Logo */
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    tintColor: undefined, // Para manter as cores originais; use '#FFF' para forçar P&B em PNGs compatíveis
  },

  kicker: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    alignSelf: 'center',
    marginBottom: 21,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
    paddingHorizontal: 28,
    textAlign: 'center',
  },
  heroAccent: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    textDecorationColor: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: '#D6D6D6',
    paddingHorizontal: 32,
    textAlign: 'center',
    fontWeight: '500',
  },

  /* CTA */
  ctaStack: {
    marginTop: 30,
    paddingHorizontal: 32,
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#BBBBBB',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Features mini */
  featuresWrapper: {
    marginTop: 36,
    paddingHorizontal: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (width - 26 * 2 - 12 * 3) / 2,
    backgroundColor: '#111111',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222222',
    gap: 8,
  },
  featureIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  featureText: {
    color: '#E0E0E0',
    fontSize: 12.5,
    fontWeight: '600',
    flexShrink: 1,
  },

  /* Value Card */
  valueCard: {
    marginTop: 40,
    marginHorizontal: 24,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  valueTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  valueDesc: {
    color: '#CFCFCF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  valueTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* Footer */
  footerArea: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerBrand: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 15,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#B5B5B5',
    fontSize: 12,
    fontWeight: '600',
  },
  footerSep: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
  },
});