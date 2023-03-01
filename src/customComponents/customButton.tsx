import React from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, View, StyleSheet } from "react-native";

type ButtonComponentProps = {
    text? : string
    style? : StyleProp<ViewStyle>
    textStyle? : StyleProp<TextStyle>
    onPress? : () => void
    testID?: string
}

const ButtonComponent = (props: ButtonComponentProps) => {
    const {text, style, textStyle, onPress, testID} = props
    return(
        <TouchableOpacity onPress = {onPress} testID={testID || 'customBtn'}>
            <View style = {[styles.button, style]}>
                <Text style = {[styles.buttonText, textStyle]}>{text || 'CustomButton'}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#c0c0c0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#00fc',
        marginHorizontal: 15,
        padding: 7,
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 10,
        // width: '80%',
    },
})

export default ButtonComponent