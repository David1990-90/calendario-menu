import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComidasIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Platos</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/comidas/nuevo')}>
        <Text style={styles.buttonText}>➕ Añadir nuevo plato</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/comidas/listado')}>
        <Text style={styles.buttonText}>📋 Ver listado de platos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
