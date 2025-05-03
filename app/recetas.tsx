import { StyleSheet, Text, View } from 'react-native';

export default function Recetas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Recetas</Text>
      <Text>Aquí verás las recetas con ingredientes y pasos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
