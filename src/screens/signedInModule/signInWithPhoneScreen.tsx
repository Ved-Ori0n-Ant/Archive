import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import TextComponent from "../../customComponents/textComponent";
import fieldValidator from "../signUpModule/signUpScreenValidator";
import TextInputComponent from "../../customComponents/textInputComponent";
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { MainNavigatorType } from "../../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const PhoneSigninScreen = () => {
    // const navigation = useNavigation();
    const validator = fieldValidator();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isOTPGenerated, setIsOTPGenerated] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<any>(null)
    const [code, setCode] = useState('');
    const [isShownActivityIndicator, setIsShownActivityIndicator] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<MainNavigatorType>>();
    const {
        phoneNumber,
        setPhoneNumber,
        phoneNumberValidator,
        phoneNumberError,
    } = validator
    const getVarificationCode = async(phoneNum: string) => {
        try{
        const getCode = await auth().signInWithPhoneNumber(phoneNum)
        setConfirm(getCode)
        } catch(err: any) {
            console.log(err.message)
        }
    }
    const generateOTP = async() => {
        setIsShownActivityIndicator(true)
        setTimeout(() => {
            setIsOTPGenerated(true)
            getVarificationCode(phoneNumber)
            return (
                <View>
                  <ActivityIndicator
                    animating={isShownActivityIndicator}
                    size="large"
                  />
                </View>
              );
        }, 3000)
    }
    const signinWithPhonePressed = async() => {
        try{
           await confirm.confirm(code) 
           console.log('signin using phone_num')   
        //    navigation.navigate('Notifications') 
           navigation.navigate('Users Screen') 
        }catch(err: any){
            console.log(err.message)
        }
    }
    return(
        <>
        {/* <KeyboardAvoidingView> */}
        <View style = {styles.homeScreenMainContainer}>
                <TextComponent testID="const-txt" text="Please enter your credentials:" textStyle={{marginBottom: 62}}/>
                <TextInputComponent 
                    testID="phone-input"
                    placeholderText="Enter your phone number" 
                    containerStyle = {styles.textInputContainer} 
                    textStyle = {styles.inputText} 
                    onChangeText = {(value) => {setPhoneNumber(value); phoneNumberValidator(value)}}
                    keyboardType = 'number-pad'
                    value={phoneNumber}
                />
                {phoneNumberError !== '' ? (<TextComponent text={phoneNumberError} textStyle={styles.errorText} containerStyle = {styles.textInputContainer}/>):(null)}
                { !isOTPGenerated ? 
                (    
                    <>
                        <TouchableOpacity testID="otp_generator" style = {styles.homeScreenNavigationButton} onPress = {() => {generateOTP()}}>
                            <Text style = {styles.homeScreenNavigationButtonText}>Generate OTP</Text>
                        </TouchableOpacity>
                        {/* <View>
                            <ActivityIndicator animating = {isShownActivityIndicator} size = 'large' />
                        </View>  */}
                    </>
                ) : (
                    <>
                        <View style = {styles.textInputContainer}>
                            <TextInput 
                                testID="otp-input"
                                placeholder="Enter the OTP" 
                                // containerStyle = {styles.textInputContainer} 
                                style = {styles.inputText} 
                                secureTextEntry = {true} 
                                value = {code}
                                onChangeText = {(value) => {setCode(value)}}
                            />
                        </View>
                        <TouchableOpacity style = {styles.homeScreenNavigationButton} onPress = {() => signinWithPhonePressed()}>
                            <Text style = {styles.homeScreenNavigationButtonText}>Sign in</Text>
                        </TouchableOpacity>
                    </> 
                )
                }
                <TouchableOpacity testID="sign_in_with_email" onPress = {() => {navigation.navigate('Landing Page')}}>
                    {/* Sign in with email and password */}
                    <Text style = {styles.signinPhone}>Try another way of signin..</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="sign_up" onPress = {() => {navigation.navigate('Sign up Page')}}>
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
        backgroundColor: '#c0c0c00a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeScreenNavigationButton: {
        width: '60%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderColor: 'black',
        borderWidth: 0.3,
        padding: 3,
        borderRadius: 16,
        backgroundColor: 'black',
        marginTop: 23,
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
        marginVertical: 2,
        alignSelf: 'center',
        borderBottomWidth: 1,
    },
    inputText: {
        fontSize: 14,
        height: 35,
        fontWeight: '500'
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 8,
        textDecorationLine: 'none'
    },
    signupNavigator: {
        fontSize: 16,
        color: 'blue',
        alignSelf: 'center',
    },
    signinPhone: {
        fontSize: 14,
        color: 'black',
        alignSelf: 'center',
        marginBottom: 8,
        // textDecorationLine: 'underline'
    }
})

export default PhoneSigninScreen;