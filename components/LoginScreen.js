import { StyleSheet, TextInput, View,TouchableOpacity,Text,KeyboardAvoidingView } from 'react-native'
import React,{useEffect, useState} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './Config'
import HomeScreen from './HomeScreen';
const LoginScreen = ({navigation}) => {
const [email,setEmail] = useState()
const [password,setPassword] = useState()
const [signedIn,setSignedIn] = useState(false)
const [flag,setFlag] = useState(false)
const [error,setError] = useState()
const [confirmPass,setConfirmPass] = useState()
useEffect(()=> setSignedIn(false),[])

const handleRegister = () => {
        setFlag(true)

        if (password == confirmPass){
            createUserWithEmailAndPassword(auth, email, password)
            .then(() =>{ console.log("registered")
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

  const handleLogin = () => {
    setFlag(false)
    setEmail('')
    setPassword('')
    setConfirmPass('')
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
    console.log('Logged in')
    setSignedIn(true)
    navigation.navigate('Tabs')
    })
    .catch((error) => {console.log(error.message);
    setSignedIn(false)})
    
}
    
  return (

    <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>{error}</Text>
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
        fontSize: 18,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 5
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