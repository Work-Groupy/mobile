import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout, deleteAccount } = useAuth();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const initial = useMemo(() => {
    if (!user?.name) return '?';
    const t = user.name.trim();
    return t ? t[0].toUpperCase() : '?';
  }, [user?.name]);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
          } catch {
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
      navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header User Card */}
          <LinearGradient
            colors={['#171717', '#121212']}
            style={styles.headerCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerRow}>
              <View style={styles.avatarWrapper}>
                <LinearGradient
                  colors={['#262626', '#1A1A1A']}
                  style={styles.avatarCircle}
                >
                  <Text style={styles.avatarText}>{initial}</Text>
                </LinearGradient>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.name || 'Convidado'}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user?.email || 'Sem e-mail'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.miniBtn}
                activeOpacity={0.85}
                onPress={handleLogout}
                disabled={!user}
              >
                <Feather name="log-out" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userMetaRow}>
              <View style={styles.metaPill}>
                <Feather name="shield" size={14} color="#7BFFB9" />
                <Text style={styles.metaText}>Seguro</Text>
              </View>
              <View style={styles.metaPill}>
                <Feather name="check-circle" size={14} color="#C9A6FF" />
                <Text style={styles.metaText}>Ativo</Text>
              </View>
              <View style={styles.metaPill}>
                <Feather name="navigation" size={14} color="#61C3FF" />
                <Text style={styles.metaText}>Explorando</Text>
              </View>
            </View>
          </LinearGradient>

            {/* Sections */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <SettingsItem
              icon={<Feather name="user" size={20} color="#fff" />}
              title="Perfil"
              subtitle="Visualizar e editar informações"
              onPress={() => navigation.navigate('Perfil')}
              disabled={!user}
            />
            <SettingsItem
              icon={<Feather name="lock" size={20} color="#fff" />}
              title="Segurança"
              subtitle="Gerencie credenciais e proteção"
              onPress={() => {}}
              disabled
            />
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Preferências</Text>
            <SettingsItem
              icon={<Feather name="bell" size={20} color="#fff" />}
              title="Notificações"
              subtitle="Em breve"
              disabled
            />
            <SettingsItem
              icon={<Feather name="globe" size={20} color="#fff" />}
              title="Idioma"
              subtitle="Português (Brasil)"
              disabled
            />
            <SettingsItem
              icon={<Feather name="sun" size={20} color="#fff" />}
              title="Tema"
              subtitle="Escuro"
              disabled
            />
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Privacidade</Text>
            <SettingsItem
              icon={<Feather name="shield" size={20} color="#fff" />}
              title="Política de Privacidade"
              subtitle="Leia como protegemos seus dados"
              onPress={() => {}}
              disabled
            />
            <SettingsItem
              icon={<Feather name="file-text" size={20} color="#fff" />}
              title="Termos de Uso"
              subtitle="Regras e responsabilidades"
              onPress={() => {}}
              disabled
            />
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerBlock}>
            <Text style={styles.sectionTitle}>Zona de Risco</Text>
            <LinearGradient
              colors={['#2A0B0B', '#200808']}
              style={styles.dangerCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.dangerRow}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={28}
                  color="#FF6B5E"
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.dangerTitle}>Deletar Conta</Text>
                  <Text style={styles.dangerSubtitle}>
                    Esta ação remove permanentemente seus dados.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.dangerBtn,
                  (loadingDelete || !user) && { opacity: 0.5 },
                ]}
                disabled={loadingDelete || !user}
                onPress={confirmDelete}
              >
                {loadingDelete ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.dangerBtnText}>Confirmar Exclusão</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.footerArea}>
            <Text style={styles.footerBrand}>
              © {new Date().getFullYear()} Work Group
            </Text>
            <View style={styles.footerLinksRow}>
              <Text style={styles.footerLink}>Privacidade</Text>
              <Text style={styles.footerSep}>•</Text>
              <Text style={styles.footerLink}>Termos</Text>
            </View>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function SettingsItem({ icon, title, subtitle, onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.itemOuter, disabled && { opacity: 0.5 }]}
    >
      <LinearGradient
        colors={['#1D1D1D', '#141414']}
        style={styles.itemCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.itemIconBox}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <AntDesign name="right" size={16} color="#666" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 20, paddingBottom: 0 },

  headerCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#242424',
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: { width: 62, height: 62 },
  avatarCircle: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  avatarText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userEmail: {
    color: '#BDBDBD',
    fontSize: 13,
    fontWeight: '600',
  },
  miniBtn: {
    backgroundColor: '#151515',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232323',
  },
  userMetaRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#272727',
  },
  metaText: {
    color: '#DADADA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  sectionGroup: { marginBottom: 30, gap: 14 },
  sectionTitle: {
    color: '#8E8E8E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingLeft: 4,
  },

  itemOuter: {},
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232323',
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  itemSubtitle: {
    color: '#8E8E8E',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  dangerBlock: { marginBottom: 26, gap: 14 },
  dangerCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#361C1C',
    gap: 16,
  },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dangerTitle: { color: '#FF6B5E', fontSize: 16, fontWeight: '800' },
  dangerSubtitle: { color: '#FFB2AA', fontSize: 12, fontWeight: '600', lineHeight: 16 },
  dangerBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5147',
  },
  dangerBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  footerArea: {
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
  },
  footerBrand: { color: '#777777', fontSize: 12, fontWeight: '600' },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: { color: '#B5B5B5', fontSize: 12, fontWeight: '700' },
  footerSep: { color: '#333333', fontSize: 12, fontWeight: '700' },
});