import { StyleSheet, Text, View } from 'react-native';

export default function Cuenta() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Cuenta</Text>
      <Text>Gestiona tus datos personales e inicio de sesión.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
