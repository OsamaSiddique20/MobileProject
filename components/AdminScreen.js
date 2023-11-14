import { StyleSheet, Text, View ,TextInput} from 'react-native'
import React,{useEffect, useState} from 'react'
import { Card,Button } from '@rneui/themed';
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot} from "firebase/firestore";
import { db,auth } from './Config'
import {AntDesign,MaterialCommunityIcons} from 'react-native-vector-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator} from 'firebase/storage'

const AdminScreen = ({navigation}) => {
    const [id,setID] = useState()
    const [name,setName] = useState()
    const [address,setAddress] = useState()
    const [menu,setMenu] = useState()
    const [price,setPrice] = useState()
    const [desc,setDesc] = useState()
    const [add,setAdd] = useState([])
    const [x,setX] = useState(false)
    const [fetchedData,setFetchedData] = useState([])

    useEffect(()=>
    {
        navigation.setOptions(
            {headerBackTitleVisible: false,
                headerLeft: () => <AntDesign name='logout'
                    size={20} onPress={() => navigation.replace("Login")}
                    />
                  
                })
        readAll()

},[]
)

const uploadImage = async () => {
    const imgRef = ref(storage, fileName)
    const img = await fetch(image)
    const bytes = await img.blob()
    await uploadBytesResumable(imgRef, bytes)

await getDownloadURL(imgRef).then((x) => { setUrl(x) })
.catch((e) => alert(e.message)) 
    }
    const set = async() => {
        let temp = [...add]
        p = temp.filter((x)=> x.id == id)
       
        if (p.length != 0){
            let menuTemp = p[0]
  
            menuTemp.menu.push({menu:menu,price:price})
            const index = temp.findIndex((item) => item.id === id);
            temp[index] = menuTemp;
            setAdd(temp)
        }else{
            temp.push({id:id,name:name,address:address,menu:[{menu:menu,price:price}]})

            setAdd(temp)
        }
        setMenu('')
        setPrice('')
   

        }
        
    const store = async()=>{
        for (const obj of add) {
            try {
                const docRef = doc(collection(db, 'restaurants'), obj.name); 
                await setDoc(docRef, obj);
                console.log('Document written with ID: ', obj.name);
              } catch (error) {
                console.error('Error adding document: ', error);
              }
  
          }

          setMenu('')
          setPrice('')
          setID('')
          setAddress('')
          setName('')
          setAdd([])
          readAll()
    }


    
    const readAll = async () => {
  
        const docs = await getDocs(collection(db, "restaurants"));
        let temp = []
        docs.forEach((doc) => {
            temp.push(doc.data())
        })
        setFetchedData(temp)    
        }

    const addToMenu = ()=>{
        
    }

    const deleteRes = async(x)=>{
        
        await deleteDoc(doc(db, "restaurants", x))
        .then(() => {
          console.log('Document successfully deleted');

          readAll()
        })
        .catch((error) => {
          console.error('Error deleting document:', error);
        });
        

    }
        
  return (
    <View style={styles.container}>
       
      <Card width={"90%"}>
      <Card.Title>ADD RESTURANT</Card.Title>
            <Card.Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {/* <TextInput
                    placeholder='Restaurant Id'
                    value={id}
                    style={styles.input}
                    onChangeText={text => setID(text)}
                    autoCorrect={false}
                /> */}
                <TextInput
                    placeholder='Restaurant Name'
                    value={name}
                    style={styles.input}
                    onChangeText={text => setName(text)}
                    autoCorrect={false}
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
                    <Button title="Pick an image from camera roll" onPress={pickImage} />

                </View>
                <View>
                    <TextInput
                    placeholder='Item Description'
                    value={price}
                    onChangeText={text => setDesc(text)}
                    style={styles.input}
                    autoCorrect={false}
                />
                <Button title="Add" buttonStyle={{ backgroundColor: 'red' }} onPress={set}/>
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
                                    <TouchableOpacity onPress={()=> navigation.navigate("Menu",{name:x.name,menu:x.menu})}>
                                    <Text style={[styles.out,{width:150}]}>{x.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> navigation.navigate("Menu",{name:x.name,menu:x.menu})}>
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
      //  justifyContent:'space-around',
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
    }
})