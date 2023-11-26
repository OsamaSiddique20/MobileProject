import { StyleSheet, Text, View ,TextInput,Image,FlatList} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';

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
    <View>
      <View><Text></Text></View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>

                <Image
                key={1}
                source={{ uri: menuDetails.image }}
                style={{ width: 300, height: 250 ,borderRadius: 20 }}
                />

        </View>

        <View><Text></Text></View>
     <View>
     <Text style={{ fontWeight: 'bold', fontSize: 20, paddingLeft: 20 }}>
        {menuDetails.menu}
      </Text>
      </View>
      <View/>
      <View
        style={{
          borderWidth: 0.5,
          borderColor:'black',
          margin:10,
     }}
      />

      <View>
     
        <Text style={{ fontWeight: 'bold', fontSize: 15, paddingLeft: 20 }}>Description</Text>
        <Text></Text>
        <Text style={{ fontSize: 15, paddingLeft: 20,paddingRight:20 }}>
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
    </View>
  )
}

export default MenuDetails

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1, // Adjust the thickness of the line
    borderBottomColor: 'black', // Adjust the color of the line
    marginVertical: 10, // Adjust the spacing above and below the line
  },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 20,
      },
      button: {
        backgroundColor: '#ffe5bf', 
        width: 60,
        height:50,
        borderRadius: 5,
        alignItems: 'center', 
        justifyContent: 'center',
        borderColor: '#e28743',
        borderWidth: 2, 
        
      },
      SizeButtonText: {
        color: '#e28743', 
        fontSize: 16,
        fontWeight: 'bold',
      },

      priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
      },
    //   leftContainer: {
    //     flex: 1,
    //     marginRight: 10,
    //   },
    //   rightContainer: {
    //     flex: 1,
    //     marginLeft: 10,
    //   },
      heading: {
        fontSize: 16,
        color: '#a9a9a9',
      },
      price: {
        fontSize: 18,
        color: '#e28743',
        fontWeight: 'bold',
      },
      buyButton: {
        backgroundColor: '#e28743',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
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