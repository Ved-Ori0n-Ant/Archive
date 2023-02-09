import React from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { UserCardComponent } from "../../customComponents/userCardComponent";
import { onValue, push, ref, update } from "firebase/database";
import { db } from "../../../firebase-config";
import TextComponent from "../../customComponents/textComponent";
import uuid from "react-native-uuid";
import { useRoute } from "@react-navigation/native";
import navigation from "../../../srcForChatting/utils/sevices/navigation";
import { CURRENT_USER_NAME } from "../signedInModule/signInScreen";
// import { useNavigation } from "@react-navigation/native";

let roomId = uuid.v4();

interface Navgation {
  navigate(destination?: string, params?: any): void;
}

const ShowAllUser = ({navigation}: {navigation: Navgation}) => {

  const [data, setData] = React.useState<any>([]);
  const [currentUserData, setCurrentUserData] = React.useState<any>([]);
  const [fromUserData, setFromUserData] = React.useState<any>([]);
  const [toUserData, setToUserData] = React.useState<any>([]);
  const [tempData, setTempData] = React.useState<any>([]);
  const [lastMsg, setLastMsg] = React.useState<string>("Loading.....");

  console.log(CURRENT_USER_NAME)

  React.useEffect(() => {
    return onValue(ref(db, "/user/"), (querySnapShot: any) => {
        let primeTemp = querySnapShot.val();
        let secondaryTemp = {...primeTemp}
        setTempData(secondaryTemp);
        console.log(tempData, "tempData");
        setFromUserData(
            Object.values(tempData).filter(
                (item: any) => item.name == "chatUserAlpha"
            )
        );
console.log("fromUser data", fromUserData);
    });
  }, [data]);

  React.useEffect(() => {
    setData(
      Object.values(tempData).filter(
        (item: any) => item.name !== "chatUserAlpha"
      )
    );
    console.log(data, "newData");
  }, []);

  React.useEffect(() => {
    onValue(ref(db, "/chatlist/"), (snapShot: any) => {
    //   console.log(fromUserData[0]?.id, "fromUser ni id");
      // console.log(toUserData[0].id, 'toUser ni id')
    //   console.log(Object.values(snapShot.val())[0], '---------------last message must be seen')
    })
  }, []);

  const moveToChat = async (item: any) => {
    try {
      let fromUser = {
        name: await fromUserData[0]?.name,
        email: await fromUserData[0]?.email,
        lastMsg: lastMsg,
        id: await fromUserData[0]?.id,
        roomId: roomId,
      };

      let toUser = {
        name: await toUserData[0]?.name,
        email: await toUserData[0]?.email,
        lastMsg: lastMsg,
        id: await toUserData[0]?.id,
        roomId: roomId,
      };
      console.log(fromUser, toUser, 'values.........')
      setToUserData(
        Object.values(tempData).filter((e: any) => e.name === item?.name)
      );
      // console.log(toUserData[0].id, '------touser-----', fromUserData[0].id, '-----fromuser-----' )
      await update(
        ref(db, "/chatlist/" + toUserData[0]?.id + "/" + fromUserData[0]?.id),
        fromUser
      );
      await update(
        ref(db, "/chatlist/" + fromUserData[0]?.id + "/" + toUserData[0]?.id),
        toUser
      );
      console.log({data: item}, 'to be routed...................')
      navigation.navigate("Chatting Screen", { item, fromUserData });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#acacac" }}>
      <View style={styles.header}>
        <TextComponent text="All available users" />
      </View>
      <FlatList
        data={data}
        // keyExtractor={(item) => item?.id}
        renderItem={(item: any) => {
          // console.log(item, '------item values')
          return (
            <TouchableOpacity
              onPress={() => {
                moveToChat(item?.item);
              }}
            >
              <UserCardComponent
                userName={item?.item?.name}
                containerStyle={styles.cardContainer}
                lastMsg={lastMsg}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#acacac",
    padding: 3,
    borderBottomWidth: 0.3,
    width: "100%",
    marginVertical: 2,
  },
  header: {
    backgroundColor: "#afcfcf",
    width: "100%",
    alignItems: "center",
    height: "8%",
    justifyContent: "center",
  },
});

export default ShowAllUser;