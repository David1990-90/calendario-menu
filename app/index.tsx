// app/index.tsx
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/styles';

export default function Home() {
  return (
    <View style={globalStyles.container}>
      <Image source={require('../assets/images/react-logo.png')} style={globalStyles.logo} />
      <Text style={globalStyles.title}>¡Bienvenido a tu calendario de menú!</Text>
      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}
