import React, {useEffect, useState} from "react";
import { View, Text } from 'react-native';
import fireStore from '@react-native-firebase/firestore';
import TextComponent from "../../customComponents/textComponent";

export default function FireBaseDemo() {

    const [userMail, setUserMail] = useState('');

    useEffect(() => {
        getDB()
    }, [])

    const getDB = async() => {
        try {
            const data = await fireStore().collection('randomCollection').doc('kq35sJGTH2uPWhiloTrG').get()
            setUserMail(data._data)
        } catch(error) {
            console.log(error)
        }
    }

    //It shows the content of the database/firestore
    return(
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextComponent text = 'Hello world!'/>
            <Text>{userMail ? userMail.Email : 'Loading..!'}</Text>
        </View>
    )
}


// import React, { useState, useEffect } from 'react';
// import { Text, View, StyleSheet } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import fieldValidator from './signUpModule/signUpScreenValidator';
// import ButtonComponent from '../customComponents/customButton';
// import TextInputComponent from '../customComponents/textInputComponent';

// const PhoneVerification = () => {

//   const validator = fieldValidator();
//   // Set an initializing state whilst Firebase connects
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<any>();
//   const {phoneNumber} = validator 
  
//   // If null, no SMS has been sent
//   const [confirm, setConfirm] = useState<any>(null);

//   const [code, setCode] = useState('');

//   // Handle user state changes
//   function onAuthStateChanged(user: any) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   // Handle the verify phone button press
//   const verifyPhoneNumber = async(phNumber: any) => {
//     const confirmation = await auth().verifyPhoneNumber(phNumber);
//     setConfirm(confirmation);
//   }

//   // Handle confirm code button press
//   const confirmCode = async() => {
//     try {
//       const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
//       let userData = await auth().currentUser?.linkWithCredential(credential);
//       setUser(userData?.user);
//     } catch (error: any) {
//         console.log(error.message)
//     }
//   }

//   if (initializing) return null;

//   if (!user.phNumber) {
//     if (!confirm) {
//       return (
//         <View style = {styles.buttonContainer}>
//             <ButtonComponent
//                 text="Verify Phone Number"
//                 onPress={() => verifyPhoneNumber(phoneNumber)}
//             />
//         </View>
//       );
//     }
//     return (
//       <View style = {styles.buttonContainer}>
//         <TextInputComponent value={code} onChangeText={text => setCode(text)} />
//         <ButtonComponent text="Confirm Code" onPress={() => confirmCode()} />
//       </View>
//     );
//   } else {
//     return (
//       <View style = {styles.buttonContainer}>
//             <Text>
//                 Welcome! {user.phoneNumber} linked with {user.email}
//             </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//     buttonContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 12,
//     }
// })

// export default PhoneVerification