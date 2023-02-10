import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { UserCardComponent } from "../../customComponents/userCardComponent";
import { onValue, ref, update } from "firebase/database";
import { db } from "../../../firebase-config";
import TextComponent from "../../customComponents/textComponent";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

// Navigation
// interface Navgation {
//   navigate(destination?: string, params?: any): void;
// }


//Screen function component
const ShowAllUser = () => {

  const route = useRoute();
  const params: any = route.params;

  const [data, setData] = React.useState<any>([]); //Flatlist data
  const [fromUserData, setFromUserData] = React.useState<any>([]); //Stores data brought from which user
  const [toUserData, setToUserData] = React.useState<any>([]); //Stores data of the user to whom the data is to be sent
  const [tempData, setTempData] = React.useState<any>([]); //Temporary storage for all user values

  const navigation = useNavigation();

  // getting temp data from user collection and fetching current user as from user data
  React.useEffect(() => {
    onValue(ref(db, "/user/"), (querySnapShot: any) => {
      let temp: any = querySnapShot.val();
      let tempSpreader: any = { ...temp };
      setTempData(tempSpreader);
      setFromUserData(
        Object.values(tempData).filter(
          (item: any) => item.email == params.email
        )
      );
    });
  }, [data]);

  // this data will be displayed on screen
  React.useEffect(() => {
    setData(
      Object.values(tempData).filter((item: any) => item.email !== params.email)
    );
  }, [params?.email]);

  const moveToChat = async (item: any) => {
    try {
      let fromUser = {
        name: await fromUserData[0]?.name,
        email: await fromUserData[0]?.email,
        id: await fromUserData[0]?.id,
      };

      let toUser = {
        name: await toUserData[0]?.name,
        email: await toUserData[0]?.email,
        id: await toUserData[0]?.id,
      };
      setToUserData(
        Object.values(tempData).filter((e: any) => e.name === item?.name)
      );
      await update(
        ref(db, "/chatlist/" + toUserData[0]?.id + "/" + fromUserData[0]?.id),
        fromUser
      );
      await update(
        ref(db, "/chatlist/" + fromUserData[0]?.id + "/" + toUserData[0]?.id),
        toUser
      );
      navigation.navigate(
        "Chatting Screen" as never,
        { item, fromUserData } as never
      );
    } catch (err: any) {
      console.log(err.message, 'err message');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#acacac" }}>
      <View style={styles.header}>
        <TextComponent text="All available users" />
      </View>
      <FlatList
        data={data}
        renderItem={(item: any) => {
          return (
            <TouchableOpacity
              onPress={() => {
                moveToChat(item?.item);
              }}
            >
              <UserCardComponent
                userName={item?.item?.name}
                containerStyle={styles.cardContainer}
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