import { StyleSheet, TextInput, View,TouchableOpacity,Text,KeyboardAvoidingView } from 'react-native'
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
const [error,setError] = useState()
const [confirmPass,setConfirmPass] = useState()
useEffect(() => {
    const userCollection = collection(db, 'user');
  
    const unsubscribe1 = onSnapshot(userCollection, async (snapshot) => {
      const userData = snapshot.docs.map((doc) => doc.data());
  
      for (const x of userData) {
        if (x.signedin === true) {
          const userRef = doc(collection(db, 'user'), x.name);          
            await setDoc(
              userRef,
              { signedin: false },
              { merge: true }
            ); 
        }
      }
    });

    // Cleanup function
    return () => {
      unsubscribe1();
    };
  }, []);

const handleRegister = () => {
        setFlag(true)

        if (password == confirmPass){
            createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                const userRef = doc(collection(db, 'user'), `${username}`);
                await setDoc(
                    userRef,
                    {  name: username,signedin:false} ,
                    { merge: true }
                );
                console.log('Registered')
            setEmail()
            setPassword()
            setEmail('')
            setPassword('')
            setConfirmPass('')
            setFlag(false)
            })
             .catch((error) => console.log(error.message))
        }else{
            alert("Passowrd mismatch")
        }
  }

   async function handleLogin  ()  {
    setFlag(false)
    setEmail('')
    setPassword('')
    setConfirmPass('')
    signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
    const userRef = doc(collection(db, 'user'), `${username}`);
    await setDoc(
            userRef,
            {  name: username,signedin:true} ,
            { merge: true }
    );
    
    console.log('Logged in')
    setSignedIn(true)
    navigation.navigate('DrawerStack')
    })
    .catch((error) => {console.log(error.message);
    setSignedIn(false)})
    
}
    
  return (

    <KeyboardAvoidingView style={styles.container}>
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
                <TouchableOpacity style={styles.button}
                    onPress={handleLogin}
                    
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonOutLine]}
                    onPress={handleRegister}
                >
                    <Text style={[styles.buttonText, styles.buttonOutLineText]}>Register</Text>
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
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: wp(3)
    },
    inputContainer: {
        width: '80%'
    },
    button: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#0782F9',
        borderRadius: 10,
        padding: 15

    },
    buttonContainer: {

        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40

    },
    buttonOutLine: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        fontWeight: '700',
        color: 'white',
        fontSize: 16
    },
    buttonOutLineText: {
        fontWeight: '700',
        color: '#0782F9',
        fontSize: 16
    }

})