import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Stack />;
  }

  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="calendario" options={{ title: 'Calendario' }} />
      <Drawer.Screen name="comidas" options={{ title: 'Comidas' }} />
      <Drawer.Screen name="recetas" options={{ title: 'Recetas' }} />
      <Drawer.Screen name="cuenta" options={{ title: 'Mi Cuenta' }} />
    </Drawer>
  );
}

export default function LayoutWrapper() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
