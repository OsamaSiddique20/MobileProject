import { StyleSheet, Text, View,Animated  } from 'react-native'
import React,{useEffect, useState,useRef} from 'react'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons,MaterialIcons,Fontisto} from 'react-native-vector-icons'
import AnimatedLoader from 'react-native-animated-loader';
const Delivery = () => {

    const anim = useRef(new Animated.Value(1));

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim.current, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true, // Set useNativeDriver to true for the first animation
            }),
            Animated.timing(anim.current, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true, // Set useNativeDriver to true for the second animation
            }),
          ])
        ).start();
      }, []);
 
  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.text}>Your order is being prepared</Text>
        </View>
        <View>
            <Animated.View style={{ transform: [{ scale: anim.current }],marginTop:40 }}>
            <MaterialCommunityIcons name="chef-hat" size={30} color={"#e28743"} />
            </Animated.View>
        </View>
        <View style={styles.container2}>
  
                <View style={styles.leftColumn}>
                    <MaterialIcons name="delivery-dining" size={50} color={"#e28743"} />
                </View>

                <View style={styles.rightColumn}>
                    <Text style={styles.heading}>Delivering your order</Text>
                    <Text style={styles.paragraph}>
                    We deliver your goods to you in the shortest time possible
                    </Text>
                </View>
          
        </View>

        <View style={styles.container3}>

            <View style={styles.leftColumn}>
                <Fontisto name="person" size={40} color={"#e28743"}/>
            </View>

            <View style={styles.middleColumn}>
                <Text style={styles.heading}>Ali</Text>
                <Text style={styles.subHeading}>Delivery Driver</Text>
            </View>

       
            <View style={styles.rightColumn}>
                <FontAwesome name="phone" size={40} color={"#e28743"} />
            </View>
        </View>
    </View>
  )
}

export default Delivery

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
       
        padding: 8,
      },
      text:{
        marginTop:70,
        fontSize: 20,
        fontWeight: 'bold',
      },
      // deliver 
      container2: {
        flexDirection: 'row', 
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', 
        padding: 16,
        backgroundColor: '#fffce6',
        width:'95%',
        marginTop:100,
        borderRadius:15
      },
      leftColumn: {
        marginRight: 16,
      },
 
      heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      paragraph: {
        fontSize: 16,
        color: '#333',
      },
      // last element 
      container3: {
        flexDirection: 'row', 
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', 
        padding: 16,
        backgroundColor: '#f7f4dc',
        width:'95%',
        marginTop:100,
        marginBottom:100,
        borderRadius:15
      },
      leftColumn: {
        marginRight: 16,
      },
      middleColumn: {
        flex: 1,
        marginLeft:30
      },
      rightColumn: {
        marginLeft: 16,
      },
      heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      subHeading: {
        fontSize: 16,
        color: '#333',
      },
})