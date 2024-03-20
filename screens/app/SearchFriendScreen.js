import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import Swiper from 'react-native-deck-swiper';

const SearchFriendsScreen = () => {

  
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },

    card: {
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    cardImage: {
      width: '100%',
      height: 300,
    },
    cardName: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    textContainer: {
      textAlign: 'center',
      alignItems: 'center',
    },

    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    locationText: {
        color: '#ececec',
        fontSize: 16,
        fontWeight: 'bold',
    },

    overlayContent: {
        flexDirection: 'row', // Sets the children to be side-by-side
        alignItems: 'center', // Centers the content vertically
        position: 'absolute',
        bottom: 100,
        left: 90,
        padding: 10,
        borderRadius: 5,
      },

      button: {
        width: 80,
        height: 80,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },

      btnColorDefault: {
        backgroundColor: 'lightgrey',
      },

      btnColorPrimary: {
        backgroundColor: '#f62459',
      },

      btnColorSecoundary: {
        backgroundColor: '#000',
      },

      buttonContainer: {
        
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }
});

export default SearchFriendsScreen;