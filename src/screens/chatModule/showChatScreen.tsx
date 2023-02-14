import React from "react";
import { Actions, Bubble, GiftedChat } from "react-native-gifted-chat";
import { push, ref } from "firebase/database";
import database from "@react-native-firebase/database";
import { db } from "../../../firebase-config";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native";
import TextComponent from "../../customComponents/textComponent";

const ShowChat = () => {
  const [messages, setMessages] = React.useState<any>([]);
  const route = useRoute();
  const params: any = route.params;
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
      console.log("Rerender");
      setMessages(tempArray);
    });
    return () => {
      msgRef.off("value", subscribe);
    };
  }, []);

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
    console.log(msg);
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
  }, []);

  return (
    <>
      <View
        style={{
          backgroundColor: "#afcfcf",
          width: "100%",
          alignItems: "flex-start",
          height: "auto",
          maxHeight: 180,
          justifyContent: "center",
        }}
      >
        <TextComponent text={params?.item?.name} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => {
          onSend(messages);
        }}
        user={{ _id: params?.fromUserData[0]?.id }}
        isLoadingEarlier
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
                },
              }}
            />
          );
        }}
      />
    </>
  );
};

export default ShowChat;