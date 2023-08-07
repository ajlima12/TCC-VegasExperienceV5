import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import firestore from "@react-native-firebase/firestore";

//imagens
const getImagemTransporte = (nomeTransporte) => {
  // Adicione os casos com os nomes de transporte e as imagens correspondentes
  switch (nomeTransporte) {
    case 'The Deuce':
      return require('../assets/onibus.jpg');
    case 'Monorail':
      return require('../assets/monorail.jpg');
    case 'Taxi':
      return require('../assets/taxi.jpg');
    default:
      return null;
  }
};

const TransporteCard = ({ transporte }) => {
  const { nome_tpt, descricao_tpt, tarifa_tpt } = transporte;
  const imagemTransporte = getImagemTransporte(nome_tpt);

  return (
    <View style={styles.transporteCard}>
      <View style={styles.transporteHeader}>
        <Text style={styles.transporteName}>{nome_tpt}</Text>
      </View>
      <View style={styles.carouselContainer}>
        {imagemTransporte && <Image source={imagemTransporte} style={styles.image} />}
      </View>

      <Text style={styles.transporteDescription}>{descricao_tpt}</Text>

      {/* Título "Tarifa" abaixo do campo "descricao_tpt" */}
      <Text style={styles.transporteTarifaTitle}>Tarifas:</Text>
      <Text style={styles.transporteTarifa}>{tarifa_tpt}</Text>
    </View>
  );
};

const TransporteScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [transporteData, setTransporteData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Transporte',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#147DEB',
        height: 110,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchTransporteData = async () => {
      try {
        const collectionRef = firestore().collection('transporte'); // Nome da tabela
        const snapshot = await collectionRef.get();
        const transporte = snapshot.docs.map((doc) => doc.data());
        setTransporteData(transporte);
        setLoading(false);
        console.log(transporte);
      } catch (error) {
        console.log('Erro ao buscar dados do Firestore:', error);
      }
    };

    fetchTransporteData();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {transporteData.map((transporte, index) => (
          <View
            key={index}
            style={[
              styles.transporteWrapper,
              index === 0 ? { marginTop: 20 } : null // Adiciona uma margem superior para o primeiro elemento
            ]}
          >
            <TransporteCard transporte={transporte} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFFF',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  transporteWrapper: {
    marginBottom: 20,
  },
  transporteCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  transporteName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    
  },
  transporteDescription: {
    fontSize: 16,
    color: 'black', // Estilize o texto para preto
  },
  transporteTarifaTitle: {
    fontSize: 18,
    color: '#0D4BF2', // Estilize o texto para preto
    textAlign: 'center', // Centralize o texto
    fontWeight: 'bold', // Adicione negrito ao título
    marginTop: 10, // Adicione uma margem superior para separar do texto "descricao_tpt"
  },
  transporteTarifa: {
    fontSize: 16,
    color: 'black', //texto tarifa preto
    textAlign: 'center', // texto centralizado do tarifa
    marginBottom: 10, // margem inferior para separar do texto "descricao_tpt"
  },
  carouselContainer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default TransporteScreen;
