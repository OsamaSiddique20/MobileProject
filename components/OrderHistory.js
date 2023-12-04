import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons,SimpleLineIcons,MaterialIcons} from 'react-native-vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import React,{useEffect, useState} from 'react'
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc,query,where} from "firebase/firestore";
import { db,auth,storage } from './Config'
const OrderHistory = (navigation) => {
  const [user,setUser] = useState(null)
  const [cartHistoryFetched, setCartHistoryFetched] = useState([]);

  const [initialRender, setInitialRender] = useState(true);

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
          setUser(x.name)
        }
      })

    })

      // cart history fetch

      const collectionRef = collection(db, 'CartHistory')
    
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {

        const newData = snapshot.docs.map((doc) => doc.data());
        const filteredData = newData.filter((x) => x[Object.keys(x)[0]][0].user === user);
        setCartHistoryFetched(filteredData);
        if (initialRender) {
          console.log('111')
          setInitialRender(false);
        }
      console.log('CART History :', filteredData);
      })
 
      return () => {
        unsubscribe1();
        unsubscribe(); 
     
      };


  }, [initialRender]);
  console.log(cartHistoryFetched)

  const totalOrderSums = cartHistoryFetched.map(order => {
    const orderTotal = Object.entries(order).reduce((sum, [restaurant, items]) => {
      const restaurantTotal = items.reduce((restaurantSum, item) => {
        return restaurantSum + item.price * item.quantity;
      }, 0);
      return sum + restaurantTotal;
    }, 0);
    return orderTotal;
  })
  

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

        <Text style={styles.orderTotal}>Total : {totalOrderSums[index]} QR</Text>
      </View>
    )
  }


  return (
    <View>
      {(keysArray.length ==0)?
      <View style={styles.centeredRowContainer}>
        <Text style={styles.emptyCartMessage}>Your Order history is empty</Text>
        <Ionicons name="sad-outline" size={wp(9)} color={"#e28743"} />
      </View>
      :<FlatList
      data={cartHistoryFetched}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />}


    </View>
  )
}

export default OrderHistory

const styles = StyleSheet.create({

  orderContainer: {
    width: wp(90),
    marginTop: wp(6),
    marginBottom: wp(3),
    padding: wp(3),
    borderRadius: wp(4),
    backgroundColor: '#fff8e5', // Lightened color
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // For Android shadows
    alignSelf: 'center',
    justifyContent: 'center',
  },
  
  orderHeading: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: wp(3),
    textAlign: 'center',
    color: '#c96d1c', // Accent color
  },
  
  restaurantContainer: {
    marginBottom: wp(4),
  },
  
  restaurantHeading: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: wp(2),
    color: '#e28743', 
  },
  
  orderTotal: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginTop: wp(3),
    textAlign: 'center',
    color: 'red', 
  },
  
  // empty cart message
  centeredRowContainer: {
    marginTop:wp(70),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartMessage: {
    fontSize: wp(6),
    fontWeight:'bold',
    color: 'black',
    marginRight: wp(5), 
  },
})