import React from "react";
import { render, fireEvent, screen } from '@testing-library/react-native';
import DatePickerComponent from "../datePicker";

const showDatePicker = jest.fn();

describe('tests for datePicker component', () => {
    it('should render okay', () => {
        render(<DatePickerComponent />)
        const dateComponent = screen.getByTestId('customDatePicker');
        
        expect(dateComponent).toBeDefined();
        expect(dateComponent).not.toBeNull();
    });
    it('should call showDatePicker', () => {
        render(<DatePickerComponent />);
        const touchableDate = screen.getByTestId('custom-datepicker-touchableopacity');

        fireEvent.press(touchableDate);
        
        expect(showDatePicker).toBeCalledTimes(0);
        // Update the date string while running test again
        expect(touchableDate.props.children[0].props.children).toBe('3/1/2023');
    })
})