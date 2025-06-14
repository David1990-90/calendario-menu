import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';

export default function CuentaScreen() {
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setApellidos(data.apellidos || '');
        }
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  const guardarCambios = async () => {
    try {
      if (!nombre || !apellidos) {
        Alert.alert('Campos incompletos', 'Nombre y apellidos son obligatorios.');
        return;
      }

      await updateDoc(doc(db, 'users', user!.uid), {
        nombre,
        apellidos,
      });

      Alert.alert('Perfil actualizado', 'Los cambios se han guardado correctamente.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={apellidos}
        onChangeText={setApellidos}
      />
      <Button title="Guardar cambios" onPress={guardarCambios} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
});
