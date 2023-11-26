import { StyleSheet, Text, View } from 'react-native'

import React,{useEffect, useState} from 'react'
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc,query,where} from "firebase/firestore";
import { db,auth,storage } from './Config'
const OrderHistory = () => {
  const [user,setUser] = useState(null)
  const [cartHistoryFetched, setCartHistoryFetched] = useState([]);
  useEffect(() => {
    const userCollection = collection(db, 'user');

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

      // cart history fetch

      const collectionRef = collection(db, 'CartHistory');
    
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        console.log('test')
        const newData = snapshot.docs.map((doc) => doc.data());
        setCartHistoryFetched(newData);
        console.log('CART History :', cartHistoryFetched);
      });

      return () => {
        unsubscribe1();
        unsubscribe(); 
        
      };

  }, []);
  return (
    <View>
      <Text>{user}</Text>
    </View>
  )
}

export default OrderHistory

const styles = StyleSheet.create({})