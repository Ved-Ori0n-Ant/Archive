import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/signedInModule/signInScreen";
import secondaryScreen from "./src/screens/signUpModule/signUpScreen";
import PhoneSigninScreen from "./src/screens/signedInModule/signInWithPhoneScreen";
import PhoneVerification from "./src/screens/fireBase/fireStoreDemoScreen";
import PushNotificationDemo from "./src/screens/fireBase/notificationsModule/pushNotificationDemo";
import ShowAllUser from "./src/screens/chatModule/allUserScreen";
import ShowChat from "./src/screens/chatModule/showChatScreen";
import AuthScreen from "./src/screens/authScreen";
import ShowContact from "./src/screens/contactModule/contactScreen";
// import Example from "./src/screens/DummyTester/dummyLocation";
// import AuthScreen from "./src/screens/authScreen";

export type MainNavigatorType = {
  // "User verification": any;
  "Landing Page": any;
  "Sign up Page": any;
  "Firebase demo": any;
  "Signin Phone": any;
  "Notifications": any;
  "Users Screen": any;
  "Chatting Screen": any;
  "Contact Screen": any;
};

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="uploadMapLocation" component={Example} /> */}
        <Stack.Screen name="User verification" component={AuthScreen} />
        <Stack.Screen name="Landing Page" component={HomeScreen} />
        <Stack.Screen name="Sign up Page" component={secondaryScreen} />
        {/* <Stack.Screen name="Firebase demo" component={PhoneVerification} /> */}
        <Stack.Screen name="Signin Phone" component={PhoneSigninScreen} />
        {/* <Stack.Screen name="Notifications" component={PushNotificationDemo} /> */}
        <Stack.Screen name="Users Screen" component={ShowAllUser} />
        <Stack.Screen name="Chatting Screen" component={ShowChat} />
        <Stack.Screen name="Contact Screen" component={ShowContact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
