import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIScreen from '../screens/ai';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import SettingsScreen from '../screens/settings';
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          height: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="IA"
        component={AIScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="robot" color={color} size={size} />
          ),
          tabBarLabel: 'IA',
        }}
      />
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={size} />
          ),
          tabBarLabel: 'Perfil',
        }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
          tabBarLabel: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
}
