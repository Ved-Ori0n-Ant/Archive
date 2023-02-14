import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'

type UserCardComponentProp = {
    userName?: string
    containerStyle?: StyleProp<ViewStyle>
}

export const UserCardComponent = (prop: UserCardComponentProp) => {
    const {containerStyle} = prop
    return(
        <View style = {[styles.cardContainer, containerStyle]}>
            <View style = {{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 13}}>
                <Text style={styles.userNameText}>{prop.userName}</Text>
                <Image source = {require('../assets/images/messageIcon.png')} style = {{height: 25, width: 25}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#afbfbf',
        justifyContent: 'center',
        padding: 23,
    },
    userNameText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    lastMsg: {
        fontSize: 10,
        fontWeight: '500',
        alignSelf: 'baseline'
    }
})