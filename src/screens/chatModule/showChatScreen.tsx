import React, { useCallback, useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { onValue, push, ref } from 'firebase/database';
import { db } from '../../../firebase-config';
import { useRoute } from '@react-navigation/native';
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
        onValue(ref(db, '/chat/personalMessages'), (querySnapShot: any) => {
            let temp: any = querySnapShot.val()
            let tempSpreader: any = {...temp}
            let tempIdStripped: any = Object.values(tempSpreader)
            let val: any = tempIdStripped[0]
            // setMessages([val])
            console.log(val, ':::::::::............value............:::::::::')
        })
    }, [])

    const onSend = useCallback((messageArray: any[]) => {
        const myMsg = messageArray[0]
        const msg = {
            ...myMsg, 
            recieverId: params?.item?.id, 
            senderId: params?.fromUserData[0]?.id, 
            user: {_id: params?.fromUserData[0]?.id, name: params?.fromUserData[0].name}
        }
        console.log(msg)
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages as any, messageArray))
        push(ref(db, '/chat/personalMessages'), { msg })
    }, [])

    console.log(messages, ':::::Messages::::: of user ', params?.fromUserData[0].name)
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{_id: params?.fromUserData[0]?.id}}
            renderBubble={(props: any) => {
                return (<Bubble {...props} wrapperStyle={{
                    right: {
                        backgroundColor: '#acacac',
                    },
                    left: {
                        backgroundColor: '#0af',
                    }
                }} />)
            }}
        />
    )
}

export default ShowChat