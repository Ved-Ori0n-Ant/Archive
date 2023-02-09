import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import TextComponent from "../../customComponents/textComponent";
import fieldValidator from "../signUpModule/signUpScreenValidator";
import TextInputComponent from "../../customComponents/textInputComponent";
import auth from '@react-native-firebase/auth';

export let CURRENT_USER_NAME: any;
interface Navgation {
    navigate(destination?: string, params?: any): void;
}

const HomeScreen = ({navigation}: {navigation: Navgation}) => {
    const validator = fieldValidator();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {
        email, 
        setEmail, 
        emailError,
        emailValidator,
        password, 
        setPassword, 
        name,
        // setPhoneNumber,
        // phoneNumberError,
        // phoneNumber,
        // phoneNumberValidator
    } = validator
    CURRENT_USER_NAME = name;
    const logInPressed = async() => {
        try{
            const userLogin = await auth().signInWithEmailAndPassword(email, password)
            console.log(userLogin)
            setErrorMessage('')
            setEmail('')
            setPassword('')
            // navigation.navigate('Notifications')
            navigation.navigate('Users Screen', {data:{email, password}})
        } catch (err: any){
            console.log(err)
            setErrorMessage(err.message)
        }
    }
    return(
        <>
        {/* <KeyboardAvoidingView> */}
        <View style = {styles.homeScreenMainContainer}>
                <TextComponent text="Please enter your credentials:" />
                <TextInputComponent 
                    placeholderText="Enter your email" 
                    containerStyle = {styles.textInputContainer} 
                    textStyle = {styles.inputText} 
                    onChangeText = {(value) => {setEmail(value); emailValidator(value)}}
                />
                {emailError !== '' ? (<TextComponent text={emailError} textStyle={styles.errorText} containerStyle = {styles.textInputContainer}/>):(null)}
                {/* <TextInputComponent 
                    placeholderText="Enter your phone number" 
                    containerStyle = {styles.textInputContainer} 
                    textStyle = {styles.inputText}
                    isTextPassword = {false}
                    keyboardType = 'number-pad'
                    onChangeText = {(value) => {setPhoneNumber(value); phoneNumberValidator(value)}}
                />
                {phoneNumberError !== '' ? (<TextComponent text={phoneNumberError} textStyle={styles.errorText} containerStyle = {styles.textInputContainer}/>):(null)} */}
                <View style={[styles.textInputContainer, {borderBottomWidth: 1}]}>
                    <TextInput
                        placeholder="Enter your password"
                        style = { [styles.inputText, { padding: 10}] }
                        secureTextEntry = {true}
                        onChangeText = { (value) => {setPassword(value)}}
                    />
                </View>
                <TouchableOpacity style = {styles.homeScreenNavigationButton} onPress = {() => {logInPressed()}}>
                    <Text style = {styles.homeScreenNavigationButtonText}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {navigation.navigate('Signin Phone')}}>
                    {/* Signin with phone number */}
                    <Text style = {styles.signinPhone}>Try another way of signin..</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {navigation.navigate('Sign up Page')}}>
                    <Text style = {styles.signupNavigator}>New user? Sign up..</Text>
                </TouchableOpacity>
                <View style = {{padding: 13}}>
                    <Text style = {styles.errorText}>{errorMessage}</Text>
                </View>
            </View>
        {/* </KeyboardAvoidingView> */}
        </>
    );
}

const styles = StyleSheet.create({
    homeScreenMainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeScreenNavigationButton: {
        width: 100,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderColor: 'black',
        borderWidth: 0.3,
        padding: 3,
        borderRadius: 16,
        backgroundColor: 'black'
    },
    homeScreenNavigationButtonText: {
        padding: 7,
        fontSize: 16,
        color: 'white', 
        flex: 1,
        alignSelf: 'center',
        textDecorationLine: 'underline'
    },
    textInputContainer: {
        width: '85%',
        marginTop: 9,
        alignSelf: 'center',
        // height: 54
    },
    inputText: {
        fontSize: 16,
        height: 35,
        fontWeight: '500'
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 10,
    },
    signupNavigator: {
        fontSize: 16,
        color: 'blue',
        alignSelf: 'center'
    },
    signinPhone: {
        fontSize: 14,
        color: 'black',
        alignSelf: 'center',
        marginBottom: 8,
        // textDecorationLine: 'underline'
    }
})

export default HomeScreen;