import { StyleSheet, Text, View ,TextInput,Image,FlatList} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {AntDesign,MaterialCommunityIcons} from 'react-native-vector-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator,listAll} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';

const MenuDetails = ({route,navigation}) => {

    const [imageUrl,setUrl] = useState([])
    const { name, menuDetails, freeDelivery } = route.params;
    const [selectedSize,setSelectedSize] = useState('M')
    const [newPrice,setNewPrice] = useState(menuDetails.price)
    const [user,setUser] = useState(null)

    useEffect(() => {
      const userCollection = collection(db, 'user')
  
      const unsubscribe1 = onSnapshot(userCollection, (snapshot) => {
        const userData = snapshot.docs.map((doc) => doc.data());
        console.log('USERDATA: ', userData);
        if (userData[0].signedin == true){
          setUser(userData[0].name);
        }
        userData.forEach((x)=>{
          if (x.signedin == true){
            setUser(x.name);
          }
        })

        console.log(user)
      })
    }, [])



useEffect(() => {
  if (selectedSize === 'L') {
    setNewPrice(Number(menuDetails.price) + 3);
  } else if (selectedSize === 'S') {
    setNewPrice(Number(menuDetails.price) - 3);
  }else{
    setNewPrice(Number(menuDetails.price));
  }

  
}, [selectedSize, menuDetails.price]);


  return (
    <ScrollView>
      <View><Text></Text></View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                key={1}
                source={{ uri: menuDetails.image }}
                style={{ width: wp(65), height: wp(50),borderRadius:wp(3),marginBottom:wp(7),marginTop:wp(8) }}
                />

        </View>

        <View><Text></Text></View>
     <View>
     <Text style={{ fontWeight: 'bold', fontSize: wp(5), paddingLeft: wp(4.5) }}>
        {menuDetails.menu}
      </Text>
      </View>
      <View/>
      <View
        style={{
          borderWidth: wp(0.1),
          borderColor:'black',
          margin:wp(3),
     }}
      />

      <View>
     
        <Text style={{ fontWeight: 'bold', fontSize: wp(3.5), paddingLeft: wp(4.5) }}>Description</Text>
        <Text></Text>
        <Text style={{ fontSize: wp(3.5), paddingLeft: 20,paddingRight:wp(4.5) }}>
          {menuDetails.desc}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, selectedSize === 'S' && styles.selectedButton]}
        onPress={() => setSelectedSize('S')}
      >
        <Text style={[styles.SizeButtonText, selectedSize === 'S' && styles.selectedButtonText]}>S</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedSize === 'M' && styles.selectedButton]}
        onPress={() => setSelectedSize('M')}
      >
        <Text style={[styles.SizeButtonText, selectedSize === 'M' && styles.selectedButtonText]}>M</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedSize === 'L' && styles.selectedButton]}
        onPress={() => setSelectedSize('L')}
      >
        <Text style={[styles.SizeButtonText, selectedSize === 'L' && styles.selectedButtonText]}>L</Text>
      </TouchableOpacity>
    </View>

        <View style={styles.priceContainer}>

      <View style={styles.leftContainer}>
        <Text style={styles.heading}>Price</Text>
        <Text style={styles.price}>{newPrice + ' QR'}</Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.buyButton} onPress={()=> navigation.navigate("Cart",{resName:name,item:menuDetails.menu,price:newPrice,image:menuDetails.image,user:user})}>
          <Text style={styles.buttonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  )
}

export default MenuDetails

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1, 
    borderBottomColor: 'black', 
    marginVertical: wp(5), 
  },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: wp(10),
        marginBottom:wp(5)
      },
      button: {
        backgroundColor: '#ffe5bf', 
        width: wp(16),
        height:wp(12),
        borderRadius: wp(1.5),
        alignItems: 'center', 
        justifyContent: 'center',
        borderColor: '#e28743',
        borderWidth: wp(0.5), 
        
      },
      SizeButtonText: {
        color: '#e28743', 
        fontSize: wp(4.5),
        fontWeight: 'bold',
      },

      priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        marginTop: wp(5),
      },

      heading: {
        fontSize: wp(4),
        color: '#a9a9a9',
      },
      price: {
        fontSize: wp(4.5),
        color: '#e28743',
        fontWeight: 'bold',
      },
      buyButton: {
        backgroundColor: '#e28743',
        paddingVertical: wp(3),
        paddingHorizontal: wp(3),
        borderRadius: wp(1),
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },

      selectedButton: {
        backgroundColor: '#e28743', 
        fontWeight: 'bold', 
      },
      selectedButtonText:{
        color: 'white',
      }

})