import React from "react";
import {
  // Actions,
  // ActionsProps,
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
import MapView from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainNavigatorType } from "../../../App";
import moment from "moment";

const ShowChat = () => {
  // All constants and hooks
  const [messages, setMessages] = React.useState<any>([]);
  const [recieverMessages, setRecieverMessages] = React.useState<any>([]);
  const [messagesID, setMessagesID] = React.useState<any>([]);
  const [recieverMessagesId, setRecieverMessagesID] = React.useState<any>([]);
  const route = useRoute();
  const params: any = route.params;
  const fileOption: CameraOptions = { mediaType: "photo" };
  const WIDTH = useWindowDimensions().width;
  const HEIGHT = useWindowDimensions().height;
  const navigation =
    useNavigation<NativeStackNavigationProp<MainNavigatorType>>();
  const msgRef = database().ref(
    "/chat/personalMessages/" +
      params?.fromUserData[0]?.id +
      "/" +
      params?.item?.id +
      "/"
  );
  const reverseMsgRef = database().ref(
    "/chat/personalMessages/" +
      params?.item?.id +
      "/" +
      params?.fromUserData[0]?.id +
      "/"
  );
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [textSelectedModalVisible, setTextSelectedModalVisible] =
    React.useState<boolean>(false);

  //   Uncomment below to check all state values
  //   console.log('Sender messages: ', messages);
  //   console.log('Sender messagesID: ', messagesID);
  //   console.log('Reciever messages: ', recieverMessages);
  //   console.log('Reciever messagesID: ', recieverMessagesId);

  // console.log("Execution starts");

  // All related to text....

  // Takes new message and pushes it to the tempArray
  React.useEffect(() => {
    // For forward path
    const subscribeForward = msgRef.on("value", (snapshot) => {
      let rawArr: any[] = [];
      let tempSpreader: any = { ...snapshot.val() };
      Object.entries(tempSpreader).forEach((element: any) => {
        rawArr.push(element);
      });
      rawArr.sort(function (a, b) {
        return b[1].msg.createdAt - a[1].msg.createdAt;
      });
      let sortedTempSpreader = Object.fromEntries(rawArr);
      setMessagesID(Object.keys(sortedTempSpreader));
      let tempIdStripped: any = Object.values(sortedTempSpreader);
      let tempArray: any[] = [];
      tempIdStripped.forEach((singleMsg: any) => {
        tempArray.push(singleMsg.msg);
      });
      setMessages(tempArray);
    });
    // For reverse path
    const subscribeReverse = reverseMsgRef.on("value", (snapshot) => {
      let rawArr: any[] = [];
      let tempSpreader: any = { ...snapshot.val() };
      Object.entries(tempSpreader).forEach((element: any) => {
        rawArr.push(element);
      });
      rawArr.sort(function (a, b) {
        return b[1].msg.createdAt - a[1].msg.createdAt;
      });
      let sortedTempSpreader = Object.fromEntries(rawArr);
      setRecieverMessagesID(Object.keys(sortedTempSpreader));
      let tempIdStripped: any = Object.values(sortedTempSpreader);
      let tempArray: any[] = [];
      tempIdStripped.forEach((singleMsg: any) => {
        tempArray.push(singleMsg.msg);
      });
      setRecieverMessages(tempArray);
    });
    return () => {
      msgRef.off("value", subscribeForward);
      reverseMsgRef.off("value", subscribeReverse);
    };
  }, []);
  // Handles on long press on text
  const chatOnLongPressed = (message: any) => {
    // setTextSelectedModalVisible(true)
    Alert.alert("Delete message?", "", [
      {
        text: "Cancel",
        onPress: () => {
          console.log("cancel is pressed");
        },
        style: "cancel",
      },
      {
        text: "Delete for all",
        onPress: () => {
          deleteForAll(message);
        },
        style: "default",
      },
      {
        text: "Delete for me",
        onPress: () => {
          deleteForMe(message);
        },
        style: "default",
      },
    ]);
  };
  // Deletes sender and reciever reference
  const deleteForAll = (message: any) => {
    var ind = 0;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i] === message) {
        ind = i;
      }
    }
    // You can directly call 'deleteForMe(message)' instead of writing below line
    // But to maintain consistency, I wrote it
    database()
      .ref(
        "chat/personalMessages/" +
          params?.item?.id +
          "/" +
          params?.fromUserData[0]?.id +
          "/" +
          recieverMessagesId[ind] +
          "/"
      )
      .remove();
    database()
      .ref(
        "chat/personalMessages/" +
          params?.fromUserData[0]?.id +
          "/" +
          params?.item?.id +
          "/" +
          messagesID[ind] +
          "/"
      )
      .remove();
  };
  // Delete sender reference
  const deleteForMe = (message: any) => {
    var ind = 0;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i] === message) {
        ind = i;
      }
    }
    database()
      .ref(
        "chat/personalMessages/" +
          params?.fromUserData[0]?.id +
          "/" +
          params?.item?.id +
          "/" +
          messagesID[ind] +
          "/"
      )
      .remove();
  };
  // Handles clear chat for sender
  const clearChat = () => {
    msgRef.remove();
    // reverseMsgRef.remove();
  };
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
    await storage().ref(`${imageName}`).putFile("personalMessageImages/");
  };
  //Image-picker component to open camera
  const callCamera = () => {
    launchCamera(fileOption, (callback: any) => {
      if (callback.didCancel) {
        console.log("Cancelled image picker");
      } else if (callback.errorCode) {
        console.log(callback.errorCode, "~~~~");
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
  const callGalery = async () => {
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
        style={{
          height: HEIGHT / 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapView
          region={{
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          style={{ height: HEIGHT / 4.2, width: WIDTH / 2.3 }}
          mapType={"terrain"}
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
    let tempNum = "";
    if (Platform.OS == "android") {
      tempNum = `tel:${phoneNumber}`;
    } else {
      tempNum = `telprompt:${phoneNumber}`;
    }
    Linking.openURL(tempNum);
  };

  //Returns gifted chat UI along with header which contains the reciever name
  return (
    <>
      {/* Header component which shows reciever's name */}
      <View
        style={[styles.headerContainer, { justifyContent: "space-between" }]}
      >
        <TextComponent text={params?.item?.name} />
        {/* Modal for extra-text msg sharing */}
        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#ddd",
              height: WIDTH / 5,
              borderBottomEndRadius: 30,
              borderBottomStartRadius: 30,
            }}
          >
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                callGalery();
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
                getLocation();
              }}
            >
              <Image
                source={require("../../assets/images/locationIcon.png")}
                style={styles.locationIcon}
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
          </View>
        </Modal>
        {/* Modal for delete options */}
        <Modal
          visible={textSelectedModalVisible}
          animationType='fade'
          transparent={true}
          onRequestClose={() => {
            setTextSelectedModalVisible(false);
          }}
        >
          <TouchableOpacity>
          <Image
                source={require("../../assets/images/delete.png")}
                style={styles.deleteIcon}
          />
          </TouchableOpacity>
        </Modal>

        <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            justifyContent: "space-evenly",
            margin: 10,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image 
            source={require("../../assets/images/menuIcon.png")} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: "space-evenly",
            margin: 10,
          }}
          onPress={() => {
            setTextSelectedModalVisible(true);
          }}
        >
          <Image source={require("../../assets/images/delete.png")} style={styles.deleteIcon} />
        </TouchableOpacity>
        </View>
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
        // renderActions={(props: Readonly<ActionsProps>) => {
        //   return (
        //     <Actions
        //       {...props}
        //       options={{
        //         ["Share contact 📞"]: () => {
        //           getContacts();
        //         },
        //         ["Share location 🧭"]: () => {
        //           getLocation();
        //         },
        //         ["Send photos from gallery 📷"]: () => {
        //           callGalery(messages);
        //         },
        //       }}
        //       onSend={(args) => console.log(args)}
        //     />
        //   );
        // }}
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
                      callCamera();
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
              <Bubble
                {...props}
                user={{ _id: params?.fromUserData[0]?.id }}
                onLongPress={() => {
                  chatOnLongPressed(currentMessage);
                }}
                wrapperStyle={{
                  right: {
                    width: WIDTH / 2,
                  },
                  left: {
                    width: WIDTH / 2,
                    backgroundColor: "#72f5c9",
                  },
                }}
                renderCustomView={() => {
                  return (
                    <View style={styles.mapContainer}>
                      <LocationView location={currentMessage.location} />
                      {/* Add time stamp here ..... */}
                      {/* <Text style={styles.timeStamp}>
                        {moment(currentMessage.createdAt).format("h:mm a")}
                      </Text> */}
                    </View>
                  );
                }}
              />
            );
          }
          // If message contains contact attribute, then share contact
          if (currentMessage.contact) {
            // If you want contact as a bubble, uncomment below snippet
            // return(
            //   <Bubble
            //     {...props}
            //     user={{_id: params?.fromUserData[0]?.id}}
            //     wrapperStyle={{
            //       left: {
            //         // width: WIDTH/2,
            //         padding: 6,
            //         backgroundColor: "#72f5c9",
            //       },
            //       right: {
            //         // width: WIDTH/2
            //         padding: 6
            //       }
            //     }}
            //     onLongPress={() => {
            //       chatOnLongPressed(currentMessage)
            //     }}
            //     renderCustomView={()=>{
            //       return (
            //         <View style={{justifyContent: 'center', alignItems: 'center', padding:3}}>
            //           <View style={[styles.contactContainer, { width: WIDTH / 2.2 }]}>
            //             <View style={styles.nameContainer}>
            //               <Text style={{ fontSize: 18, margin: 7 }}>
            //                 {currentMessage.contact.name}
            //               </Text>
            //               {/* Add time stamp here ..... */}
            //               {/* <Text style={styles.timeStamp}>
            //                 {moment(currentMessage.createdAt).format("h:mm a")}
            //               </Text> */}
            //             </View>
            //             <TouchableOpacity
            //               style={styles.numberContainer}
            //               onLongPress={() => {
            //                 openDialPad(currentMessage.contact.contactNumber);
            //               }}
            //             >
            //               <Text style={{ color: "blue" }}>
            //                 {currentMessage.contact.contactNumber}
            //               </Text>
            //             </TouchableOpacity>
            //           </View>
            //         </View>
            //       );
            //     }}
            //   />
            // )
            // And remove below code
            return (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 3,
                }}
                onLongPress={() => {
                  chatOnLongPressed(currentMessage);
                }}
              >
                <View style={[styles.contactContainer, { width: WIDTH / 2.2 }]}>
                  <View style={styles.nameContainer}>
                    <Text style={{ fontSize: 18, margin: 7 }}>
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
    flexDirection: "row",
  },
  mapContainer: {
    backgroundColor: "#c0c0c0",
    padding: 7,
    borderRadius: 10,
    margin: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    height: 60,
    width: 60,
  },
  galleryIcon: {
    height: 20,
    width: 20,
  },
  locationIcon: {
    height: 40,
    width: 40,
    marginLeft: 18,
  },
  contactIcon: {
    height: 60,
    width: 60,
  },
  messageIcon: {
    height: 30,
    width: 30,
    margin: 5,
  },
  deleteIcon: {
    height: 30, 
    width: 30
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
    marginTop: 4,
  },
});

export default ShowChat;