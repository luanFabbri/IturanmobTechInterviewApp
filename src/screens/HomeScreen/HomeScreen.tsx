import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, SafeAreaView, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {fetchVehicles} from '../../services/api-config';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../navigation';
import styles from './HomeScreen.styles';

interface Vehicle {
  chassis: string;
  licensePlate: string;
  fuelLevel: number;
  odometerKm: number;
  model: string;
  latitude: number;
  longitude: number;
  pictureLink: string;
}

const HomeScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const userName = useSelector((state: RootState) => state.auth.profile?.name);
  const navigation = useNavigation<NavigationProps>(); // Usar o tipo de navegação definido

  useEffect(() => {
    const getVehicles = async () => {
      if (!token) {
        Alert.alert(
          'Erro',
          'Token de autenticação não encontrado. Por favor, faça login novamente.',
        );
        navigation.navigate('Login'); // Redirecionar para a tela de login se o token for null
        return;
      }

      try {
        const data = await fetchVehicles(token);
        setVehicles(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    };

    getVehicles();
  }, [token, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${userName}&background=random`,
          }}
          style={styles.avatar}
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {vehicles.map((vehicle, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
            }}
            title={vehicle.model}
            description={vehicle.licensePlate}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export default HomeScreen;
