import { StyleSheet, TextInput, View,TouchableOpacity,Text,KeyboardAvoidingView ,Image} from 'react-native'
import React,{useEffect, useState} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc,getDocs, collection,deleteDoc, addDoc,docRef,onSnapshot,getDoc,query,where} from "firebase/firestore";
import { db,auth,storage } from './Config'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import HomeScreen from './HomeScreen';
const LoginScreen = ({navigation}) => {
const [email,setEmail] = useState()
const [username,setUsername] = useState()
const [password,setPassword] = useState()
const [signedIn,setSignedIn] = useState(false)
const [flag,setFlag] = useState(false)
const [flag2,setFlag2] = useState(false)
const [error,setError] = useState()
const [confirmPass,setConfirmPass] = useState()
const [reloadX, setReload] = useState()

const handleRegister = () => {
        setFlag(true)

        if (password == confirmPass){
            createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                const userRef = doc(collection(db, 'user'), `${username}`);
                await setDoc(
                    userRef,
                    {  name: username,signedin:false,email:email} ,
                    { merge: true }
                        )
                console.log('Registered')
                alert("User Registered")
                setEmail()
                setPassword()
                setEmail('')
                setPassword('')
                setConfirmPass('')
                setUsername('')
                setFlag(false)
                })
             .catch((error) => alert(error))
        }else{
            alert("Invalid Credentials")
        }
  }

  async function handleLogin() {
    console.log('In Handle login');
    setFlag(false);
  
    const userCollection = collection(db, "user");
    let proceedWithLogin = true;
  
    const snapshotPromise = new Promise((resolve, reject) => {
      const unsubscribe1 = onSnapshot(userCollection, (snapshot) => {
        resolve(snapshot);
        unsubscribe1();
      }, reject);
    });
  
    try {
      const snapshot = await snapshotPromise;
      const userData = snapshot.docs.map((doc) => doc.data());
  
      for (const x of userData) {
        console.log(x.email)
        if (x.email == email){
            setFlag2(true)
            if (x.email != email && x.name !== username) {
                proceedWithLogin = false;
                break;
              }
        }

      }
    //   if (flag2 == false){
    //         proceedWithLogin = false; 
    //   }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return;
    }
  
    if (!proceedWithLogin) {
      console.log('Dont go further')
      alert('Invalid Credentials')
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
  
      const userRef = doc(collection(db, 'user'), `${username}`);
      const reloadRef = doc(collection(db, 'reload'), 'reload');
  
      await setDoc(userRef, { name: username, signedin: true }, { merge: true });
  
      await setDoc(
        reloadRef,
        { reload: true, user: username },
        { merge: true }
      );
  
      console.log('Logged in');
      setEmail('');
      setPassword('');
      setConfirmPass('');
      setUsername('')
      setSignedIn(true);
  
      navigation.navigate('DrawerStack');
    } catch (error) {
        alert(error)
      setSignedIn(false);
    }
  }
  
    
  return (

    <KeyboardAvoidingView style={styles.container}>

        <View>
        <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/test-3df00.appspot.com/o/LoginScreen.jpeg?alt=media&token=88c5a129-7d9e-4c06-9c2b-76542ae0d51f'}} style={styles.image} />
        </View>
            <View style={styles.inputContainer}>
                <Text>{error}</Text>
                <TextInput
                    placeholder='Username'
                    value={username}
                    onChangeText={text =>  setUsername(text)}
                    style={styles.input}
                /> 
            
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text =>  setEmail(text) }
                    style={styles.input}
                    autoCorrect={false}
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text =>  setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                {flag?<TextInput
                    placeholder='Password'
                    value={confirmPass}
                    onChangeText={text =>  setConfirmPass(text)}
                    style={styles.input}
                    secureTextEntry
                    
                /> : null
            }
                
            </View>
            <View>
                
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button,flag?{backgroundColor:'white',borderColor: '#e28343',borderWidth: wp(0.5)}:null]}
                    onPress={handleLogin}
                >
                <Text style={[styles.buttonText,flag?{color:'#e28343'}:null]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonOutLine,flag?styles.button:null]}
                    onPress={handleRegister}
                >
                    <Text style={[styles.buttonText, styles.buttonOutLineText,flag?{color:'white'}:null]}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        fontSize: wp(4),
        backgroundColor: 'white',
        paddingHorizontal: wp(4),
        paddingVertical: wp(4),
        borderRadius: wp(2.5),
        marginTop: wp(3)
    },
    inputContainer: {
        width: wp(80)
    },
    button: {
        width: wp(60),
        alignItems: 'center',
        backgroundColor: '#e28343',
        borderRadius: wp(2.5),
        padding: wp(4.5),
    },
    buttonContainer: {
        width: wp(60),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: wp(10)
    },
    buttonOutLine: {
        width: wp(60),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: wp(2.5),
        padding: wp(4.5),
        marginTop: wp(2),
        borderColor: '#e28343',
        borderWidth: wp(0.5)
    },
    buttonText: {
        fontWeight: '700',
        color: 'white',
        fontSize: wp(4.5)
    },
    buttonOutLineText: {
        fontWeight: '700',
        color: '#e28343',
        fontSize: wp(4.5)
    },

    // image style
    image: {
        width: wp(60),
        height: wp(60),
        marginBottom:wp(5),
        borderRadius: wp(10),
      },
})