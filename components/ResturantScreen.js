import { StyleSheet, Text, View,SafeAreaView } from 'react-native'
import React, { useEffect,useState } from 'react'
import { Card } from '@rneui/themed';
import {Ionicons } from 'react-native-vector-icons'
import { CardTitle } from '@rneui/base/dist/Card/Card.Title';

import {AntDesign,MaterialCommunityIcons,EvilIcons} from 'react-native-vector-icons'

const ResturantScreen = ({navigation,route}) => {
  const [menu,setMenu] = useState([])
  useEffect(()=> {
    navigation.setOptions(
      {
          headerLeft: () => <EvilIcons name='arrow-left'
              size={35} onPress={() => navigation.popToTop()} />
      })
},[])
  return (
   <SafeAreaView style={styles.container}>
     <Card width={"90%"}>
         
    <Card.Divider/>
    <View style={{alignItems:'center'}}>
      <Text style={{color:'red',fontSize:20,fontWeight:'bold'}}>{route.params.name}</Text>
    </View>
    <View><Text></Text></View>
    {route.params.menu.map((x,i)=> {
                        return(
                          <View key={i}>
                            <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
                            <Text style={styles.out}>{x.menu}</Text>
                            <Card.Divider/>
                            <Card.Divider/>
                            <Text style={styles.out}>{x.price}</Text>
                            </View>
                            <View><Card.Divider /></View>
                          </View>
                        )

    })}

    </Card>
   
   </SafeAreaView>
  )
}

export default ResturantScreen

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center'
  },
  out:{
    fontSize:18,
    shadowColor:'blue',
    shadowRadius:6,
    shadowOpacity:10,
 
}
})