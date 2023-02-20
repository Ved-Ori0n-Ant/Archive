import React from "react";
import {
  Actions,
  ActionsProps,
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { push, ref } from "firebase/database";
import database from "@react-native-firebase/database";
import { db } from "../../../firebase-config";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Linking,
  PermissionsAndroid,
  Text,
  useWindowDimensions,
  Alert,
  Modal,
} from "react-native";
import TextComponent from "../../customComponents/textComponent";
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
// import { utils } from "@react-native-firebase/app";
import MapView from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainNavigatorType } from "../../../App";
import moment from  'moment';

const ShowChat = () => {
  // All constants and hooks
  const [messages, setMessages] = React.useState<any>([]);
  const [recieverMessages, setRecieverMessages] = React.useState<any>([]);
  const [messagesID, setMessagesID] = React.useState<any>([]);
  const [messagesRecieverID, setRecieverMessagesID] = React.useState<any>([]);
  const route = useRoute();
  const params: any = route.params;
  const fileOption: CameraOptions = { mediaType: "photo" };
  const WIDTH = useWindowDimensions().width;
  const navigation = useNavigation<NativeStackNavigationProp<MainNavigatorType>>();
  const msgRef = database().ref( "/chat/personalMessages/" + params?.fromUserData[0]?.id + "/" + params?.item?.id + "/" );
  const reverseMsgRef = database().ref( "/chat/personalMessages/" + params?.item?.id + "/" + params?.fromUserData[0]?.id + "/" );
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);


  // All related to text....

  // Takes new message and pushes it to the tempArray
  React.useEffect(() => {
    const subscribe = msgRef.on("value", (snapshot) => {
      let tempArray: any[] = [];
      let tempSpreader: any = { ...snapshot.val() };
      setMessagesID(Object.keys(tempSpreader))
      let tempIdStripped: any = Object.values(tempSpreader);
      tempIdStripped.forEach((singleMsg: any) => {
        tempArray.push(singleMsg.msg);
      });
      tempArray.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      setMessages(tempArray);
    });
    const sub = reverseMsgRef.on("value", (snapshot) => {
      let tempArray: any[] = [];
      let tempSpreader: any = { ...snapshot.val() };
      setRecieverMessagesID(Object.keys(tempSpreader))
      let tempIdStripped: any = Object.values(tempSpreader);
      tempIdStripped.forEach((singleMsg: any) => {
        tempArray.push(singleMsg.msg);
      });
      tempArray.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      setRecieverMessages(tempArray);
    });
    return () => {
      msgRef.off("value", subscribe);
      reverseMsgRef.off("value", sub);
    };
  }, []);
  // Handles on long press on text
  const chatOnLongPressed = (message: any) => {
    Alert.alert('Delete message?', '', [
      {text: 'Cancel', onPress:() => {console.log('cancel is pressed')}, style: 'cancel'},
      {text: 'Delete for all', onPress:() => {deleteSenderRef(message); deleteRecieverRef(message)}, style: 'default'},
      {text: 'Delete for me', onPress:() => {deleteSenderRef(message)}, style: 'default'},
    ])
  }
  // Deletes sender reference
  const deleteSenderRef = (message: any) => {
    var ind = 0;
    for(var i=0; i<messages.length; i++){
      if(messages[i] == message){
        ind = i;
      }
    }
    database().ref("chat/personalMessages/" + params?.fromUserData[0]?.id + '/' + params?.item?.id + '/' + messagesID[ind] + '/').remove()
  }
  // Deletes reciever reference
  const deleteRecieverRef = (message: any) => {
    var ind = 0;
    for(var i=0; i<recieverMessages.length; i++) {
      if(recieverMessages[i] == message){
        ind = i;
      }
    }
    database().ref('chat/personalMessages/' + params?.item?.id + '/' + params?.fromUserData[0]?.id + '/' + messagesRecieverID[ind] + '/').remove()
  }
  // Handles clear chat
  const clearChat = () => {
    msgRef.remove();
    // reverseMsgRef.remove();
  }
  
  //Handles onSend for text message
  const onSend = React.useCallback((messageArray: any[]) => {
    const myMsg = messageArray[0];
    const msg = {
      ...myMsg,
      recieverId: params?.item?.id,
      senderId: params?.fromUserData[0]?.id,
      createdAt: new Date().getTime(),
      user: {
        _id: params?.fromUserData[0]?.id,
        name: params?.fromUserData[0].name,
      },
    };
    push(
      ref(
        db,
        "/chat/personalMessages/" +
          params?.fromUserData[0]?.id +
          "/" +
          params?.item?.id +
          "/"
      ),
      { msg }
    );
    push(
      ref(
        db,
        "/chat/personalMessages/" +
          params?.item?.id +
          "/" +
          params?.fromUserData[0]?.id +
          "/"
      ),
      { msg }
    );
    console.log(msg);
  }, []);


  //All related to images....

  //Common method to add images on firebase storage
  const uploadToFirebase = async (imageName: string) => {
    await storage().ref(`personalMessageImages/`).putFile(imageName);
  };
  //Image-picker component to open camera
  const callCamera = (m: any[]) => {
    launchCamera(fileOption,  (callback: any) => {
      if (callback.didCancel) {
        console.log("Cancelled image picker");
      } else if (callback.errorCode) {
        console.log(callback.errorCode, '~~~~');
      } else if (callback.assets) {
        // console.log("Uri from camera", callback.assets[0].uri);
        const imagePathString: any = callback?.assets[0]?.uri;
        uploadToFirebase(imagePathString);
        console.log(imagePathString, "@@@@Image_path_string");
        const imageName: any = imagePathString.substring(
          imagePathString.lastIndexOf("/") + 1
        );
        console.log("image name:::", imageName);
        const url: any = storage()
          .ref(`personalMessageImages/${imageName}`)
          .getDownloadURL();
        // console.log('image url from firebase::::', url);
        onSendImage(imagePathString);
        // onSendImage(url);
      } else {
        console.log(callback);
      }
    });
  };
  //Image-picker component to open gallery
  const callGalery = async (m: any[]) => {
    await launchImageLibrary(fileOption, async (callback: any) => {
      if (callback.didCancel) {
        console.log("Cancelled image picker");
      } else if (callback.errorCode) {
        console.log(callback.errorCode);
      } else if (callback.assets) {
        // console.log("Uri from galery", callback.assets[0].uri);
        const imagePathString: any = callback?.assets[0]?.uri;
        uploadToFirebase(imagePathString);
        const imageName: any = imagePathString.substring(
          imagePathString.lastIndexOf("/") + 1
        );
        console.log("image name:::", imageName);
        const url: any = await storage()
          .ref(`personalMessageImages/${imageName}`)
          .getDownloadURL();
        // console.log('image url from firebase::::', url);
        onSendImage(imagePathString);
        // onSendImage(url);
      } else {
        console.log(callback);
      }
    });
  };
  //Handles onSend method for images
  const onSendImage = React.useCallback((imagePath: string) => {
    const myMsg = {
      _id: uuid.v4(),
    };
    const msg = {
      ...myMsg,
      createdAt: new Date().getTime(),
      image: imagePath,
      user: {
        _id: params?.fromUserData[0]?.id,
        name: params?.fromUserData[0].name,
      },
    };
    push(
      ref(
        db,
        "/chat/personalMessages/" +
          params?.fromUserData[0]?.id +
          "/" +
          params?.item?.id +
          "/"
      ),
      { msg }
    );
    push(
      ref(
        db,
        "/chat/personalMessages/" +
          params?.item?.id +
          "/" +
          params?.fromUserData[0]?.id +
          "/"
      ),
      { msg }
    );
    console.log(msg);
  }, []);


  // All related to maps....

  // Asking user permissions for location access
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log("granted", granted);
      if (granted === "granted") {
        console.log("Geolocation permission granted");
        return true;
      } else {
        console.log("Geolocation request is refused");
        return false;
      }
    } catch {
      (err: any) => {
        console.log(err);
      };
    }
  };
  // Handles onSend method for map
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(async (res: any) => {
      console.log(res, ":: is the res");
      if (res) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("position", position);

            const myMsg = {
              _id: uuid.v4(),
            };
            const msg = {
              ...myMsg,
              createdAt: new Date().getTime(),
              location: position?.coords,
              user: {
                _id: params?.fromUserData[0]?.id,
                name: params?.fromUserData[0].name,
              },
            };

            push(
              ref(
                db,
                "/chat/personalMessages/" +
                  params?.fromUserData[0]?.id +
                  "/" +
                  params?.item?.id +
                  "/"
              ),
              { msg }
            );
            push(
              ref(
                db,
                "/chat/personalMessages/" +
                  params?.item?.id +
                  "/" +
                  params?.fromUserData[0]?.id +
                  "/"
              ),
              { msg }
            );
            console.log("--> Message pushed on firebase", msg);
          },
          (error) => {
            console.log("Error ocuured::", error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      }
    });
  };
  // Creates a map view in gifted-chat message bubble
  const LocationView = (location: any) => {
    // Accesses the maps
    const openMaps = () => {
      const url: any = Platform.select({
        ios: `http://maps.apple.com/?ll=${location.location.latitude},${location.location.longitude}`,
        android: `http://maps.google.com/?q=${location.location.latitude},${location.location.longitude}`,
      });
      Linking.canOpenURL(url)
        .then((supported: any) => {
          if (supported) {
            return Linking.openURL(url);
          }
        })
        .catch((e: any) =>
          console.log("error has occured while opening the url", e)
        );
    };
    return (
      <TouchableOpacity
        onPress={() => openMaps()}
        style={{ height: 210, width: 210, backgroundColor: "grey" }}
      >
        <MapView
          region={{
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            latitudeDelta: 0.45,
            longitudeDelta: 0.45,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          style={{ height: 210, width: 210 }}
          // mapType={'terrain'}
        />
      </TouchableOpacity>
    );
  };


  // All related to contacts....

  // Asking for contact permissions
  const requestContactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contact Access Permission",
          message: "Can we access your contact list?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log("granted", granted);
      if (granted === "granted") {
        console.log("Contact permission granted");
        return true;
      } else {
        console.log("Contact request is refused");
        return false;
      }
    } catch {
      (err: any) => {
        console.log(err);
      };
    }
  };
  // Handles onSend method for contacts
  const getContacts = () => {
    const result = requestContactPermission();
    result.then((res: any) => {
      navigation.navigate("Contact Screen", params);
    });
  };
  // Opens dial-pad
  const openDialPad = (phoneNumber: any) => {
    let tempNum = ''
    if (Platform.OS == 'android'){
      tempNum = `tel:${phoneNumber}`;
    } else {
      tempNum = `telprompt:${phoneNumber}`
    }
    Linking.openURL(tempNum);
  }

  //Returns gifted chat UI along with header which contains the reciever name
  return (
    <>
      {/* Header component which shows reciever's name */}
      <View style={[styles.headerContainer, { justifyContent: "space-between" }]}>
        <TextComponent text={params?.item?.name} />
        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          style={{ flex: 1, borderWidth: 1, margin: 33, backgroundColor: '#aaa' }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: '#acc0ac'
            }}
          >
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                callCamera(messages);
              }}
            >
              <Image
                source={require("../../assets/images/cameraIcon.png")}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                callGalery(messages);
              }}
            >
              <Image
                source={require("../../assets/images/gallery.png")}
                style={styles.galleryIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                getContacts();
              }}
            >
              <Image
                source={require("../../assets/images/contactIcon.png")}
                style={styles.contactIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                getLocation();
              }}
            >
              <Image
                source={require("../../assets/images/locationIcon.png")}
                style={styles.locationIcon}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            justifyContent: "space-evenly",
            margin: 10,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image source={require("../../assets/images/menuIcon.png")} />
        </TouchableOpacity>
      </View>

      {/* Gifted chat component */}
      <GiftedChat 
        messages={messages}
        user={{ _id: params?.fromUserData[0]?.id }}
        isLoadingEarlier
        alwaysShowSend
        onSend={(messages) => {
          onSend(messages);
        }}
        renderActions={(props: Readonly<ActionsProps>) => {
          return (
            <Actions
              {...props}
              options={{
                ["Share contact 📞"]: () => {
                  getContacts();
                },
                ["Share location 🧭"]: () => {
                  getLocation();
                },
                ["Send photos from gallery 📷"]: () => {
                  callGalery(messages);
                },
              }}
              onSend={(args) => console.log(args)}
            />
          );
        }}
        // Custom input toolbar
        renderInputToolbar={(props: any) => {
          return (
            <InputToolbar {...props} containerStyle={{ height: 50 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: 5, marginTop: 5}}> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => {
                      callCamera(messages);
                    }}
                  >
                    <Image
                      source={require("../../assets/images/cameraIcon.png")}
                      style={styles.cameraIcon}
                    />
                  </TouchableOpacity>
                </View>
                <Send {...props} />
              </View>
            </InputToolbar>
          );
        }}
        renderBubble={(props: any) => {
          const { currentMessage } = props;
          // If message contains location attribute, then share location
          if (currentMessage.location) {
            return (
              <TouchableOpacity
                style={styles.mapContainer}
                onLongPress={() => {
                  chatOnLongPressed(currentMessage);
                }}
              >
                <LocationView location={currentMessage.location} />
                <Text style={styles.timeStamp}>
                  {moment(currentMessage.createdAt).format("h:mm a")}
                </Text>
              </TouchableOpacity>
            );
          }
          // If message contains contact attribute, then share contact
          if (currentMessage.contact) {
            return (
              <TouchableOpacity
                onPress={() => {
                  chatOnLongPressed(currentMessage);
                }}
              >
                <View style={[styles.contactContainer, { width: WIDTH / 2.1 }]}>
                  <View style={styles.nameContainer}>
                    <Text style={{ fontSize: 18, margin: 7, marginBottom: 1 }}>
                      {currentMessage.contact.name}
                    </Text>
                    {/* Add time stamp here ..... */}
                    <Text style={styles.timeStamp}>
                      {moment(currentMessage.createdAt).format("h:mm a")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.numberContainer}
                    onLongPress={() => {
                      openDialPad(currentMessage.contact.contactNumber);
                    }}
                  >
                    <Text style={{ color: "blue" }}>
                      {currentMessage.contact.contactNumber}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <>
              <Bubble
                {...props}
                onLongPress={() => {
                  chatOnLongPressed(currentMessage);
                }}
                wrapperStyle={{
                  right: {
                    marginRight: 1,
                  },
                  left: {
                    backgroundColor: "#72f5c9",
                    marginLeft: -4,
                  },
                }}
              />
            </>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#afcfcf",
    width: "100%",
    alignItems: "flex-start",
    height: "auto",
    maxHeight: 180,
    justifyContent: "center",
    flexDirection: 'row'
  },
  mapContainer: {
    backgroundColor: "#c0c0c0",
    padding: 7,
    borderRadius: 10,
    marginVertical: 2,
    marginLeft: -4,
    marginRight: 1,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    height: 48,
    width: 48,
  },
  galleryIcon: {
    height: 16,
    width: 16,
    marginRight: 5 / 2,
  },
  locationIcon: {
    height: 35,
    width: 35,
  },
  contactIcon: {
    height: 50,
    width: 50,
  },
  messageIcon: {
    height: 30,
    width: 30,
    margin: 5,
  },
  contactContainer: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
    marginLeft: -4,
    marginRight: 1,
    backgroundColor: "#c0c0c0",
  },
  nameContainer: {
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
  },
  numberContainer: {
    padding: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  timeStamp: {
    textAlign: "right",
    marginRight: 5,
    opacity: 0.7,
    fontSize: 10,
    marginTop: 4
  },
});

export default ShowChat;