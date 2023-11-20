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
const Cart = ({route,navigation}) => {

    const { resName, item, price } = route.params;
    const [count, setCount] = useState(0);
    const [imageUrl,setUrl] = useState([])
    const [toggle,setToggle] = useState(true)

    useEffect(()=>
    {
            const storageRef = ref(storage, 'gs://test-3df00.appspot.com')

            listAll(storageRef)
              .then((result) => {
                const uniqueUrls = new Set(imageUrl)
            
                result.items.forEach((itemRef) => {
                  let x = ref(storage, itemRef.name);
            
                  getDownloadURL(x)
                    .then((url) => {
              
                      uniqueUrls.add(url);

                      setUrl([...uniqueUrls]);
                    })
                    .catch((error) => {
                      console.error('Error getting image URL:', error)
                    })
                })
              })
              .catch((error) => {
                console.error('Error listing images:', error)
              })

},[])
  return (
    <View>
            <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, toggle == true && styles.selectedButton]}
        onPress={() => setToggle(true)}
      >
        <Text style={[styles.SizeButtonText, toggle == true && styles.selectedButtonText]}>Deliver</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button,  toggle == false && styles.selectedButton]}
        onPress={() => setToggle(false)}
      >
        <Text style={[styles.SizeButtonText, toggle == false  && styles.selectedButtonText]}>Order</Text>
      </TouchableOpacity>
      </View>

    
      <View style={styles.row}>
      {imageUrl
            .filter((url) => url.includes(resName+ '-menu-'+item))
            .map((filteredUrl, imageIndex) => (
            <Image
            key={imageIndex}
            source={{ uri: filteredUrl }}
            style={styles.image}
            />
        ))}

      <Text style={styles.text}>{item}</Text>

      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={() => count > 1 && setCount(count - 1)}>
          <Text style={styles.counterButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{count}</Text>
        <TouchableOpacity onPress={()=>setCount(count + 1)}>
          <Text style={styles.counterButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>

    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 20,
      },
    selectedButton: {
        backgroundColor: '#e28743', 
        fontWeight: 'bold', 
      },
      selectedButtonText:{
        color: 'white',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      button: {
        backgroundColor: '#ffe5bf', 
        width: 100,
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
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      counterButton: {
        fontSize: 20,
        paddingHorizontal: 10,
        color: '#007BFF', 
        backgroundColor: '#ffe5bf',  
        borderWidth: 0.5, 
        borderColor: '#e28743',
        borderRadius: 5,
        margin:10
      },
      text: {
        flex: 1, 
        fontSize: 16,
      },
      image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 60,
      },
      counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },

})