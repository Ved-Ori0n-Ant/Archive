import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'

type UserCardComponentProp = {
    userName?: string
    containerStyle?: StyleProp<ViewStyle>
}

const UserCardComponent = (prop: UserCardComponentProp) => {
    const {containerStyle} = prop
    return(
        <View style = {[styles.cardContainer, containerStyle]}>
            <View style = {{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 13}} testID='user-details'>
                <Text style={styles.userNameText}>{prop.userName || 'userName'}</Text>
                <Image source = {require('../assets/images/messageIcon.png')} style = {{height: 25, width: 25}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: 'center',
        padding: 23,
    },
    userNameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black'
    },
});

export default UserCardComponent;