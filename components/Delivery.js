import { StyleSheet, Text, View,Animated  } from 'react-native'
import React,{useEffect, useState,useRef} from 'react'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons,MaterialIcons,Fontisto} from 'react-native-vector-icons'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Delivery = () => {

    const anim = useRef(new Animated.Value(1));

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim.current, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true, 
            }),
            Animated.timing(anim.current, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true, 
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
            <Animated.View style={{ transform: [{ scale: anim.current }],marginTop:wp(20) }}>
            <MaterialCommunityIcons name="chef-hat" size={wp(10)} color={"#e28743"} />
            </Animated.View>
        </View>
        <View style={styles.container2}>
  
                <View style={styles.leftColumn}>
                    <MaterialIcons name="delivery-dining" size={wp(12)} color={"#e28743"} />
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
                <Fontisto name="person" size={wp(10)} color={"#e28743"}/>
            </View>

            <View style={styles.middleColumn}>
                <Text style={styles.heading}>Ali</Text>
                <Text style={styles.subHeading}>Delivery Driver</Text>
            </View>

       
            <View style={styles.rightColumn}>
                <FontAwesome name="phone" size={wp(10)} color={"#e28743"} />
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
        padding: wp(5),
      },
      text:{
        marginTop:wp(20),
        fontSize: wp(6.5),
        fontWeight: 'bold',
      },
      // deliver 
      container2: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: wp(4),
        backgroundColor: '#fffce6',
        width:wp(86),
        marginTop:wp(25),
        borderRadius:wp(4)
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
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: wp(4),
        backgroundColor: '#fffce6',
        width:wp(86),
        marginTop:wp(25),
        borderRadius:wp(4)
      },
      leftColumn: {
        marginRight: wp(6),
      },
      middleColumn: {
        flex: 1,
        marginLeft:wp(5)
      },
      rightColumn: {
        marginLeft: wp(5),
      },
      heading: {
        fontSize: wp(4),
        fontWeight: 'bold',
        marginBottom: wp(4),
      },
      subHeading: {
        fontSize: wp(4),
        color: '#333',
      },
})