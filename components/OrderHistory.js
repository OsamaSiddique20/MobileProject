import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native'
import {AntDesign,MaterialCommunityIcons,FontAwesome,Ionicons,SimpleLineIcons} from 'react-native-vector-icons'

import React,{useEffect, useState} from 'react'
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc,query,where} from "firebase/firestore";
import { db,auth,storage } from './Config'
const OrderHistory = (navigation) => {
  const [user,setUser] = useState(null)
  const [cartHistoryFetched, setCartHistoryFetched] = useState([]);

  const [initialRender, setInitialRender] = useState(true);

  const logout =  async () => {
    
    const userCollection = collection(db, "user");
    const unsubscribe1 = onSnapshot(userCollection, async (snapshot) => {
      const userData = snapshot.docs.map((doc) => doc.data());
  
      for (const x of userData) {
        const userRef = doc(collection(db, 'user'), `${x.name}`);
        await setDoc(
          userRef,
          { name: x.name, signedin: false },
          { merge: true }
        )
      }
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }) 
  }
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
    );
  };


  return (
    <View>

      <TouchableOpacity onPress={()=>logout()}>
        
        <SimpleLineIcons name="logout" color={"black"} size={25} />
      
        </TouchableOpacity>

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
  // orderContainer: {
  //   width: '90%',
  //   marginTop: 15,
  //   marginBottom: 10,
  //   padding: 10,
  //   borderRadius: 30,
  //   backgroundColor: '#fff3e0',
    
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  //   alignSelf: 'center', 
  //   justifyContent: 'center',
  // },
  // orderHeading: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  //   textAlign:'center'
  // },
  // restaurantContainer: {
  //   marginBottom: 5,
  // },
  // restaurantHeading: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  // orderTotal: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginTop: 5,
  //   textAlign:'center'
  // },

  orderContainer: {
    width: '90%',
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#e28743', // Accent color
  },
  
  restaurantContainer: {
    marginBottom: 10,
  },
  
  restaurantHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#e28743', // Accent color
  },
  
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: 'red', // Accent color
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