import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import firestore from "@react-native-firebase/firestore";

const PontoTuristicoImages = {
  'Eiffel Tower Viewing Deck': [
    require('../assets/torre1.png'),
    require('../assets/torre2.png'),
    require('../assets/torre3.png'),
  ],
  'Big Bus Tours Las Vegas': [
    require('../assets/onibus1.png'),
    require('../assets/onibus2.png'),
    require('../assets/onibus3.png'),
  ],
  'Ballagio': [
    require('../assets/balagio1.png'),
    require('../assets/balagio2.png'),
    require('../assets/ballagio3.png'),
  ],
  'High Roller': [
    require('../assets/roda1.png'),
    require('../assets/roda2.png'),
    require('../assets/roda3.png'),
  ],
  'Helicopeter Tours Las Vegas': [
    require('../assets/ptaviao1.png'),
    require('../assets/ptaviao2.png'),
    require('../assets/ptaviao3.png'),
  ],
  'Caesars Palace': [
    require('../assets/palace1.png'),
    require('../assets/palace2.png'),
    require('../assets/palace3.png'),
  ],
};

const PontoTuristicoCard = ({ pontoTuristico }) => {
  const { nome_ptur, localizacao_ptur, descricao_ptur } = pontoTuristico; // Nome dos campos
  const imagens = PontoTuristicoImages[nome_ptur] || []; // Obtém as imagens do ponto turístico com base no nome
  const rating = pontoTuristico.rating || 4.5; // Valor padrão para a classificação

  const renderStars = (count, filled) => {
    const starIconName = filled ? 'star' : 'star-border';

    return Array(count).fill().map((_, index) => (
      <MaterialIcons
        key={index}
        name={starIconName}
        size={20}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.pontoTuristicoCard}>
      <View style={styles.pontoTuristicoHeader}>
        <Text style={styles.pontoTuristicoName}>{nome_ptur}</Text>
      </View>
      <View style={styles.carouselContainer}>
        <Swiper autoplay={true} height={150}>
          {imagens.map((imagem, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={imagem}
                style={styles.image}
              />
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.starsContainer}>
        {renderStars(Math.floor(rating), true)}
        {rating % 1 !== 0 && <MaterialIcons name="star-half" size={20} color="#FFD700" />}
        {renderStars(5 - Math.ceil(rating), false)}
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <MaterialIcons name="location-on" size={16} color="#147DEB" style={styles.locationIcon} />
        </View>
        <Text style={styles.pontoTuristicoLocation}>{localizacao_ptur}</Text>
      </View>
      <Text style={styles.pontoTuristicoDescription}>{descricao_ptur}</Text>
    </View>
  );
};
const PontoTuristicoScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [pontosTuristicosData, setPontosTuristicosData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Pontos Turisticos',
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
    const fetchPontosTuristicosData = async () => {
      try {
        const collectionRef = firestore().collection('pontos_turisticos'); // Nome da tabela
        const snapshot = await collectionRef.get();
        const pontosTuristicos = snapshot.docs.map((doc) => doc.data());
        setPontosTuristicosData(pontosTuristicos);
        setLoading(false);
        console.log(pontosTuristicos);
      } catch (error) {
        console.log('Erro ao buscar dados do Firestore:', error);
      }
    };

    fetchPontosTuristicosData();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {pontosTuristicosData.map((pontoTuristico, index) => (
          <View key={index} style={styles.pontoTuristicoWrapper}>
            <PontoTuristicoCard pontoTuristico={pontoTuristico} />
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
  pontoTuristicoWrapper: {
    marginBottom: 20,
  },
  pontoTuristicoCard: {
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
  pontoTuristicoName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  pontoTuristicoLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pontoTuristicoDescription: {
    fontSize: 16,
    color: '#333',
  },
  carouselContainer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIconContainer: {
    marginRight: 4,
  },
});

export default PontoTuristicoScreen;
