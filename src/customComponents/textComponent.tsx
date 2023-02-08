import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

type TextComponentProp = {
    containerStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    text?: string
}

const TextComponent = (props: TextComponentProp) => {
    const {containerStyle, textStyle, text} = props
    return(
        <View style = {[styles.textContainer, containerStyle]}>
            <Text style = {[styles.textStyle, textStyle]}>
                {text || 'TextComponent'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        // backgroundColor: '#ebe4ff',
        margin: 5,
        padding: 3,
    },
    textStyle: {
        fontSize: 22,
        color: 'black',
        textDecorationLine: 'underline'
    },
});

export default TextComponent