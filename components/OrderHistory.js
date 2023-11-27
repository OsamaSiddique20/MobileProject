import { StyleSheet, Text, View,FlatList } from 'react-native'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons} from 'react-native-vector-icons'

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
          setUser(x.name)
        }
      })
    })

      // cart history fetch

      const collectionRef = collection(db, 'CartHistory');
    
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {

        const newData = snapshot.docs.map((doc) => doc.data());
        const filteredData = newData.filter((x) => x[Object.keys(x)[0]][0].user === user);
   
        setCartHistoryFetched(filteredData);
        console.log('CART History :', cartHistoryFetched);
      });

      return () => {
        unsubscribe1();
        unsubscribe(); 
        
      };

  }, []);
  console.log(cartHistoryFetched)

  const totalOrderSums = cartHistoryFetched.map(order => {
    const orderTotal = Object.entries(order).reduce((sum, [restaurant, items]) => {
      const restaurantTotal = items.reduce((restaurantSum, item) => {
        return restaurantSum + item.price * item.quantity;
      }, 0);
      return sum + restaurantTotal;
    }, 0);
    return orderTotal;
  });
  


  const keysArray = cartHistoryFetched.map(item => Object.keys(item));

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.orderContainer}>
        <Text style={styles.orderHeading}>Order #{index + 1}</Text>
        {keysArray[index].map(restaurant => (
          <View key={restaurant} style={styles.restaurantContainer}>
            <Text style={styles.restaurantHeading}>{restaurant}</Text>
           
            {cartHistoryFetched[index][restaurant].map((item, i) => (
              <Text key={i}>{`${item.name} - ${item.price * item.quantity} QR`}</Text>
            ))}
          </View>
        ))}
        <Text style={styles.orderTotal}>Total Price: {totalOrderSums[index]} QR</Text>
      </View>
    );
  };


  return (
    <View>

      {/* {keysArray.map((x,i)=>{
        return <View>
          <Text>Order {i + 1}</Text>

        </View>
      })} */}

      {(keysArray.length ==0)?
      <View style={styles.centeredRowContainer}>
        <Text style={styles.emptyCartMessage}>Your Order history is empty</Text>
        <Ionicons name="sad-outline" size={30} color={"#e28743"} />
      </View>
      :<FlatList
      data={cartHistoryFetched}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />}



    {/* {cartHistoryFetched.map((restaurant, index) => (
      <View key={index} >
        <Text>Order {index + 1 }</Text>
        <Text style={styles.restaurantName}>{Object.keys(restaurant)[0]}</Text>
 
        {restaurant[Object.keys(restaurant)[0]].map((item, itemIndex) => (

         <View key={`${index}-${itemIndex}`} >
          
       

          <View style={styles.infoContainer}>
            
            <View><Text >{`${item.name}`}</Text></View>
            <View><Text >{`${item.price * item.quantity} QR`}</Text></View>
          </View>
          </View> 
                ))}
              </View>
            ))} */}

      

    </View>
  )
}

export default OrderHistory

const styles = StyleSheet.create({
  orderContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  orderHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantContainer: {
    marginBottom: 5,
  },
  restaurantHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
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
})