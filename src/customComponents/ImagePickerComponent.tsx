import React, { useState } from "react";
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle, Image, Alert, ImageProps } from "react-native";
import ButtonComponent from "./customButton";
import { CameraOptions, launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from 'react-native-image-picker';

type ImagePickerComponentProps = {
    fileOption: CameraOptions
    containerStyle?: StyleProp<ViewStyle>
    imageStyle?: StyleProp<ImageProps>
    buttonStyle?: StyleProp<ViewStyle>
    buttonTextStyle?: StyleProp<TextStyle>
    testID?: string
}

const ImagePickerComponent = (prop: ImagePickerComponentProps) => {
    const {fileOption, containerStyle, imageStyle, buttonStyle, buttonTextStyle, testID} = prop

    const [isClicked, setIsClicked] = useState(false)
    const [imagePath, setImagePath] = useState('')

    const storage = () => {
        launchImageLibrary(fileOption, callback => {
            if(callback.didCancel) {
                Alert.alert('Cancelled image picker')
            } else if(callback.errorCode) {
                console.log(callback.errorCode)
            } else if(callback.assets) {
                console.log(callback.assets)
                setImagePath(callback.assets[0].uri!)
                setIsClicked(false)
            } else {
                console.log(callback)
            }
        })
    }

    const camera = () => {
        launchCamera(fileOption, callback => {
            if(callback.didCancel) {
                Alert.alert('Canclled image picker')
            } else if(callback.errorCode){
                console.log(callback.errorCode)
            } else if(callback.assets) {
                console.log(callback.assets)
                setImagePath(callback.assets[0].uri!)
                setIsClicked(false)
            } else {
                console.log(callback)
            }
        })
    }

    return(
        <View testID={testID || 'image-picker'}>
            {isClicked ? 
                (<>
                <View style = {[styles.containerStyle, containerStyle]}>
                    <ButtonComponent testID="cam_btn" text='Open Camera' onPress = {() => camera()} style = {buttonStyle} textStyle = {styles.buttonText} />
                    <ButtonComponent testID="gallery_btn" text='From Gallery' onPress = {() => storage()} style = {buttonStyle} textStyle = {styles.buttonText} />
                </View>
                </>) 
            : 
                (<>
                <View style= {{alignItems: 'baseline'}}>
                    <ButtonComponent testID="image_upload" text='Upload image' onPress={() => setIsClicked(true)} style = {buttonStyle} textStyle = {{fontSize: 8}} />
                </View>
                </>)
            }
            {imagePath !== '' ? 
                (
                    <View style = {styles.imgContainer}>
                        <Image testID="image" source = {{uri: imagePath}} style={[styles.imageStyle, imageStyle]}/>
                    </View>
                )
                :
                (null)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 180,
        width: 180
    },
    containerStyle: {
        // backgroundColor: '#ebe4f5',
        borderColor: 'black',
        // borderWidth: 0.5,
        borderRadius: 10,
        flexDirection: 'row',
        margin: 7,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 8,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    imgContainer: {
        margin: 5,
        padding: 5,
    }
})

export default ImagePickerComponent