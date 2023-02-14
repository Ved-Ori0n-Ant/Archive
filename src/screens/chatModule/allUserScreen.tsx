import React from "react";
import TextComponent from "../../customComponents/textComponent";
import { FlatList, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { UserCardComponent } from "../../customComponents/userCardComponent";
import { onValue, ref } from "firebase/database";
import { db } from "../../../firebase-config";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainNavigatorType } from "../../../App";
import auth from "@react-native-firebase/auth";

//Screen function component
const ShowAllUser = () => {
  const route = useRoute();
  // const params: any = route.params;

  const userEmail = auth().currentUser?.email;
  const userPhoneNum = auth().currentUser?.phoneNumber;
  const [data, setData] = React.useState<any>([]); //Flatlist data
  const [fromUserData, setFromUserData] = React.useState<any>([]); //Stores data brought from which user
  const [toUserData, setToUserData] = React.useState<any>([]); //Stores data of the user to whom the data is to be sent

  const navigation =
    useNavigation<NativeStackNavigationProp<MainNavigatorType>>();

  // getting temp data from user collection and fetching current user as from-user-data
  React.useEffect(() => {
    onValue(ref(db, "/user/"), (querySnapShot: any) => {
      let temp: any = querySnapShot.val();
      let tempSpreader: any = { ...temp };
      setFromUserData(
        Object.values(tempSpreader).filter(
          (item: any) => item.email == userEmail || item.phoneNumber == userPhoneNum
        )
      );
      setData(
        Object.values(tempSpreader).filter(
          (item: any) => item.email !== userEmail
        )
      );
    });
  }, [userEmail]);

  const moveToChat = async (item: any) => {
    try {
      setToUserData(
        Object.values(data).filter((e: any) => e.name === item?.name)
      );
      navigation.navigate("Chatting Screen", { item, fromUserData });
    } catch (err: any) {
      console.log(err.message, "err message");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#acacac0a" }}>
      <View style={styles.header}>
        <TextComponent text="All available users" />
        <TouchableOpacity onPress = {() => auth().signOut()}>
          <Image source={require('../../assets/images/logOut.png')} style = {{height: 27, width: 27, margin: 7}} />
        </TouchableOpacity>
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
                userName={item?.item?.name || item?.item?.phoneNumber}
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
    backgroundColor: "#acacac0a",
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
    justifyContent: "space-between",
    flexDirection: 'row'
  },
});

export default ShowAllUser;
