import React, { useCallback, useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { onValue, push, ref } from 'firebase/database';
import { db } from '../../../firebase-config';
import { useRoute } from '@react-navigation/native';
import { useWindowDimensions, View } from 'react-native';
import TextComponent from '../../customComponents/textComponent';
const ShowChat = () => {
    
    const [messages, setMessages] = React.useState<any>([]);
    const route = useRoute()
    const params: any = route.params

    // useEffect(() => {
    //     console.log('page rendered')
    // }, [])
    

    // const {ata} = props.route.params;
    // console.log(data.item, 'toUserData', data.fromUserData[0], 'routed data')


    React.useEffect(() => {
        onValue(ref(db, '/chat/personalMessages/' + params?.fromUserData?.id + params?.item?.id + '/'), (querySnapShot: any) => {
            let temp: any = querySnapShot.val()
            let tempSpreader: any = {...temp}
            let tempIdStripped: any = Object.values(tempSpreader)
            // console.log('Line 28..',tempIdStripped, 'of user', params?.fromUserData[0]?.name)
            setMessages([tempIdStripped])
        })
    }, [])

    const onSend = useCallback((messageArray: any[]) => {
        const myMsg = messageArray[0]
        console.log('myMsg', myMsg)
        const msg = {
            ...myMsg, 
            recieverId: params?.item?.id, 
            senderId: params?.fromUserData[0]?.id, 
            user: {_id: params?.fromUserData[0]?.id, name: params?.fromUserData[0].name}
        }
        console.log(msg)
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages as any, messageArray))
        push(ref(db, '/chat/personalMessages/' + params?.fromUserData?.id + params?.item?.id + '/'), { msg })
    }, [])

    // console.log(messages, ':::::Messages::::: of user ', params?.fromUserData[0].name)
    return (
      <>
        <View
          style={{
            backgroundColor: "#afcfcf",
            width: "100%",
            alignItems: "center",
            height: 'auto',
            maxHeight: 180,
            justifyContent: "center",
          }}
        >
          <TextComponent text={params?.fromUserData[0]?.name} />
        </View>
        <GiftedChat
          messages={messages}
          onSend={(messages) => {onSend(messages); console.log( 'line 64', params?.fromUserData[0]?.id)}}
          user={{ _id: params?.fromUserData[0]?.id }}
          isLoadingEarlier
          isTyping
          renderBubble={(props: any) => {
            return (
              <Bubble
                {...props}
                // wrapperStyle={{
                //   right: {
                //     backgroundColor: "#acacac",
                //   },
                //   left: {
                //     backgroundColor: "#0af",
                //   },
                // }}
              />
            );
          }}
        />
      </>
    );
}

export default ShowChat