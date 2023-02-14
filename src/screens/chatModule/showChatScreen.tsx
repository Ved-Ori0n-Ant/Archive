import React from "react";
import { Bubble, GiftedChat, InputToolbar, Send } from "react-native-gifted-chat";
import { push, ref } from "firebase/database";
import database from "@react-native-firebase/database";
import { db } from "../../../firebase-config";
import { useRoute } from "@react-navigation/native";
import { Image, TouchableOpacity, View, StyleSheet } from "react-native";
import TextComponent from "../../customComponents/textComponent";
import { CameraOptions, launchCamera, launchImageLibrary } from "react-native-image-picker";
import uuid from 'react-native-uuid'

const ShowChat = () => {
  const [messages, setMessages] = React.useState<any>([]);
  const route = useRoute();
  const params: any = route.params;
  const fileOption: CameraOptions = {mediaType: 'photo'}
  const msgRef = database().ref(
    "/chat/personalMessages/" +
      params?.fromUserData[0]?.id +
      "/" +
      params?.item?.id +
      "/"
  );

  React.useEffect(() => {
    const subscribe = msgRef.on("value", (snapshot) => {
      let tempArray: any[] = [];
      let tempSpreader: any = { ...snapshot.val() };
      let tempIdStripped: any = Object.values(tempSpreader);
      tempIdStripped.forEach((singleMsg: any) => {
        tempArray.push(singleMsg.msg);
      });
      tempArray.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      setMessages(tempArray);
    });
    return () => {
      msgRef.off("value", subscribe);
    };
  }, []);


  const callCamera = async(m: any[]) => {
    await launchCamera(fileOption, (callback: any) => {
      if (callback.didCancel) {
        console.log("Cancelled image picker");
      } else if (callback.errorCode) {
        console.log(callback.errorCode);
      } else if (callback.assets) {
        // console.log("Uri from camera", callback.assets[0].uri);
        onSendImage(callback?.assets[0]?.uri);
      } else {
        console.log(callback);
      }
    });
  };

  const callGalery = async (m: any[]) => {
    await launchImageLibrary(fileOption, (callback: any) => {
      if (callback.didCancel) {
        console.log("Cancelled image picker");
      } else if (callback.errorCode) {
        console.log(callback.errorCode);
      } else if (callback.assets) {
        // console.log("Uri from galery", callback.assets[0].uri);
        onSendImage(callback.assets[0].uri);
      } else {
        console.log(callback);
      }
    });
  };

  // const renderActions = (props: Readonly<ActionsProps>) => {
  //   return (
  //     <Actions
  //       {...props}
  //       options={{
  //         ["Select image"]: callGalery,
  //       }}
  //       onSend={args => console.log(args)}
  //     />
  //   );
  // }

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
    push( ref( db, "/chat/personalMessages/" + params?.fromUserData[0]?.id + "/" + params?.item?.id + "/" ), { msg });
    push( ref( db, "/chat/personalMessages/" + params?.item?.id + "/" + params?.fromUserData[0]?.id + "/" ), { msg });
    console.log(msg);
  }, []);

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
    push( ref( db, "/chat/personalMessages/" + params?.fromUserData[0]?.id + "/" + params?.item?.id + "/" ), { msg });
    push( ref( db, "/chat/personalMessages/" + params?.item?.id + "/" + params?.fromUserData[0]?.id + "/" ), { msg });
    console.log(msg);
  }, []);

  return (
    <>
      <View
        style={styles.headerContainer}
      >
        <TextComponent text={params?.item?.name} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => {
          onSend(messages);
        }}
        // renderActions={renderActions}
        renderInputToolbar={(props: any) => {
          return ( 
            <InputToolbar {...props}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style = {styles.iconContainer} onPress = {() => {callCamera(messages)}} >
                  <Image source = {require('../../assets/images/cameraIcon.png')} style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.iconContainer} onPress = {() => {callGalery(messages)}} >
                  <Image source = {require('../../assets/images/gallery.png')} style={styles.galleryIcon} />
                </TouchableOpacity>
                <Send {...props}>
                  <View style = {styles.iconContainer}>
                    <Image source = {require('../../assets/images/messageIcon.png')} style={styles.messageIcon} />
                  </View>
                </Send>
              </View>
            </InputToolbar>
          );
        }}
        user={{ _id: params?.fromUserData[0]?.id }}
        isLoadingEarlier
        alwaysShowSend
        renderBubble={(props: any) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#70a0f0",
                },
                left: {
                  backgroundColor: "#72f5c9",
                  marginLeft: -4
                },
              }}
            />
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
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIcon: {
    height:48, 
    width:60
  },
  galleryIcon: { 
    height: 20, 
    width: 20, 
    marginRight: 5 
  },
  messageIcon: {
    height:30, 
    width:30, 
    margin: 5
  }
});

export default ShowChat;