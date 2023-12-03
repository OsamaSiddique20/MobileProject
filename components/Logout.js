import { StyleSheet, Text, View } from 'react-native'

import React,{useEffect, useState} from 'react';
const Logout = () => {
    useEffect((navigation)=>{
        navigation.navigate('LoginScreen')
    })
  return (
    <View>
      <Text>Logout</Text>
    </View>
  )
}

export default Logout

const styles = StyleSheet.create({})