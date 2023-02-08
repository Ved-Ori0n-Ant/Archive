import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { UserCardComponent } from "../../customComponents/userCardComponent";
import { onValue, push, ref, update } from "firebase/database";
import { db } from "../../../firebase-config";
import TextComponent from "../../customComponents/textComponent";
import uuid from 'react-native-uuid';
// import { useNavigation } from "@react-navigation/native";

interface Navgation {
    navigate(destination?: string, params?: any): void;
}

const ShowAllUser = ({ navigation }: { navigation: Navgation }) => {

    const [data, setData] = React.useState<any>([])
    const [fromUserData, setFromUserData] = React.useState<any>([])
    const [toUserData, setToUserData] = React.useState<any>([])
    const [tempData, setTempData] = React.useState<any>([])
    
    React.useEffect(() => {
        return onValue(ref(db, '/user/'), (querySnapShot: any) => {
            setTempData(querySnapShot.val());
            // console.log(tempData, 'tempData')
            // fromUserData = tempData.filter(tempData.item.)
            setFromUserData(Object.values(tempData).filter((item: any) => item.name == 'chatUserAlpha'))
            // console.log('fromUser data', fromUserData)
            setData(Object.values(tempData).filter((item: any) => item.name !== 'chatUserAlpha' ));
            // console.log(data, 'newData')
        });
    }, [])

    let roomId = uuid.v4();

    let fromUser = {
        name: fromUserData[0].name,
        email: fromUserData[0].email,
        lastMsg: "",
        id: fromUserData[0].id,
        roomId: roomId,
    }

    let toUser = {
        name: toUserData[0].name,
        email: toUserData[0].email,
        lastMsg: '',
        id: toUserData[0].id,
        roomId: roomId,
    }

    const moveToChat = (name: any) => {

        setToUserData(Object.values(tempData).filter((e: any) => e.name === name))
        // console.log(toUserData[0].id, '------touser-----', fromUserData[0].id, '-----fromuser-----' )
        update(ref(db, '/chatlist/' + toUserData[0].id + '/' + fromUserData[0].id), (fromUser))
        update(ref(db, '/chatlist/' + fromUserData[0].id + '/' + toUserData[0].id), (toUser))
        navigation.navigate('Chatting Screen')
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#acacac", }}>
        <View style = {styles.header}>
            <TextComponent text="All available users" />
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={(item: any) => {
            // console.log(item, '------item values')
            return (
                <TouchableOpacity onPress={() => {moveToChat(item.item.name)}}>
                    <UserCardComponent userName={item.item.name} containerStyle = {styles.cardContainer} />
                </TouchableOpacity>
            );
          }}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: '#acacac',
        padding: 3,
        borderBottomWidth: 0.3,
        width: '100%',
        marginVertical: 2,
        height: 56
    },
    header: {
        backgroundColor: '#afcfcf',
        width: '100%',
        alignItems: 'center',
        height: '8%',
        justifyContent: 'center'
    },
})

export default ShowAllUser;