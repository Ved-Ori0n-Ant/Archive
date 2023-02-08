import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import database, { firebase } from "@react-native-firebase/database";
import { UserCardComponent } from "../../customComponents/userCardComponent";
import { onValue, ref, update } from "firebase/database";
import { db } from "../../../firebase-config";
import TextComponent from "../../customComponents/textComponent";
// import { useNavigation } from "@react-navigation/native";

interface Navgation {
    navigate(destination?: string, params?: any): void;
}

const ShowAllUser = ({ navigation }: { navigation: Navgation }) => {

    const [data, setData] = React.useState<any>([])
    let fromUserData: any, toUserData: any, tempData: any;

    
    React.useEffect(() => {
        return onValue(ref(db, '/user/'), (querySnapShot: any) => {
            tempData = querySnapShot.val();
            // fromUserData = tempData.filter(tempData.item.)
            setData(Object.values(tempData));
            console.log(data, 'newData')
        });
    }, [])

    const moveToChat = () => {

        // update(ref(db, 'chat/' + toUserData.item.id + '/' + fromUserData.item.id), {})
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
            console.log(item, '------item values')
            return (
                <TouchableOpacity onPress={() => {moveToChat()}}>
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