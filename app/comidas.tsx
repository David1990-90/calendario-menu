import { StyleSheet, Text, View } from 'react-native';

export default function Comidas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Comidas</Text>
      <Text>Lista de tus comidas organizadas por día o tipo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
