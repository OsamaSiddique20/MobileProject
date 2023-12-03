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
const [flag2,setFlag2] = useState(false)
const [error,setError] = useState()
const [confirmPass,setConfirmPass] = useState()
const [reloadX, setReload] = useState()

// useEffect(() => {
//     // Reset the navigation stack to HomeScreen
//     const resetNavigationStack = () => {
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'LoginScreen' }],
//       });
//     };
//       resetNavigationStack();

//   }, [navigation]);
// useEffect(() => {
//     const reload = async () => {
//       try {
//         const q = query(collection(db, "reload"), where("reload", "==", false));
//         const docs = await getDocs(q);
  
//         docs.forEach((doc) => {
//           console.log(doc.data());
//           setReload(doc.data().reload);
//         });
//         console.log('XXXXXX', reloadX);
//       } catch (error) {
//         console.error("Error in reload:", error);
//       }
//     };
  
//     reload();
//   }, []);

//   useEffect(() => {
//     console.log('In 2nd useEffect',reloadX)

//         const userCollection = collection(db, 'user');

//         const unsubscribe1 = onSnapshot(userCollection, async (snapshot) => {
//             const q = query(collection(db, "reload"), where("reload", "==", false));
//             const docs = await getDocs(q);
       
//             docs.forEach((doc) => {
//               console.log('1!!',doc.data().reload);
//               setReload(doc.data().reload)
//               setFlag2(!doc.data().reload)
//             //   if(doc.data().reload == false){
//             //     setFlag2(true)
//             //   }

//             })
//             console.log('BEFORE IF',flag2)
//             if (flag2){
//                 console.log('INN',flag2)
//                 setFlag2(false)
                
//                 const userData = snapshot.docs.map((doc) => doc.data());
//                 for (const x of userData) {
//                     if (x.signedin === true) {
//                     const userRef = doc(collection(db, 'user'), x.name);
//                     await setDoc(
//                         userRef,
//                         { signedin: false },
//                         { merge: true }
//                     )
//                     }
//                 }
//                 console.log('All False');
//         }
//         });
//         return () => {
//             unsubscribe1();
//           };
    

// }, []);
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
                )
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
    console.log('In Handle login')
    setFlag(false)

    signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
    const userRef = doc(collection(db, 'user'), `${username}`);
    const reloadRef = doc(collection(db, 'reload'), 'reload')
    await setDoc(
            userRef,
            {  name: username,signedin:true} ,
            { merge: true }
    )

    await setDoc(
        reloadRef,
        {  reload: true,user:username} ,
        { merge: true }
    )
    
    console.log('Logged in')
    setEmail('')
    setPassword('')
    setConfirmPass('')
    setSignedIn(true)

    navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerStack' }],
      });
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
        backgroundColor: '#0782F9',
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
        borderColor: '#0782F9',
        borderWidth: wp(0.5)
    },
    buttonText: {
        fontWeight: '700',
        color: 'white',
        fontSize: wp(4.5)
    },
    buttonOutLineText: {
        fontWeight: '700',
        color: '#0782F9',
        fontSize: wp(4.5)
    }

})