import { StyleSheet, Text, View ,  NativeModules,Animated,
} from 'react-native'
import React,{useEffect, useState,useRef} from 'react'
import { FontAwesome ,SimpleLineIcons,Feather,AntDesign} from "react-native-vector-icons";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  addDoc,
  docRef,
  onSnapshot,
  getDoc,
} from "firebase/firestore"
import { db, auth, storage } from "./Config";
const Logout = () => {

  useEffect(() => {
    console.log('In Logout');
    const userCollection = collection(db, 'user');

    const unsubscribe1 = onSnapshot(userCollection, async (snapshot) => {
      const userData = snapshot.docs.map((doc) => doc.data());

      for (const x of userData) {
        const userRef = doc(collection(db, 'user'), `${x.name}`);
        await setDoc(
          userRef,
          { name: x.name, signedin: false },
          { merge: true }
        );
      }

      auth.signOut();
      NativeModules.DevSettings.reload();
    });

    return () => {
      unsubscribe1();
    };
  }, []);

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
    <View>
        <View>
          <Text style={styles.text}>Loging out</Text>
        <Animated.View style={{ transform: [{ scale: anim.current }],marginTop:wp(10),marginLeft:wp(45) }}>
        <Feather name="loader" size={wp(10)} color={"#e28743"} />
        </Animated.View>
      </View>
    </View>
  )
}

export default Logout

const styles = StyleSheet.create({
  text:{
    marginTop:wp(50),
    marginLeft:wp(30),
    fontSize: wp(6.5),
    fontWeight: 'bold',
  },
})