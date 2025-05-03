import { StyleSheet, Text, View } from 'react-native';

export default function Calendario() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Calendario</Text>
      <Text>Aquí podrás ver tu calendario mensual de menús.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
