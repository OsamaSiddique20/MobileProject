import { StyleSheet, Text, View ,TextInput,Image,FlatList} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {AntDesign,MaterialCommunityIcons} from 'react-native-vector-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator,listAll} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
const MenuScreen = ({route,navigation}) => {
    const [fetchedData,setFetchedData] = useState([])
    const [imageUrl,setUrl] = useState([])
    const { menus, freeDelivery, resName } = route.params;
    console.log("PARAMS: ",route.params)
    useEffect(()=>
    {
            const collectionRef = collection(db, 'project')
            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                const newData = snapshot.docs.map((doc) => doc.data());
                console.log('From DB\t', newData);
                setFetchedData(newData);
            })
            
            // const storageRef = ref(storage, 'gs://test-3df00.appspot.com')

            // listAll(storageRef)
            //   .then((result) => {
            //     const uniqueUrls = new Set(imageUrl)
            
            //     result.items.forEach((itemRef) => {
            //       let x = ref(storage, itemRef.name);
            
            //       getDownloadURL(x)
            //         .then((url) => {
              
            //           uniqueUrls.add(url);

            //           setUrl([...uniqueUrls]);
            //         })
            //         .catch((error) => {
            //           console.error('Error getting image URL:', error)
            //         })
            //     })
            //   })
            //   .catch((error) => {
            //     console.error('Error listing images:', error)
            //   })
            
            return () => {
                unsubscribe();
            }
},[]
)

const chunkArray = (array, size) => {
    return array.reduce((acc, _, index) => {
      if (index % size === 0) {
        acc.push(array.slice(index, index + size));
      }

      return acc;
    }, []);
  }


  const limitedData = chunkArray(menus, 2)


  console.log(limitedData)
  return (
    <View>
<ScrollView>

{limitedData.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: wp(2) }}>
          {row.map((data, colIndex) => (
            
            <Card key={colIndex} containerStyle={{ borderRadius: 10, overflow: 'hidden', width: wp(40),height:wp(44) }}>

                  <TouchableOpacity  onPress={()=> navigation.navigate("MenuDetails",{name:resName,menuDetails:data,freeDelivery:freeDelivery})}>
                  <Image
                    key={colIndex}
                    source={{ uri: data.image }}
                    style={{ width: wp(33), height: wp(25),borderRadius:wp(1) }}
                  />
                  </TouchableOpacity>
   
              
              <TouchableOpacity  onPress={()=> navigation.navigate("MenuDetails",{name:resName,menuDetails:data,freeDelivery:freeDelivery})}>
                <View style={{ padding: wp(2) }}>
                  <Text style={{ fontSize: wp(4), fontWeight: 'bold', textAlign: 'center' }}>
                    {data.menu}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      ))}
      </ScrollView>
 
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({})