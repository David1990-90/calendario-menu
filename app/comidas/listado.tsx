import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function ListadoPlatosScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [platos, setPlatos] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<any>({});
  const [newIngrediente, setNewIngrediente] = useState<any>({});

  useFocusEffect(
    useCallback(() => {
      const fetchPlatos = async () => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const grupoId = userDoc.data()?.grupoId;
          const snapshot = await getDocs(collection(db, 'grupos', grupoId, 'platos'));
          const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPlatos(datos);
        }
      };
      fetchPlatos();
    }, [user])
  );

 const eliminarPlato = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este plato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const userDoc = await getDoc(doc(db, 'users', user!.uid));
              const grupoId = userDoc.data()?.grupoId;
              await deleteDoc(doc(db, 'grupos', grupoId, 'platos', id));
              setPlatos(prev => prev.filter(plato => plato.id !== id));
            } catch (error: any) {
              console.error(error);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const iniciarEdicion = (platoId: string, index: number, ingrediente: any) => {
    setEditState({
      ...editState,
      [platoId]: {
        index,
        nombre: ingrediente.nombre,
        cantidad: ingrediente.cantidad,
        unidad: ingrediente.unidad,
      },
    });
  };

  const guardarIngredienteEditado = (platoId: string) => {
    const edicion = editState[platoId];
    if (!edicion) return;
    const nuevosPlatos = platos.map((plato) => {
      if (plato.id === platoId) {
        const nuevosIngredientes = [...plato.ingredientes];
        nuevosIngredientes[edicion.index] = {
          nombre: edicion.nombre,
          cantidad: edicion.cantidad,
          unidad: edicion.unidad,
        };
        return { ...plato, ingredientes: nuevosIngredientes };
      }
      return plato;
    });
    setPlatos(nuevosPlatos);
    setEditState({ ...editState, [platoId]: null });
    Alert.alert('Ingrediente actualizado');
  };

  const eliminarIngrediente = (platoId: string, index: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro que quieres eliminar este ingrediente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const nuevosPlatos = platos.map((plato) => {
              if (plato.id === platoId) {
                const nuevosIngredientes = [...plato.ingredientes];
                nuevosIngredientes.splice(index, 1);
                return { ...plato, ingredientes: nuevosIngredientes };
              }
              return plato;
            });
            setPlatos(nuevosPlatos);
          },
        },
      ]
    );
  };

  const agregarIngrediente = (platoId: string) => {
    const nuevo = newIngrediente[platoId];
    if (!nuevo?.nombre || !nuevo?.cantidad) return;
    const nuevosPlatos = platos.map((plato) => {
      if (plato.id === platoId) {
        const nuevosIngredientes = [...plato.ingredientes, {
          nombre: nuevo.nombre,
          cantidad: nuevo.cantidad,
          unidad: nuevo.unidad || 'gramos',
        }];
        return { ...plato, ingredientes: nuevosIngredientes };
      }
      return plato;
    });
    setPlatos(nuevosPlatos);
    setNewIngrediente({ ...newIngrediente, [platoId]: {} });
    Alert.alert('Ingrediente añadido');
  };

  const guardarCambiosPlato = async (plato: any) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      const grupoId = userDoc.data()?.grupoId;
      await updateDoc(doc(db, 'grupos', grupoId, 'platos', plato.id), {
        ingredientes: plato.ingredientes,
      });
      Alert.alert('Plato actualizado');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de Platos</Text>
      <FlatList
        data={platos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.plato}>
            <TouchableOpacity onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <Text style={styles.nombre}>{item.nombre}</Text>
            </TouchableOpacity>

            {expandedId === item.id && (
              <View>
                {item.ingredientes.map((ing: any, index: number) => (
                  <View key={index} style={styles.ingredienteRow}>
                    <Text style={styles.ingrediente}>
                      - {ing.nombre} ({ing.cantidad} {ing.unidad})
                    </Text>
                    <TouchableOpacity onPress={() => iniciarEdicion(item.id, index, ing)}>
                      <Text style={styles.editar}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarIngrediente(item.id, index)}>
                      <Text style={styles.eliminar}>❌</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {editState[item.id] && (
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrediente"
                      value={editState[item.id].nombre}
                      onChangeText={(text) => setEditState({ ...editState, [item.id]: { ...editState[item.id], nombre: text } })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Cantidad"
                      value={editState[item.id].cantidad}
                      onChangeText={(text) => setEditState({ ...editState, [item.id]: { ...editState[item.id], cantidad: text } })}
                      keyboardType="numeric"
                    />
                    <Picker
                      selectedValue={editState[item.id].unidad}
                      onValueChange={(value) => setEditState({ ...editState, [item.id]: { ...editState[item.id], unidad: value } })}
                      style={styles.picker}
                    >
                      <Picker.Item label="gramos" value="gramos" />
                      <Picker.Item label="unidades" value="unidades" />
                      <Picker.Item label="ml" value="ml" />
                      <Picker.Item label="cucharadas" value="cucharadas" />
                      <Picker.Item label="tazas" value="tazas" />
                    </Picker>
                    <Button title="Guardar ingrediente" onPress={() => guardarIngredienteEditado(item.id)} />
                  </View>
                )}

                <Text style={styles.subtitle}>Añadir nuevo ingrediente</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrediente"
                  value={newIngrediente[item.id]?.nombre || ''}
                  onChangeText={(text) => setNewIngrediente({ ...newIngrediente, [item.id]: { ...newIngrediente[item.id], nombre: text } })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Cantidad"
                  value={newIngrediente[item.id]?.cantidad || ''}
                  onChangeText={(text) => setNewIngrediente({ ...newIngrediente, [item.id]: { ...newIngrediente[item.id], cantidad: text } })}
                  keyboardType="numeric"
                />
                <Picker
                  selectedValue={newIngrediente[item.id]?.unidad || 'gramos'}
                  onValueChange={(value) => setNewIngrediente({ ...newIngrediente, [item.id]: { ...newIngrediente[item.id], unidad: value } })}
                  style={styles.picker}
                >
                  <Picker.Item label="gramos" value="gramos" />
                  <Picker.Item label="unidades" value="unidades" />
                  <Picker.Item label="ml" value="ml" />
                  <Picker.Item label="cucharadas" value="cucharadas" />
                  <Picker.Item label="tazas" value="tazas" />
                </Picker>
                <Button title="Añadir ingrediente" onPress={() => agregarIngrediente(item.id)} />
                <Button title="Guardar cambios del plato" onPress={() => guardarCambiosPlato(item)} />
              </View>
            )}

            <TouchableOpacity onPress={() => eliminarPlato(item.id)}>
              <Text style={styles.eliminar}>Eliminar ❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Añadir nuevo plato" onPress={() => router.push('/comidas/nuevo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  plato: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  nombre: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  ingredienteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ingrediente: { fontSize: 14, color: '#333', flex: 1 },
  editar: { color: 'blue', marginHorizontal: 5 },
  eliminar: { color: 'red', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  picker: {
    marginVertical: 5,
  },
});
