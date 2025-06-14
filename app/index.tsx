import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebaseConfig';
import { globalStyles } from '../styles/styles';

export default function Home() {
  const { user } = useAuth();
  const [nombreCompleto, setNombreCompleto] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNombreCompleto(`${data.nombre} ${data.apellidos}`);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Bienvenido a Calendario de Menú</Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.push('/_auth/login')}>
          <Text style={globalStyles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.push('/_auth/register')}>
          <Text style={globalStyles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>¡Hola {nombreCompleto || user.email}!</Text>
      <Text>Aquí estará tu calendario de menú semanal.</Text>
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#dc3545' }]}
        onPress={() => signOut(auth)}
      >
        <Text style={globalStyles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
