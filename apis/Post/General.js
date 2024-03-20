// Define the base URL for your API
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Replace with your API URL

// Define the function to send a POST request with a bearer token using fetch
export const GeneralPost = async (
  endpoint,
  token,
  requestBody // Adjust the type of requestBody according to your payload structure
) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Add any other headers if needed
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
