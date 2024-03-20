import AsyncStorage from "@react-native-async-storage/async-storage";

export const SetLocalData = async ({ key, value }) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
};
export const GetLocalData = async ({ key }) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      // Data not found
      console.log("No data found for key:", key);
      return null;
    }
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
};
export const ClearAllLocalData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All local data cleared successfully.");
  } catch (error) {
    console.error("Error clearing local data:", error);
  }
};
