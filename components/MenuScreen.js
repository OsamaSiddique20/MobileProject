import { StyleSheet, Text, View ,TextInput,Image} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {AntDesign,MaterialCommunityIcons} from 'react-native-vector-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator,listAll} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
const MenuScreen = ({route,navigation}) => {
    const [fetchedData,setFetchedData] = useState([])
    const [imageUrl,setUrl] = useState([])
    useEffect(()=>
    {

            const collectionRef = collection(db, 'project')

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                const newData = snapshot.docs.map((doc) => doc.data());
                console.log('From DB\t', newData);
                setFetchedData(newData);
            });     
            
            const storageRef = ref(storage, 'gs://test-3df00.appspot.com');

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
                      console.error('Error getting image URL:', error);
                    });
                });
              })
              .catch((error) => {
                console.error('Error listing images:', error);
              });
            
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
  };

  // Limit to 2 rows
  const limitedData = chunkArray(route.params.menu, 2);
  return (
    <View>
        {/* <Text>{route.params.menu[0].price}</Text> */}
     <ScrollView>

{limitedData.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>

            <Text>{row.price}</Text>
          {/* {row.map((data, colIndex) => (
            
            <Card key={colIndex} containerStyle={{ borderRadius: 10, overflow: 'hidden', width: '40%' }}>
              {imageUrl
                .filter((url) => url.includes(data.name + '-'+row.name))
                .map((filteredUrl, imageIndex) => (
                  <TouchableOpacity  onPress={()=> navigation.navigate("MenuScreen",{name:data.name,menu:data.menu})}>
                  <Image
                    key={imageIndex}
                    source={{ uri: filteredUrl }}
                    style={{ width: 120, height: 100 }}
                  />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={()=> navigation.navigate("MenuScreen",{name:data.name,menu:data.menu})}>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                    {data.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          ))} */}
        </View>
      ))}
      </ScrollView>
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({})