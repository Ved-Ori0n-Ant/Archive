import React from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import database from '@react-native-firebase/database'
import { onValue, push, ref } from 'firebase/database';
import { db } from '../../../firebase-config';
const ShowChat = (props: any) => {
    
    const [messages, setMessages] = React.useState<any>([]);

    // const {data} = props.route.params;
    // console.log(data.item, 'toUserData', data.fromUserData[0], 'routed data')


    React.useEffect(() => {
        // const querySnapShot = database().ref('chat/personalMessages').orderByValue().once('value')
        onValue(ref(db, '/chat/personalMessages'), (querySnapShot: any) => {
            console.log('line 17......................')
            let primeTemp: any = querySnapShot.val()
            console.log(primeTemp,  '............database value once read')
            let secondaryTemp: any = {...primeTemp}
            console.log(secondaryTemp,  '............database value once read')
            let tertiaryTemp: any = Object.values(secondaryTemp)
            console.log(tertiaryTemp, '............database value once read')
            let val: any = tertiaryTemp[0]
            console.log(val, '............database value once read')
        })
    }, [])

    const onSend = (messageArray: any) => {
        const myMsg = messageArray[0]
        const msg = {
            ...myMsg, 
            recieverId: 'data.item.id', 
            senderId: 'data.fromUserData[0].id', 
        }
        console.log(msg)
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messageArray))
        push(ref(db, '/chat/personalMessages'), { msg })
    }
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{ _id: 'data.fromUserData[0].id' }}
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