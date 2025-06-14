import { router } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../../firebaseConfig';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Inicio de sesión correcto', '¡Bienvenido!');
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  const handlePasswordReset = async () => {
  if (!email) {
    Alert.alert('Introduce tu correo', 'Por favor, escribe tu correo electrónico para recuperar tu contraseña.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
  } catch (error: any) {
    console.error(error);
    if (error.code === 'auth/user-not-found') {
      Alert.alert('Usuario no encontrado', 'No hay ninguna cuenta registrada con ese correo.');
    } else {
      Alert.alert('Error', error.message);
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
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
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="¿Olvidaste tu contraseña?" onPress={handlePasswordReset} />

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
