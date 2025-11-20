import { createContext, useContext, useEffect, useState } from 'react';
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
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setLoadingInit(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => `Erro ${res.status}`);
      throw new Error(msg);
    }
    const data = await res.json();
    await AsyncStorage.setItem('authUser', JSON.stringify(data));
    setUser(data);
    return data;
  }

  async function logout() {
    await AsyncStorage.removeItem('authUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingInit }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}