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
            })
            
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


  const limitedData = chunkArray(route.params.menu, 2)

  const renderItem = ({ item: row, index: rowIndex }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>{row.price}</Text>
      <FlatList
        data={row}
        keyExtractor={(item, colIndex) => colIndex.toString()}
        numColumns={2} 
        renderItem={({ item: data, index: colIndex }) => (
          <Card containerStyle={{ borderRadius: 10, overflow: 'hidden', width: '40%' }}>
              <View style={{ padding: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("MenuScreen", { name: data.name, menu: data.menu })}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                  {data.name}
                </Text>
                </TouchableOpacity>
              </View>

          </Card>
        )}
      />
    </View>
  );
  return (
    <View>
        {/* <Text>{route.params.menu[0].price}</Text> */}


     <FlatList
      data={limitedData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
 
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({})