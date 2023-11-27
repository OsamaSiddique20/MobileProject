import { StyleSheet, Text, View ,TextInput,Image,FlatList} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';

import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc,query,where} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons} from 'react-native-vector-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator,listAll} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';

const Cart = ({route,navigation}) => {

    const { resName, item, price,image,user } = route.params;

    const [cartFetched, setCartFetched] = useState([]);
    const [groupedCart, setGroupedCart] = useState([]);
    const [colorToggle,setColorToggle] = useState(true)
 

    useEffect(() => {
      async function addItemToCart(user, restaurantId, itemId, price, image) {
        console.log('IN ADD',`${restaurantId}-${itemId}-${user}`)
        const userCartRef = doc(collection(db, 'Cart'), `${restaurantId}-${itemId}-${user}`);
    
        const cartSnapshot = await getDoc(userCartRef);

        await setDoc(
          userCartRef,
          { [`${restaurantId}-${itemId}`]: { name: itemId, price: price, quantity: 1, image: image,user:user} },
          { merge: true }
        )
      }
    
      addItemToCart(user, resName, item, price, image);
      console.log('1st!!!!!');
    }, [])
    
    useEffect(() => {
      console.log('2nd !!!!!!')
      const collectionRef = collection(db, 'Cart');
    
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        console.log('test')
        const newData = snapshot.docs.map((doc) => doc.data());
        setCartFetched(newData);
        console.log('CART:', cartFetched);
      });

      return () => {
        unsubscribe();
        
      };
      
    }, [])
 
    useEffect(() => {
      console.log(cartFetched)
      const groupedCart = cartFetched.reduce((acc, item) => {
        const key = Object.keys(item)[0];
        console.log(key)
        if (key) {
          const restaurantName = key.split('-')[0];
          const itemData = item[key];
    
          if (acc[restaurantName]) {
            acc[restaurantName].push(itemData);
          } else {
            acc[restaurantName] = [itemData];
          }
        }
    
        return acc;
      }, {});
    
      const groupedCartArray = Object.keys(groupedCart).map((restaurantName) => ({
        [restaurantName]: groupedCart[restaurantName],
      }));
    
      setGroupedCart(groupedCartArray);
      console.log('groupedCart:: ', groupedCart);
    }, [cartFetched]);
    
    async function updateQuantity(resName,name,quantity) {
      if (quantity == 0){
        const userCartRef = doc(collection(db, 'Cart'), `${resName}-${name}-${user}`);
        await deleteDoc(userCartRef);
        console.log('Document successfully deleted!');
        return
      }
      const userCartRef = doc(collection(db, 'Cart'), `${resName}-${name}-${user}`);
      await setDoc(
        userCartRef,
        { [`${resName}-${name}`]: {  quantity: quantity} },
        { merge: true }
      );
    }
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
      
      const newTotalPrice = cartFetched.reduce((sum, item) => {
        const itemName = Object.keys(item)[0];
        const { price, quantity } = item[itemName];
        return sum + price * quantity;
      }, 0);
  
      setTotalPrice(newTotalPrice);
    }, [cartFetched]);


    const checkout = async()=>{
      let id = Math.random().toString(36).substr(2, 10);

        const cartHisRef = doc(collection(db, 'CartHistory'), `${user}-${id}`);
        

        for (const obj of groupedCart) {
          try {
              await setDoc(cartHisRef, obj,{merge:true});
              console.log('Document written  ',);
            } catch (error) {
              console.error('Error adding document: ', error);
            }
        }

        for (const obj of cartFetched){
   
          const userCartRef = doc(collection(db, 'Cart'), `${Object.keys(obj)[0]}-${user}`);
          await deleteDoc(userCartRef);
        }
        navigation.navigate('Delivery')

    }
  return (
    <View>
 

      <View>
      {groupedCart.map((restaurant, index) => (
      <View key={index} style={styles.restaurantContainer}>
        <Text style={styles.restaurantName}>{Object.keys(restaurant)[0]}</Text>
 
        {restaurant[Object.keys(restaurant)[0]].map((item, itemIndex) => (

         <View key={`${index}-${itemIndex}`} style={styles.cartItemContainer}>
          
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.infoContainer}>
            <View><Text style={{fontWeight:'bold'}}>{`${item.name}`}</Text></View>
            <View><Text style={{fontWeight:'bold'}}>{`${item.price * item.quantity} QR`}</Text></View>
          </View>

            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => updateQuantity(Object.keys(restaurant)[0], item.name, item.quantity - 1)} >
                <Text style={styles.counterButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counter}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(Object.keys(restaurant)[0], item.name, item.quantity + 1)}>
                <Text style={styles.counterButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View> 
                ))}
              </View>
            ))}

      </View>

      {totalPrice == 0?
        <View style={styles.centeredRowContainer}>
        <Text style={styles.emptyCartMessage}>Your cart is empty</Text>
        <Ionicons name="sad-outline" size={30} color={"#e28743"} />
        </View>

        :
        <View style={styles.rowContainer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>{`Total : ${totalPrice} QR`}</Text>
        </View>
        <View style={styles.paymentToggleContainer}>
          <TouchableOpacity onPress={()=>setColorToggle(true)} style={{ marginRight: 10 }} >
              <FontAwesome name="credit-card" size={30} color={colorToggle?"#e28743":"black"} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>setColorToggle(false)} style={{ marginLeft: 10,marginRight:15 }}>
              <Ionicons name="cash-outline" size={30} color={colorToggle?"black":"#e28743"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={checkout}>
          <Text style={styles.buttonText}>Order</Text>
        </TouchableOpacity>
      </View>
      }


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
        borderRadius: 10,
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
      text: {
        flex: 1, 
        fontSize: 30,
      },

      restaurantContainer: {
        width: '90%',
        marginTop: 15,
        marginBottom: 10,
        padding: 10,
        borderRadius: 30,
        backgroundColor: 'white',
      
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignSelf: 'center', 
        justifyContent: 'center',
      },
      restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign:'center'
      },
      cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      image: {
        width: 60,
        height: 60,
        marginRight: 30,
        borderRadius: 5,
      },
      infoContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 10,
      },
      counterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        
      },
  
      counterButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e28743',
    
        width: 25,
        height:25,
        borderRadius: 13,
        alignItems: 'center', 
        justifyContent: 'center',
        borderColor: '#e28743',
        borderWidth: 2, 
        textAlign: 'center', 
        lineHeight: 21, 
      },
      counter: {
        fontSize: 18,
        fontWeight: 'bold',
      },

      // last element style 
      rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
      },
      totalPriceContainer: {
        flex: 1,
      },
      totalPriceText: {
        fontSize: 18,
        fontWeight:'bold'
      },
      checkoutButton: {
        backgroundColor: '#e28743',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight:'bold'
      },

      // empty cart message
        centeredRowContainer: {
        marginTop:300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      emptyCartMessage: {
        fontSize: 22,
        fontWeight:'bold',
        color: 'black',
        marginRight: 10, 
      },

      // payment 

      paymentToggleContainer:{
        flexDirection:'row',
        alignItems:'space-between',
        paddingHorizontal: 10, 
      }
})