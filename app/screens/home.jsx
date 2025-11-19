import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '@env';

export default function HomeScreen() {
  const [expanded, setExpanded] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState({}); // { [id]: true }

  const postExcerpt = 'Uma reflexão direta sobre como a automação e a IA podem deslocar funções tradicionais, mas também abrir portas...';
  const postFull = useMemo(
    () =>
      'O perigo dos futuros trabalhos não está apenas na substituição por máquinas, mas na rapidez da transformação. ' +
      'Setores inteiros serão reconfigurados, exigindo novas habilidades e adaptabilidade constante. ' +
      'Ao mesmo tempo, surgem oportunidades inéditas: novas funções criativas, curadoria de IA, ' +
      'engenharia de prompts, segurança de modelos e produtos digitais colaborativos. ' +
      'O ponto-chave é preparar-se agora: aprender continuamente, construir portfólio e se conectar com pessoas certas.',
    []
  );

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(`${API_URL}/user/all`, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Falha ao buscar usuários: ${res.status}`);
        const data = await res.json();
        // Esperado: [{ id, name, email, profile(base64?) ... }]
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    };
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFollow = (id) => setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderUserAvatar = (u) => {
    if (u?.profile) {
      // Se o backend enviar base64, renderiza como data URI
      return (
        <Image
          source={{ uri: `data:image/png;base64,${u.profile}` }}
          style={styles.personAvatarImg}
        />
      );
    }
    // fallback: iniciais
    const initial = (u?.name || '?').trim().charAt(0).toUpperCase();
    return (
      <View style={styles.personAvatarFallback}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#050505', '#111111']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.profileBubble}>
              <Text style={styles.profileInitial}>B</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionIntroTitle}>Início</Text>
          <Text style={styles.sectionIntroSubtitle}>Veja um destaque e pessoas para seguir.</Text>
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: 'https://avatars.githubusercontent.com/u/160923665?v=4' }}
                style={styles.postAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.postAuthor}>Broggine</Text>
                <Text style={styles.postMeta}>há 2h • Tendências</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setExpanded((e) => !e)} activeOpacity={0.8}>
              <Text style={styles.postTitle}>Futuros trabalhos: perigo e novas oportunidades</Text>
              <Text
                style={styles.postBody}
                numberOfLines={expanded ? 0 : 3}
              >
                {expanded ? postFull : postExcerpt}
              </Text>
              <Text style={styles.postMore}>{expanded ? 'Recolher ▲' : 'Ler mais ▼'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.peopleHeader}>
            <Text style={styles.peopleTitle}>Pessoas para seguir</Text>
            <Text style={styles.peopleSubtitle}>Conecte-se com profissionais</Text>
          </View>

          {loadingUsers ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : users.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          ) : (
            <View style={styles.peopleList}>
              {users.map((u) => {
                const isFollowing = !!following[u.id];
                return (
                  <View key={u.id} style={styles.personRow}>
                    <View style={styles.personLeft}>
                      <View style={styles.personAvatar}>{renderUserAvatar(u)}</View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.personName} numberOfLines={1}>
                          {u.name}
                        </Text>
                        <Text style={styles.personEmail} numberOfLines={1}>
                          {u.email}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFollow(u.id)}
                      activeOpacity={0.85}
                      style={[styles.followBtn, isFollowing ? styles.following : styles.toFollow]}
                    >
                      <Text
                        style={[
                          styles.followText,
                          isFollowing ? styles.followingText : styles.toFollowText,
                        ]}
                      >
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 28 }} />
        </ScrollView>
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
    paddingBottom: 20 
  },

  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 18, 
    paddingTop: 10, 
    paddingBottom: 6 
  },

  brandRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },

  logoImage: { 
    width: 100, 
    height: 100, 
    resizeMode: 'contain' 
  },

  brandText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '800', 
    letterSpacing: 0.2 
  },

  profileBubble: {
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#161616',
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#222'
  },

  profileInitial: { 
    color: '#fff', 
    fontWeight: '800' 
  },

  sectionIntroTitle: {
    marginTop: 6, 
    paddingHorizontal: 18,
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: -0.2
  },

  sectionIntroSubtitle: {
    marginTop: 6, 
    paddingHorizontal: 18,
    color: '#CFCFCF', 
    fontSize: 13.5
  },

  postCard: {
    marginTop: 16, 
    marginHorizontal: 18,
    backgroundColor: '#0F0F0F', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#1E1E1E', 
    padding: 14
  },

  postHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 8 
  },

  postAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },

  postAuthor: { 
    color: '#FFFFFF', 
    fontSize: 14.5, 
    fontWeight: '800' 
  },

  postMeta: { 
    color: '#BDBDBD', 
    fontSize: 11 
  },

  postTitle: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '800', 
    marginTop: 6, 
    marginBottom: 6 
  },

  postBody: { 
    color: '#D9D9D9', 
    fontSize: 14, 
    lineHeight: 20 
  },

  postMore: { 
    color: '#BEBEBE', 
    fontSize: 12, 
    fontWeight: '700', 
    marginTop: 8, 
    textDecorationLine: 'underline' 
  },

  peopleHeader: { 
    marginTop: 18, 
    paddingHorizontal: 18 
  },

  peopleTitle: { 
    color: '#fff', 
    fontSize: 16.5, 
    fontWeight: '800' 
  },

  peopleSubtitle: { 
    color: '#BDBDBD', 
    fontSize: 12, 
    marginTop: 2 
  },

  emptyText: { 
    color: '#8C8C8C', 
    fontSize: 12, 
    paddingHorizontal: 18, 
    marginTop: 10 
  },

  peopleList: { 
    paddingHorizontal: 18, 
    marginTop: 10, 
    gap: 10 
  },

  personRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#0F0F0F', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#1E1E1E', 
    padding: 12
  },

  personLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    flex: 1, 
    paddingRight: 10 
  },

  personAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    overflow: 'hidden' 
  },

  personAvatarImg: { 
    width: '100%', 
    height: '100%' 
  },

  personAvatarFallback: {
    width: '100%', 
    height: '100%', 
    borderRadius: 22, 
    backgroundColor: '#161616',
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#222'
  },

  avatarInitial: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 16 
  },

  personName: { 
    color: '#FFFFFF', 
    fontSize: 14.5, 
    fontWeight: '800' 
  },

  personEmail: { 
    color: '#DADADA', 
    fontSize: 12.5 
  },

  followBtn: {
    minWidth: 92, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1
  },

  toFollow: { 
    backgroundColor: '#FFFFFF', 
    borderColor: '#FFFFFF' 
  },

  toFollowText: { 
    color: '#000', 
    fontWeight: '800', 
    fontSize: 12.5 
  },

  following: { 
    backgroundColor: '#111', 
    borderColor: '#222' 
  },

  followingText: { 
    color: '#EDEDED', 
    fontWeight: '800', 
    fontSize: 12.5 
  }
});
