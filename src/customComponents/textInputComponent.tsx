import React from "react";
import { KeyboardTypeOptions } from "react-native";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from 'react-native';
// import { TextInput } from 'react-native-paper';

type TextInputComponentProps = {
    placeholderText?: string
    textStyle? : StyleProp<TextStyle>
    containerStyle? : StyleProp<ViewStyle>
    isTextPassword?: boolean
    value?: string
    onChangeText?: (value: string) => void
    keyboardType?: KeyboardTypeOptions
    onEndEditing?: any
    testID?: string
    // lable?: string
}

const TextInputComponent = (prop: TextInputComponentProps) => {
    const {placeholderText, textStyle, containerStyle, isTextPassword, value, onChangeText, keyboardType, onEndEditing, testID} = prop
    return(
        <View style = {[styles.containerStyle, containerStyle]}>
            <TextInput 
                style = {[styles.textStyle, textStyle]}
                secureTextEntry = {isTextPassword}
                placeholder = {placeholderText || 'Enter your value'}
                value = {value || 'glibberish data'}
                onChangeText = {onChangeText}
                keyboardType = {keyboardType || 'email-address'}
                onEndEditing = {onEndEditing}
                testID = {testID || 'text-input'}
                // label = {placeholderText}
                // mode = {"outlined"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        fontWeight: '300',
        // fontStyle: 'italic',
        // backgroundColor: '#f778ba4c',
        // borderRadius: 10, 
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    containerStyle: {
        // backgroundColor: '#ebe4f5',
        // height: '18.4%'
    },
})

export default TextInputComponent