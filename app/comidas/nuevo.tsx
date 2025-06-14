import { Picker } from '@react-native-picker/picker';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function NuevoPlatoScreen() {
  const { user } = useAuth();
  const [nombrePlato, setNombrePlato] = useState('');
  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('gramos');
  const [ingredientes, setIngredientes] = useState<
    { nombre: string; cantidad: string; unidad: string }[]
  >([]);

  const agregarIngrediente = () => {
    if (nombreIngrediente.trim() && cantidad.trim()) {
      setIngredientes([
        ...ingredientes,
        { nombre: nombreIngrediente.trim(), cantidad: cantidad.trim(), unidad },
      ]);
      setNombreIngrediente('');
      setCantidad('');
      setUnidad('gramos');
    }
  };

  const eliminarIngrediente = (index: number) => {
    const nuevaLista = ingredientes.filter((_, i) => i !== index);
    setIngredientes(nuevaLista);
  };

  const guardarPlato = async () => {
    if (!nombrePlato || ingredientes.length === 0) {
      Alert.alert('Datos incompletos', 'El plato debe tener un nombre y al menos un ingrediente.');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      const grupoId = userDoc.data()?.grupoId;

      await addDoc(collection(db, 'grupos', grupoId, 'platos'), {
        nombre: nombrePlato,
        ingredientes,
        creadoPor: user!.uid,
        creadoEn: new Date(),
      });

      Alert.alert('Éxito', 'Plato guardado correctamente.');
      setNombrePlato('');
      setIngredientes([]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Plato</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del plato"
        value={nombrePlato}
        onChangeText={setNombrePlato}
      />

      <Text style={styles.subtitle}>Añadir ingrediente</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrediente"
        value={nombreIngrediente}
        onChangeText={setNombreIngrediente}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />
      <Picker
        selectedValue={unidad}
        onValueChange={(value) => setUnidad(value)}
        style={styles.picker}
      >
        <Picker.Item label="gramos" value="gramos" />
        <Picker.Item label="unidades" value="unidades" />
        <Picker.Item label="ml" value="ml" />
        <Picker.Item label="cucharadas" value="cucharadas" />
        <Picker.Item label="tazas" value="tazas" />
      </Picker>
      <Button title="Añadir ingrediente" onPress={agregarIngrediente} />

      <FlatList
        data={ingredientes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => eliminarIngrediente(index)}>
            <Text style={styles.ingrediente}>
              {item.nombre} - {item.cantidad} {item.unidad}  <Text style={{ color: 'red' }}>✕</Text>
            </Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Guardar plato" onPress={guardarPlato} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ingrediente: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    color: '#333',
  },
});
