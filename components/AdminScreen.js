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

const AdminScreen = ({navigation}) => {

    const [name,setName] = useState()
    const [address,setAddress] = useState()
    const [menu,setMenu] = useState()
    const [price,setPrice] = useState()
    const [desc,setDesc] = useState()
    const [add,setAdd] = useState([])
    const [x,setX] = useState(false)
    const [fetchedData,setFetchedData] = useState([])
    const [image, setImage] = useState('');
    const [imageUrl,setUrl] = useState([])
    const [fileName,setFileName] = useState()
    const [tempArray,setTemp] = useState([])
    const [profImage,setProfImage] = useState()
    const [profRef,setProfRef] = useState()
    useEffect(()=>
    {
        navigation.setOptions(
            {headerBackTitleVisible: false,
                headerLeft: () => <AntDesign name='logout'
                    size={20} onPress={() => navigation.replace("Login")}
                    />
            })

            const collectionRef = collection(db, 'project')

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

const uploadProfImage = async () => {
    try {

          const imgRef = ref(storage, profRef);
          const img = await fetch(profImage); 
          const bytes = await img.blob();
          await uploadBytesResumable(imgRef, bytes);
    } catch (error) {
      console.error("Error uploading images:", error.message);
      
    }
  };

const uploadImage = async () => {
    try {
        console.log(tempArray)
      await Promise.all(
        tempArray.map(async (element) => {
          const imgRef = ref(storage, element.ref);
          const img = await fetch(element.image); 
          const bytes = await img.blob();
          await uploadBytesResumable(imgRef, bytes);

          const url = await getDownloadURL(imgRef);
          console.log("Download URL:", url);

        })
      )
      console.log("All images uploaded successfully");
      setTemp([])
    } catch (error) {
      console.error("Error uploading images:", error.message);
      
    }
  }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        });
        if (!result.canceled) {
            let temp = result.assets[0].uri
        setImage(temp);
        let tempImages = [...tempArray]
        tempImages.push({ref:name + '-'+menu,image:temp})
        setTemp(tempImages)

    }
        }

    const pickProfImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        });
        if (!result.canceled) {
            let temp = result.assets[0].uri
        setProfImage(temp);
        setProfRef(name+'-pfp')
    }
        }
    const set = async() => {

        let temp = fetchedData
        let check = temp.filter((x)=>x.name == name)
        console.log('In set function: ',check)
  
        if (check.length != 0){
            
            check[0].menu.push({menu:menu,price:price,desc:desc})
            
            const index = temp.findIndex((item) => item.name === name);
            temp[index] = check[0];
            console.log('TEST::::',temp[index].menu,'->',temp[index])
            setAdd(temp)
        }else{
            temp.push({name:name,address:address,menu:[{menu:menu,price:price,desc:desc}]})

            setAdd(temp)
        }
        setMenu('')
        setPrice('')
        setDesc('')
        }
        
    const store = async()=>{
        uploadImage()
        uploadProfImage()
        let x = ref(storage,profRef)
                getDownloadURL(x)
                .then((url) => {
            
            console.log('3', url)})  .catch((error) => {
                uploadProfImage()
                console.log('Profile Picture Added Sucessfully')
                });

        console.log('IN STORE',add)
        for (const obj of add) {
            try {
                console.log('Each obj: ',obj)
                const docRef = doc(collection(db, 'project'), obj.name); 
                await setDoc(docRef, obj);
                console.log('Document written with ID: ', obj.name);
              } catch (error) {
                console.error('Error adding document: ', error);
              }
  
          }

          setMenu('')
          setPrice('')
          setDesc('')
          setAddress('')
          setName('')
          setAdd([])

    }

    const addToMenu = ()=>{
        
    }

    const deleteRes = async(x)=>{
        
        await deleteDoc(doc(db, "project", x))
        .then(() => {
          console.log('Document successfully deleted');

        })
        .catch((error) => {
          console.error('Error deleting document:', error);
        });
        
    }
        
  return (
    <View style={styles.container}>
       
      <Card width={"90%"} containerStyle={styles.cardStyle}>
      <Card.Title>ADD RESTURANT</Card.Title>
            <Card.Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

            <TextInput
                placeholder='Restaurant Name'
                value={name}
                style={styles.input}
                onChangeText={text => setName(text)}
                autoCorrect={false}
            />
            <Button title="Resturant Image" onPress={pickProfImage} 
                style={{ backgroundColor: 'red', width: 130 }}       
            />
            </View>
            <Card.Divider />
            <View>
            <TextInput
                placeholder='Address'
                value={address}
                style={styles.input}
                onChangeText={text => setAddress(text)}
                autoCorrect={false}
            />
            </View>
            <Card.Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View>
                <TextInput
                    placeholder='Menu Item '
                    value={menu}
                    onChangeText={text => setMenu(text)}
                    style={styles.input}
                    autoCorrect={false}
                />
                <TextInput
                    placeholder='Price'
                    value={price}
                    onChangeText={text => setPrice(text)}
                    style={styles.input}
                    autoCorrect={false}
                />
                    <Button title="Menu image" onPress={pickImage} 
                    style={{ backgroundColor: 'red', width: 130 }}
                    
                    />

                </View>
                <View>
                    <TextInput
                    placeholder='Item Description'
                    value={desc}
                    onChangeText={text => setDesc(text)}
                    style={styles.input}
                    autoCorrect={false}
                />
                <Button title="Add" buttonStyle={{ backgroundColor: 'red' }} onPress={set}
                style={{ backgroundColor: 'blue', width: 130 }}
                />
                </View>
            </View>
            <Text />
            <Button title="Store" buttonStyle={{ backgroundColor: 'green' }} onPress={store} />
        </Card>
  
    
    <Card width={'90%'} height={'40%'}>
    <Card.Title>RESTURANT LIST</Card.Title>
    <Card.Divider />
    {fetchedData.map((x,i)=> {
                        return(
                            <View key = {i}>
                                <View style={{flexDirection:'row', justifyContent:'space-around'}} >

                                {
                                imageUrl
                                    .filter((url) => url.includes(x.name+'-pfp'))
                                    .map((filteredUrl, index) => (
                                   
                                    <Image key={index} source={{ uri: filteredUrl }} style={{ width: 50, height: 50 }} />
                                   
                                    ))
                                }
                                <TouchableOpacity onPress={()=> navigation.navigate("ResturantScreen",{name:x.name,menu:x.menu})}>
                                    <Text style={[styles.out,{width:150}]}>{x.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> navigation.navigate("ResturantScreen",{name:x.name,menu:x.menu})}>
                                    <Text style={[styles.out,{width:150}]}>{x.address}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> deleteRes(x.name)}>
                            
                                    <MaterialCommunityIcons
                                        name="delete"
                                        size={25}
                                        color="red"
                                    />
                                    </TouchableOpacity>
                                    
                                </View>
                                <View><Card.Divider /></View>
                            </View>
                        )
    })}

    </Card>
         

    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({
    container:{

        alignItems:'center',
        flex:1
    },
    input:{
        marginBottom:10,
        fontSize:18,
        padding:1,
        width:150
    },
    out:{
        fontSize:18,
        shadowColor:'blue',
        shadowRadius:6,
        shadowOpacity:10,
        width:120
    },
    cardStyle:{
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        shadowRadius: 0
    }
})