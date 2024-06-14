const LocationSettingScreen = () => {
    const [distance, setDistance] = useState(10); // Default distance
    const locations = [
      { id: '1', name: 'Location 1' },
      { id: '2', name: 'Location 2' },
      // Add more locations as needed
    ];
  
    const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.distance}>{distance} m</Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <FlatList
          data={locations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={distance}
          onValueChange={setDistance}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 22,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 24,
    },
    distance: {
      fontSize: 20,
    },
    slider: {
      margin: 20,
    },
  });
  
  export default LocationSettingScreen;
  