import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {  RootStackParamList } from '../types/navigation'

/*
Props type for this screen
NativeStackScreenProps gives:
navigation
route
*/
type Props = NativeStackScreenProps<
  RootStackParamList,'DetailsShowScreen'> 

const DetailsShowScreen: React.FC<Props> = ({ route }) => {

  /*
  route.params contains the data
  that we passed from HomeScreen
  */
  const { user } = route.params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>

      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  )
}

export default DetailsShowScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    fontSize:22,
    fontWeight:'bold',
    marginBottom:20
  }
})