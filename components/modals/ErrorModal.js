import React from 'react'
import { Button, Text, View } from 'react-native'

const ErrorModal = ({ modal: { closeModal }}) => (
    <View>
      <Text>Your message was sent!</Text>
      <Button onPress={closeModal} title="OK" />
    </View>
)
  

export default ErrorModal