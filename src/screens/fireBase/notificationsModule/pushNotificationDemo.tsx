import React, {useEffect} from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

const PushNotificationDemo = () => {
  const showNotification = (
    notification: FirebaseMessagingTypes.Notification,
  ) => {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body!,
    });
  };
  useEffect(() => {
    firebase
      .messaging()
      .getToken(firebase.app().options.messagingSenderId)
      .then(token => console.log(token))
      .catch(e => console.log(e));
    firebase.messaging().onMessage(response => {
      console.log(JSON.stringify(response));
        showNotification(response.notification!);
    });
  }, []);
  return <></>;
};
export default PushNotificationDemo;





// import React, {useEffect} from "react";
// import {View, Text} from 'react-native';
// import firebase from '@react-native-firebase/app';
// import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import PushNotification from "react-native-push-notification";

// // import {requestUserPermission, NotificationListener} from "./fbNotificationUserPermission";

// const PushNotificationDemo = () => {

//     const ShowNotification = (notification: FirebaseMessagingTypes.Notification) => {
//         PushNotification.localNotification({
//             title: notification.title,
//             message: notification.body!
//         })
//     }

//     useEffect(() => {
//         firebase
//             .messaging()
//             .getToken(firebase.app().options.messagingSenderId)
//             .then(token => console.log(token))
//             .catch(err => console.log(err))
//         firebase.messaging().onMessage((response: any) => {
//             console.log(JSON.stringify(response))
//             ShowNotification(response.notification)
//         })
//     }, [])

//     return (
//         <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//             <Text>Push notification demo app</Text>
//         </View>
//     )
// }

// export default PushNotificationDemo