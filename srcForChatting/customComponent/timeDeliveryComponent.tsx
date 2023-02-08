import moment from 'moment';
import { Icon } from 'native-base';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants/colors';

// create a component
const TimeDelivery = (props: any) => {
    const { sender, item } = props;
    return (
        <View
            style={[styles.mainView, {
                justifyContent: 'flex-end',
            }]}
        >
            <Text style={{
                fontFamily: 'Poppins-Regular', 
                fontSize: 7,
                color: sender ? COLORS.white : COLORS.black
            }}>
                {moment(item.send_time).format('LLL')}
            </Text>
                <Icon
                    name = {"checkmark-done"}
                    type = "Ionicons"
                    style = {item.seen? (styles.icon) : (styles.icon1)}
                />

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    icon: {color: COLORS.black , fontSize: 15, marginLeft: 5},
    icon1: {color: COLORS.white , fontSize: 15, marginLeft: 5},
});

//make this component available to the app
export default TimeDelivery;