/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import * as React from 'react';
import { Provider } from 'react-redux';

messaging().getToken();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

PushNotification.createChannel({
  channelId: 'channel-id',
  channelName: 'My channel',
  channelDescription: 'A channel to categorise your notifications',
  playSound: true,
  soundName: 'notification_sound.wav',
  vibrate: true,
});

PushNotification.configure({
  onRegister: token => {
    // Don't forget to uncomment below to show push notifications
    // 'Cause you'll be needing to enter the key to detect device
    // console.log(token);
  },

  onNotification: notification => {
    console.log(notification);
  },
});

const provider = () => {
  return (
    <App />
  )
}

AppRegistry.registerComponent(appName, () => provider);
