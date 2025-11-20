import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('authUser');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        }
      } finally {
        setLoadingInit(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    if (!res.ok) {
      let msg = `Erro ${res.status}`;
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {}
      throw new Error(msg || 'Falha no login.');
    }
    const data = await res.json();
    const normalizedUser = {
      ...data,
      email: data?.email ? String(data.email).toLowerCase() : normalizedEmail,
    };
    await AsyncStorage.setItem('authUser', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  }

  async function logout() {
    await AsyncStorage.removeItem('authUser');
    setUser(null);
  }

  async function deleteAccount() {
    if (!user?.id) throw new Error('Usuário inválido.');
    const res = await fetch(`${API_URL}/user/delete/${user.id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      let msg = `Erro ${res.status}`;
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {}
      throw new Error(msg || 'Falha ao deletar conta.');
    }
    await AsyncStorage.removeItem('authUser');
    setUser(null);
    return true;
  }

  const refreshUser = useCallback(async () => {
    const raw = await AsyncStorage.getItem('authUser');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        return parsed;
      } catch {
        return null;
      }
    } else {
      setUser(null);
      return null;
    }
  }, []);

  const refetchUserFromAPI = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('authUser');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (!parsed?.id) return parsed;

      const res = await fetch(`${API_URL}/user/${parsed.id}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return parsed;

      const fresh = await res.json();
      const normalizedFresh = {
        ...fresh,
        email: fresh?.email ? String(fresh.email).toLowerCase() : parsed.email,
      };
      await AsyncStorage.setItem('authUser', JSON.stringify(normalizedFresh));
      setUser(normalizedFresh);
      return normalizedFresh;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        deleteAccount,
        loadingInit,
        refreshUser,
        refetchUserFromAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}