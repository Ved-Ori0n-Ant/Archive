import React from 'react';
import { PermissionsAndroid } from 'react-native';

const requestContactPermission = async() => {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contact Access Permission',
          message: 'Can we access your contact list?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      console.log("granted", granted);
      if (granted === "granted") {
        console.log("Contact permission granted");
        return true;
      } else {
        console.log("Contact request is refused");
        return false;
      }
    }
    catch{(err: any) => {
      console.log(err);
      
    };}
  }