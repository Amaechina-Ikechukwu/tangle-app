// Define the base URL for your API
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Replace with your API URL

// Define the function to fetch data with a bearer token using fetch
export const GeneralPatch = async (endpoint, token, requestBody) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // Add any other headers if needed
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    // Handle error appropriately, e.g., logging or throwing
    console.error("Error fetching data:", error);
    throw error;
  }
};
