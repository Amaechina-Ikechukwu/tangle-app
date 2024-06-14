// signup.js
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "username",
    name: "Lionel Francis",
    email: "lionelishmale@gmail",
    age: 20,
    gender: "male",
    interests: [],
    bio: "this is a bio",
    password: "password",
    confirmPassword: "password",
    images: [],
  });

  const handleSubmit = async () => {
    try {
      // console.log(response)
      // setIsLoading(false);
      // setStep(step + 1);
    } catch (error) {
      console.error("Registration error:", error);

      // setIsLoading(false);
    }
  };

  return (
    <>
      <Text>Test is Signup Screen</Text>
      {/* Progress Bar and Step Text at the Bottom */}
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Click</Text>
      </TouchableOpacity>
    </>
  );
};

export default Signup;
