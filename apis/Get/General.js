// Define the base URL for your API
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Replace with your API URL

// Define the function to fetch data with a bearer token using fetch
export const GeneralGet = async (endpoint, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Add any other headers if needed
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
