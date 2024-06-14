import { View, StyleSheet, Text} from 'react-native'

const ProgressBar = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;
  
    return (
      <View style={styles.progressBarContainer}>
        <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
   
    progressBarContainer: {
      height: 5,
      width: '100%',
      backgroundColor: 'lightgray',
      borderRadius: 5,
      marginTop: 20,
    },

    progressBar: {
      height: '100%',
      backgroundColor: 'tomato',
      borderRadius: 5,
    },

    stepText: {
        position: 'absolute',
        top: -20,  // Position text above the progress bar
        left: 0,
        color: 'black',
        fontWeight: 'bold',
    },

  });
  
  export default ProgressBar