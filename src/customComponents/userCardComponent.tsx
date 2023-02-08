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
                <Image source = {require('../assets/images/messageIcon.png')} style = {{height: 20, width: 20}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#afbfbf',
        justifyContent: 'center',
        paddingLeft: 23,
    },
    userNameText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})