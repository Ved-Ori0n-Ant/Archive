import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallbackWithResult } from '@react-native-async-storage/async-storage/lib/typescript/types';

//For iOS permission requesting:-------
export const requestUserPermission = async() => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

const GetFCMToken = async() => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if(!fcmToken) {
    try{
      let fcmToken: any = messaging().getToken();
      if(fcmToken) {
        AsyncStorage.getItem('fcmToken', fcmToken)
      } else {
        
      }
    } catch(err: any) {
      console.log(err.message)
    }
  }
}

export const NotificationListener= () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging()
  .getInitialNotification()
  .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
  });
  messaging().onMessage(async remoteMessage => {
    console.log('notification on foreground..!', remoteMessage);

  })
}

// export default requestUserPermission;