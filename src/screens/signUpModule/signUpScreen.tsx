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
import { db } from "../../../firebase-config";
import { ref, push, onValue, update, remove } from 'firebase/database';
// import { Button } from "@mui/material";

interface Navgation {
    navigate(destination?: string, params?: any): void;
}


const SecondaryScreen = ({navigation}: {navigation: Navgation}) => {
    // const navigation = useNavigation();
    const validator = fieldValidator();
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
        // let data = {
        //     id: uuid.v4(),
        //     name: name,
        //     email: email,
        //     password: password,
        //     phoneNumber: phoneNumber,
        // }

        push(ref(db, '/user/'), {
            id: uuid.v4(),
            name: name,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
        })

        // push(ref( db, '/user/'), {data})
        // Doubtful -------------------------------------------------------------------------------
        // database()
        //     .ref('/users/'+data.id)
        //     .set({data})
        //     .then((snapshot: any) => {console.log('Data added successfully!', snapshot.val())});
    }
    const signUpPressed = async () => {
        checkSubmit();
        addToDatabase();
        try {
            const createUser = await auth().createUserWithEmailAndPassword(email, password)
            console.log('email: ', email, 'password: ', password, 'phone-number: ', phoneNumber)
            // navigation.navigate('Landing Page', {userEmail: `${email}`, userPhoneNumber: `${phoneNumber}`})
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
                <KeyboardAvoidingView>

                    {/* Name field */}
                    <TextInputComponent
                        placeholderText="Enter your name"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => {
                            setName(value);
                            nameValidator(value)
                        }}
                    />
                    {nameError !== '' ? (<TextComponent text={nameError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}

                    {/* Email field */}
                    <TextInputComponent
                        placeholderText="Enter your email"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => { setEmail(value); emailValidator(value) }}
                    />
                    {emailError !== '' ? (<TextComponent text={emailError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}

                    {/* Phone number field */}
                    <TextInputComponent
                        placeholderText="Enter your phone number"
                        containerStyle={styles.textInputContainer}
                        textStyle={styles.inputText}
                        onChangeText={(value) => { setPhoneNumber(value); phoneNumberValidator(value) }}
                        keyboardType='numeric'
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
                            onChangeText={(value) => { setPassword(value) }}
                            keyboardType='default'
                        />

                        {/* Password re-entry */}
                        <TextInputComponent
                            placeholderText="Confirm your password"
                            containerStyle={styles.textInputContainerForPassword}
                            textStyle={styles.inputText}
                            isTextPassword={true}
                            onChangeText={(value) => { setConfirmPassword(value); passwordValidator(password, confirmPassword) }}
                            keyboardType='default'
                        />
                    </View>
                    {passwordError !== '' ? (<TextComponent text={passwordError} textStyle={styles.errorText} containerStyle={styles.textInputContainer} />) : (null)}
                </KeyboardAvoidingView>
                <View style={{ marginTop: 30 }}>

                    {/* Image picker */}
                    <View style={styles.imagePickerContainer}>
                        <TextComponent text="Upload your profile photo" />
                        <ImagePickerComponent
                            fileOption={{ mediaType: "photo" }}
                            buttonTextStyle={styles.imagePickerButtonText}
                            buttonStyle={styles.imagePickerButton}
                        />
                    </View>

                    {/* Date picker */}
                    <View style={styles.datePickerContainer}>
                        <TextComponent text="Enter your D.O.B." />
                        <DatePickerComponent style={{ marginHorizontal: 15 }} />
                    </View>

                    {/* Form formatter */}
                    <View style={{ marginTop: 10 }}>

                        {/* Clear form */}
                        <ButtonComponent
                            text='Clear'
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
                            style={{
                                backgroundColor: 'black',
                                marginHorizontal: 15,
                                marginVertical: 7
                            }}
                            onPress={() => signUpPressed()} textStyle={{ alignSelf: 'center' }}
                        />
                        {/* <Button title="Material button" /> */}

                        {/* Back to sign in screen, in case of mis-tap */}
                        <TouchableOpacity onPress={() => { navigation.navigate('Landing Page') }}>
                            <TextComponent text="Already have an account?" textStyle={styles.signinNavigator} />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default SecondaryScreen