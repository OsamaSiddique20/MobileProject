import { StyleSheet, Text, View ,TextInput,ScrollView,Image,TouchableOpacity,FlatList} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator,listAll} from 'firebase/storage'

const HomeScreen = ({route,navigation}) => {

  const [resSearch,setResSearch] = useState('')
  const [fetchedData,setFetchedData] = useState([])
  const [imageUrl,setUrl] = useState([])
  const [x,setX] = useState(false)
  const [cat,setCat] = useState('All')
  const [filteredData, setFilteredData] = useState([]);
  const category = ['All','Free Delivery', 'Top Selling']
  
    useEffect(() => {
      const updatedFilteredData = fetchedData
      .filter((data) => cat === 'All' || data[cat] === true)
      .filter((data) => data.name.toLowerCase().includes(resSearch.toLowerCase()));


      setFilteredData(updatedFilteredData);
    }, [resSearch,cat, fetchedData])

    const chunkArray = (array, size) => {
      return array.reduce((acc, _, index) => {
        if (index % size === 0) {
          acc.push(array.slice(index, index + size));
        }

        return acc;
      }, []);
    };
  
    // Limit to 2 rows
    const limitedData = chunkArray(filteredData, 2);
  useEffect(()=>
  {
      // navigation.setOptions(
      //     {headerBackTitleVisible: false,s
      //         headerLeft: () => <AntDesign name='logout'
      //             size={20} onPress={() => navigation.replace("Login")}
      //             />
      //     })

          const collectionRef = collection(db, 'project');

          const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
              const newData = snapshot.docs.map((doc) => doc.data());
              console.log('From DB\t', newData);
              setFetchedData(newData);
          });     
          
          const storageRef = ref(storage, 'gs://test-3df00.appspot.com');

          listAll(storageRef)
            .then((result) => {
              const uniqueUrls = new Set(imageUrl); // Use a Set to store unique URLs
          
              result.items.forEach((itemRef) => {
                let x = ref(storage, itemRef.name);
          
                getDownloadURL(x)
                  .then((url) => {
                    uniqueUrls.add(url);
          
                    // Convert the Set back to an array and update the state
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
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent: 'space-around',}}>
        <View>
          <Text style={{fontSize:15}}>Delivering to,</Text>
          <Text style={{fontSize:20,fontWeight:'600'}}>Katara, Doha </Text>
        </View>

      <View>
        <Text>User pfp here </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search Restaurants"
        value={resSearch}
        onChangeText={(text) => setResSearch(text)}
        placeholderTextColor="#9b9b9b"
        autoCorrect={false}
      />
      </View>

      <View>

      <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}>
          {category.map((data, index) => (
             <View key={index}>
              <Card containerStyle={{ borderRadius: 10, overflow: 'hidden' }}>
              <TouchableOpacity onPress={()=>setCat(data)}>
                <View style={{ padding: 5 }}>
                  
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                      {data}
                    </Text>
                 
                </View>
              </TouchableOpacity>
              </Card>
             </View>
          ))}
</ScrollView>


<ScrollView>

{limitedData.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          {row.map((data, colIndex) => (
            
            <Card key={colIndex} containerStyle={{ borderRadius: 10, overflow: 'hidden', width: '40%' }}>
              {imageUrl
                .filter((url) => url.includes(data.name + '-pfp'))
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
          ))}
        </View>
      ))}
      </ScrollView>
      </View>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    flex:1
    
  },
  inputContainer: {
    width: 210,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: 'linear-gradient(to bottom,rgb(227, 213, 255),rgb(255, 231, 231))',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.075,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    width: 200,
    height: 40,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 30,
    paddingLeft: 15,
    letterSpacing: 0.8,
    color: 'rgb(19, 19, 19)',
    fontSize: 13.4,
  },
})