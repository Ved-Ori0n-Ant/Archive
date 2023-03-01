import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import{TouchableOpacity, View, Text, ViewStyle, StyleProp} from 'react-native';

type DatePickerComponentProp = {
    style? : StyleProp<ViewStyle>
    testID?: string
}

const DatePickerComponent = (prop: DatePickerComponentProp) => {
    const [date, setDate] = useState(new Date())

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate)
    }

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: "date",
        })
    }

    return(
        <View style = {prop.style} testID={prop.testID || 'customDatePicker'}>
            <TouchableOpacity testID="custom-datepicker-touchableopacity" onPress={showDatePicker}>
                <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default DatePickerComponent