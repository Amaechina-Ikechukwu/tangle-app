import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Step7 = ({ bio, setBio, nextStep, prevStep, step }) => {


   // Calculate progress
   const totalSteps = 9; // Total number of steps
   const progress = (step / totalSteps) * 100;
  return (
    <View style={styles.container}>
        <Image
        source={require('../../../assets/images/register/07.png')} // Replace with your image URL or local image path
        style={styles.inputImage}
      />
      <Text style={styles.title}>Tell us about yourself</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Write a short bio"
          multiline
          style={styles.input}/>
      </View>
  

      <TouchableOpacity style={styles.backButton} onPress={prevStep}>
        <Icon name="arrow-left" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
          <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FF355E',
    borderWidth: 2,
    marginRight: 10,
  },
  filledStepIndicator: {
    backgroundColor: '#FF355E',
  },
  stepText: {
    color: '#FF355E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#FF355E',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF355E',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 3,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF355E',
    borderRadius: 5,
  },
});

export default Step7;
