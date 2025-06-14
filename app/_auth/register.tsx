import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
  // Validaciones básicas
  if (!nombre || !apellidos || !email || !password) {
    Alert.alert('Campos incompletos', 'Por favor, rellena todos los campos.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Correo no válido', 'Introduce un correo electrónico válido.');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const grupoId = user.uid;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      nombre,
      apellidos,
      grupoId,
    });

    await setDoc(doc(db, 'grupos', grupoId), {
      nombreGrupo: `Grupo de ${nombre} ${apellidos}`,
      miembros: [user.uid],
    });

    Alert.alert('Registro exitoso', `Bienvenido/a ${nombre}`);
    router.replace('/');
  } catch (error: any) {
  console.error(error);

  if (error.code === 'auth/email-already-in-use') {
    Alert.alert('Correo en uso', 'Ya existe una cuenta con este correo electrónico.');
  } else if (error.code === 'auth/invalid-email') {
    Alert.alert('Correo no válido', 'Introduce un correo electrónico válido.');
  } else {
    Alert.alert('Error al registrar', error.message);
  }
}

};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
});
