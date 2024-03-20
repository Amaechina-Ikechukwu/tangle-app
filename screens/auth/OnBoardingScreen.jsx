import React, { useState}  from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Block, Button, Text } from 'galio-framework';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons as an example
// Function to generate random angle
import RandomCircleImages from '../../components/RandomCircularImages'; // Path to your HeartContainer component

const { width, height } = Dimensions.get('window');
const RADIUS = 100;
const IMAGES = 10;

// Function to generate random angle
const randomAngle = () => Math.random() * 2 * Math.PI;

// Function to get coordinates based on angle
const getCoordinates = (angle) => {
  const x = RADIUS * Math.cos(angle) + width / 2 - 50;
  const y = RADIUS * Math.sin(angle) + height / 2 - 50;
  return { x, y };
};

// Pre-generate array of random positions
const imagePositions = [...Array(IMAGES)].map(() => {
  const angle = randomAngle();
  return getCoordinates(angle);
});

const centerImg = '../../assets/images/onboarding/face_1.jpg';


function OnboardingScreen({ navigation }){
   
    const [step, setStep] = useState(1);

    const handleButtonClick = () => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        alert('Completed all steps!');
      }
    };


    return (
      <> 
        { step === 1 && (
          <View style={styles.container}>
              {/* Container for two rounded images */}
              <View style={styles.imageContainer}>
  
                <View style={styles.imageRow}>
                 
                  <Button round style={styles.iconButton}>
                    <Icon name="musical-notes" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.buttonText}>Music</Text>
                  </Button>
                    
                    <View style={styles.imageFrame}>
                      <Image
                      source={require('../../assets/images/onboarding/face_1.jpg')} 
                        style={styles.roundedImage}
                      />
                         <View style={styles.captionContainer2}>
                              <Text style={styles.caption2}>You 👋</Text>
                              <View style={styles.arrowCutout2} />
                         </View>
                       
                    </View>
                </View>
                <View style={styles.imageRow}>
                    <View style={styles.imageFrame}>
                     
                      <Image source={require('../../assets/images/onboarding/face_3.jpg')} style={styles.roundedImage}/>

                      <View style={styles.captionContainer}>
                          <Text style={styles.caption}>Jessy 👋</Text>
                            <View style={styles.arrowCutout} />
                      </View>
                 
                    </View>
                    
                  <Button round style={styles.iconButton}>
                     <Icon name="game-controller-outline" size={24} color="#000" style={styles.icon} />
                      <Text style={styles.buttonText}>Video Game</Text>
                  </Button>
                </View>
          
              </View>
              <Block style={styles.textContainer}>
                  <Text style={styles.centeredText}>
                      Connect with those who truly spark your interest
                  </Text>

                  <Text style={styles.centeredParagraph}>
                    because every meaningful relationship starts with the right match.
                  </Text>
              </Block>
              <Block style={styles.buttonContainer}>
                  {/* <Button color="4B164C" style={styles.button} round shadowless>Continue</Button> */}
                  {/* <Button color="FF6347" style={styles.button} round shadowless >Sign in</Button> */}
                  <Button
                      round
                      shadowless
                      color="#4B164C"
                      onPress={handleButtonClick}
                      style={styles.button}>
                        <Text bold color="white">
                              Continue
                          </Text>
                  </Button>
                  <Button
                      shadowless
                      round
                      onPress={() => navigation.navigate('Login')}
                      on
                      color="#f62459"
                      style={styles.button}>
                          <Text bold color="white">
                                Sign in
                          </Text>
                  </Button>
              </Block>
          </View>
        )}

        { step === 2 && (
             <View style={styles.container}>
              {/* Container for two rounded images */}

            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  flexDirection: 'row', paddingTop: 40 }}>
                 
                  <Image
                    source={require('../../assets/images/leftheart.png')}
                    style={{ marginTop: 100}}
                  />
                      <View style={{backgroundColor: '#FF355E', paddingHorizontal: 10, paddingVertical: 10, borderRadius:20, position: 'absolute', left: 100, top: 70 }}>
                          <Text style={styles.caption}>100% Match</Text>
                      </View>
                  <Image
                    source={require('../../assets/images/rightheart.png')}
                    style={{ }}
                  />

            </View>

        

             <Block style={styles.textContainer}>
                 <Text style={styles.centeredText}>
                 Discover your ideal match by aligning with your unique preferences
                 </Text>

                 <Text style={styles.centeredParagraph}>
                      Where every connection is a step toward the perfect partnership.
                 </Text>
             </Block>
             <Block style={styles.buttonContainer}>
                 {/* <Button color="4B164C" style={styles.button} round shadowless>Continue</Button> */}
                 {/* <Button color="FF6347" style={styles.button} round shadowless >Sign in</Button> */}
                 <Button
                     round
                     shadowless
                     color="#4B164C"
                     onPress={handleButtonClick}
                     style={styles.button}>
                      <Text bold color="white">
                             Continue
                         </Text>
                 </Button>
                 <Button
                     shadowless
                     round
                     onPress={() => navigation.navigate('Login')}
                     color="#f62459"
                     style={styles.button}>
                         <Text bold color="white">
                               Sign in
                         </Text>
                 </Button>
             </Block>
             </View>
        )}

       { step === 3 && (
          <View style={styles.container}>
             {/* Container for two rounded images */}

             <RandomCircleImages centerImage={centerImg} />

             <Block style={styles.textContainer}>
                 <Text style={styles.centeredText}>
                    Explore meaningful connections in your area
                 </Text>

                 <Text style={styles.centeredParagraph}>
                     Where new faces become familiar friends
                 </Text>
             </Block>
            
             <Block style={styles.buttonContainer}>
                 {/* <Button color="4B164C" style={styles.button} round shadowless>Continue</Button> */}
                 <Button
                     round
                     shadowless
                     color="#f62459"
                     style={styles.button}>
                        <Icon name="call" size={24} color="#fff" style={styles.icon} />
                        <Text bold color="white">
                             Login with Phone
                         </Text>
                 </Button>

                 <Button
                     round
                     onPress={() => navigation.navigate('Login')}
                     shadowless
                     color="#f62459"
                     style={styles.button}>
                        <Icon name="mail" size={24} color="#fff" style={styles.icon} />                        
                        <Text bold color="white">
                             Login with Email
                         </Text>
                 </Button>
                 <Button
                     shadowless
                     round
                     color="#ececec"
                     style={styles.button}>
                       <Icon name="logo-google" size={24}    color="#f62459" style={styles.icon} />
                         <Text bold >
                             Login with Google
                         </Text>
                 </Button>

              
             </Block>

             <View style={styles.buttonContainer}>
                  <Text p style={styles.centeredParagraph}>
                      Dont have an account? <Text color="red" onPress={() => navigation.navigate('Registration')}>Sign up</Text>
                  </Text>
             </View>
         </View>

        )}
      </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    
    stepContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    imageAbsuloteFrame:{
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'grey',
      borderRadius: 52,
      width: 20,
      height: 20,
    },

    textContainer: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
      marginTop: 20,
    },
    imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 20,
      alignItems: 'center',
    },
    imageFrame: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      // borderWidth: 5,  // Thick border
      // borderColor: '#FF6347',  // Primaru color
      // borderRadius: 54,  // Half of the width + border
    },

    btnFrame: {
      justifyContent: 'center',
      alignItems: 'center',
   
    },

    roundedImage: {
       borderWidth: 5,  // Thick border
      borderColor: '#FF6347',  // Primaru color
      borderRadius: 54,  // Half of the width + border
      width: 100,
      height: 100,
      borderRadius: 50, // Half of width and height
    },
      centeredText: {
        textAlign: 'center',
        fontSize: 26,
      },

      centeredParagraph: {
        textAlign: 'center',
        fontSize: 16,
      }, 

      iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1, 
        borderColor: 'red', // Black border color
        backgroundColor: '#fff', // White background color
        borderRadius: 50,
      },
      buttonText: {
        fontSize: 16,
        color: '#000',
      },
      icon: {
               marginRight: 15, 
      },
    buttonContainer: {
      marginBottom: 10,
      marginLeft: 20,
      marginRight: 20,
    },
    button: {
      width: '100%', // Full-width
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    captionContainer: {
      alignItems: 'center',
      backgroundColor: '#FF355E',  // Updated to Radical Red
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    captionContainer2: {
      alignItems: 'center',
      backgroundColor: '#ececec',  // Updated to Radical Red
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    
    caption: {
      fontSize: 12,
      color: '#FFF',  // Changed to white for better contrast against Radical Red
      textAlign: 'center',
      zIndex: 1,
    },

    caption2: {
      fontSize: 12,
      color: '#000',  // Changed to white for better contrast against Radical Red
      textAlign: 'center',
      zIndex: 1,
    },

    arrowCutout: {
      position: 'absolute', // Use absolute positioning to place the arrow cutout
      top: -5, // Position the arrow cutout just above the caption box
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: 5, // Half the width of the arrow cutout
      borderBottomWidth: 5, // Half the width of the arrow cutout
      borderLeftWidth: 5, // Half the width of the arrow cutout
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#FF355E',  // Same color as caption background
      borderLeftColor: 'transparent',
    },

    arrowCutout2: {
      position: 'absolute', // Use absolute positioning to place the arrow cutout
      top: -5, // Position the arrow cutout just above the caption box
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: 5, // Half the width of the arrow cutout
      borderBottomWidth: 5, // Half the width of the arrow cutout
      borderLeftWidth: 5, // Half the width of the arrow cutout
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#ececec',  // Same color as caption background
      borderLeftColor: 'transparent',
    },

    heartContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', // Center vertically within the row
    },
    heartImage: {
      marginTop: 150,
      width: 100, // Adjust image width as needed
      height: 100, // Adjust image height as needed
      marginHorizontal: 10, // Adjust spacing between imagesust spacing between images
    },
  });
  
export default OnboardingScreen;