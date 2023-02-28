import React from "react";
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import ButtonComponent from "../../customComponents/customButton";
import DatePickerComponent from "../../customComponents/datePicker";
import ImagePickerComponent from "../../customComponents/ImagePickerComponent";
import TextComponent from "../../customComponents/textComponent";
import TextInputComponent from "../../customComponents/textInputComponent";
import fieldValidator from "./signUpScreenValidator";
import styles from "./signUpStyles";
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
// import { db } from "../../firebase-config";
// import { ref, push, onValue, update, remove } from 'firebase/database';
import { useNavigation } from "@react-navigation/native";
import { MainNavigatorType } from "../../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { Button } from "@mui/material";
import database from '@react-native-firebase/database';

const SecondaryScreen = () => {
    // const navigation = useNavigation();
    const validator = fieldValidator();
    const navigation = useNavigation<NativeStackNavigationProp<MainNavigatorType>>()
    const {
      name,
      setName,
      nameError,
      nameValidator,
      email,
      setEmail,
      emailError,
      emailValidator,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      passwordError,
      passwordValidator,
      checkSubmit,
      clearInputs,
      phoneNumber,
      setPhoneNumber,
      phoneNumberError,
      phoneNumberValidator,
    } = validator;
    const addToDatabase = async() => {
        // push(ref(db, '/user/'), {
        //     id: uuid.v4(),
        //     name: name,
        //     email: email,
        //     password: password,
        //     phoneNumber: phoneNumber,
        // })

        database().ref('/user/')
        .set(
            {
                id: uuid.v4(),
                name: name,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
            }
        ).then(() => console.log('data added to database'))
    }
    const signUpPressed = async () => {
        checkSubmit();
        addToDatabase();
        try {
            await auth().createUserWithEmailAndPassword(email, password)
            console.log('email: ', email, 'password: ', password, 'phone-number: ', phoneNumber)
            navigation.navigate('Landing Page')
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <ScrollView scrollEnabled={true}>
            <View>
                <TextComponent text="Please sign-up" textStyle={[styles.heading]} />
                <TextComponent text="Please fill below details" />
                {/* <KeyboardAvoidingView> */}

                    {/* Name field */}
                    <TextInputComponent
                        placeholderText="Enter your name"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => {
                            setName(value);
                            nameValidator(value)
                        }}
                        testID='name-input'
                    />
                    {nameError !== '' ? (<TextComponent text={nameError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}

                    {/* Email field */}
                    <TextInputComponent
                        placeholderText="Enter your email"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => { setEmail(value); emailValidator(value) }}
                        testID='email-input'
                    />
                    {emailError !== '' ? (<TextComponent text={emailError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}

                    {/* Phone number field */}
                    <TextInputComponent
                        placeholderText="Enter your phone number"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => { setPhoneNumber(value); phoneNumberValidator(value) }}
                        keyboardType='numeric'
                        testID="number-input"
                    />
                    {phoneNumberError !== '' ? (<TextComponent text={phoneNumberError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}

                    {/* (Re)Password field */}
                    <View style={styles.passwordContainerView}>

                        {/* Password entry */}
                        <TextInputComponent
                            placeholderText="Enter your password"
                            containerStyle={styles.textInputContainerForPassword}
                            textStyle={styles.inputText}
                            isTextPassword={true}
                            value={password}
                            onChangeText={(value) => { setPassword(value) }}
                            keyboardType='default'
                            testID="pass-input"
                        />

                        {/* Password re-entry */}
                        <TextInputComponent
                            placeholderText="Confirm your password"
                            containerStyle={styles.textInputContainerForPassword}
                            textStyle={styles.inputText}
                            isTextPassword={true}
                            onChangeText={(value) => { setConfirmPassword(value) }}
                            onEndEditing={() => { passwordValidator(password, confirmPassword) }}
                            value={confirmPassword}
                            keyboardType='default'
                            testID="pass-input"
                        />
                    </View>
                    {passwordError !== '' ? (<TextComponent text={passwordError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}
                {/* </KeyboardAvoidingView> */}
                <View style={{ marginTop: 30 }}>

                    {/* Image picker */}
                    <View style={styles.imagePickerContainer}>
                        <TextComponent text="Upload your profile photo" />
                        <ImagePickerComponent
                            fileOption={{ mediaType: "photo" }}
                            buttonTextStyle={styles.imagePickerButtonText}
                            buttonStyle={styles.imagePickerButton}
                            testID='profile-pic'
                        />
                    </View>

                    {/* Date picker */}
                    <View style={styles.datePickerContainer}>
                        <TextComponent text="Enter your D.O.B." />
                        <DatePickerComponent testID="D_O_B" style={{ marginHorizontal: 15 }} />
                    </View>

                    {/* Form formatter */}
                    <View style={{ marginTop: 10 }}>

                        {/* Clear form */}
                        <ButtonComponent
                            text='Clear'
                            testID="clear_btn"
                            style={{
                                backgroundColor: 'black',
                                marginHorizontal: 15,
                                marginVertical: 7
                            }}
                            onPress={() => clearInputs()} textStyle={{ alignSelf: 'center' }}
                        />

                        {/* Submit form */}
                        <ButtonComponent
                            text='Sign up'
                            testID="submit_btn"
                            style={{
                                backgroundColor: 'black',
                                marginHorizontal: 15,
                                marginVertical: 7
                            }}
                            onPress={() => signUpPressed()} textStyle={{ alignSelf: 'center' }}
                        />
                        {/* <Button title="Material button" /> */}

                        {/* Back to sign in screen, in case of mis-tap */}
                        <TouchableOpacity onPress={() => { navigation.navigate('Landing Page') }} testID={'Move_TO_Signin'}>
                            <TextComponent text="Already have an account?" textStyle={styles.signinNavigator} />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default SecondaryScreen