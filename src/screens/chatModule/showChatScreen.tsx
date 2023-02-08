import React from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import database from '@react-native-firebase/database'
import { push, ref } from 'firebase/database';
import { db } from '../../../firebase-config';

const ShowChat = () => {
    const [messages, setMessages] = React.useState<any>([]);

    React.useEffect(() => {
        const querySnapShot = database().ref('chat/personalMessages').orderByValue().once('value')
        // console.log(querySnapShot)
    }, [])

    const onSend = (messageArray: any) => {
        const myMsg = messageArray[0]
        const msg = { ...myMsg, senderId: '', recieverId: '' }
        console.log(msg)
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messageArray))
        push(ref(db, '/chat/personalMessages'), { msg })
    }
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{ _id: 1 }}
            renderBubble={props => {
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