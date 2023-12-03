import { StyleSheet, Text, View } from 'react-native'

import React,{useEffect, useState} from 'react';
const Logout = () => {
    useEffect((navigation)=>{
        
      auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    })
  return (
    <View>
      <Text>Logout</Text>
    </View>
  )
}

export default Logout

const styles = StyleSheet.create({})