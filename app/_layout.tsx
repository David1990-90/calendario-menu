// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
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
