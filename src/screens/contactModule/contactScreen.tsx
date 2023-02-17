import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import Contacts from "react-native-contacts";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainNavigatorType } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { push, ref } from "firebase/database";
import { db } from "../../../firebase-config";
import { useRoute } from "@react-navigation/native";

const ShowContact = () => {
  
  const route = useRoute();
  const [contacts, setContacts] = React.useState([]);
  const navigation = useNavigation<NativeStackNavigationProp<MainNavigatorType>>();
  const params: any = route.params;

  React.useEffect(() => {
    Contacts.getAll().then((contacts: any) => {
      setContacts(contacts);
    });
  }, []);

  const getContactOnFB = React.useCallback((contact: any) => {
    console.log('contact ka object =-=-=->', contact);
    
    const myMsg = {
      _id: uuid.v4(),
    };
    const msg = {
      ...myMsg,
      createdAt: new Date().getTime(),
      contact: {
        name: contact?.item?.displayName,
        contactNumber: contact?.item?.phoneNumbers[0]?.number
      },
      user: {
        _id: params?.fromUserData[0]?.id,
        name: params?.fromUserData[0].name,
      },
    };
    push( ref( db, "/chat/personalMessages/" + params?.fromUserData[0]?.id + "/" + params?.item?.id + "/" ), { msg });
    push( ref( db, "/chat/personalMessages/" + params?.item?.id + "/" + params?.fromUserData[0]?.id + "/" ), { msg });
    console.log(msg);
  }, [])

  return (
    <FlatList
      data={contacts}
      renderItem={(item: any) => {
        return (
          <TouchableOpacity style={styles.contactContainer} onPress={() => {getContactOnFB(item); navigation.goBack()}} >
          <View>
            <View style={styles.placeholder}>
              <Text style={styles.txt}>{item?.item?.givenName[0]}</Text>
            </View>
          </View>
          <View style={styles.contactData}>
            <Text style={styles.name}>
              {item?.item?.givenName} {item?.item?.middleName && item.item?.middleName + ' '} 
              {item?.item?.familyName}
            </Text>
            <Text style={styles.phoneNumber}>
              {item?.item?.phoneNumbers[0]?.number}
            </Text>
          </View>
        </TouchableOpacity>
        );
      }}
      ListEmptyComponent={() => (<Text>No flatlist data</Text>)}
    />
  );
};

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
  },
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#7af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 25,
  },
  contactData: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  name: {
    fontSize: 22,
  },
  phoneNumber: {
    color: '#888',
    fontSize: 18
  }
})

export default ShowContact;