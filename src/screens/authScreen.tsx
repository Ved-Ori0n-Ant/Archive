import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import HomeScreen from './signedInModule/signInScreen';
import ShowAllUser from './chatModule/allUserScreen';

const AuthScreen = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <HomeScreen />;
  }

  return <ShowAllUser />;
}

export default AuthScreen