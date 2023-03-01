import React from "react";
import TextInputComponent from "../textInputComponent";
import { render, cleanup, fireEvent, screen } from '@testing-library/react-native';

describe('Tests on textInputComponent', () => {
    it('should render okay', () => {
        render(<TextInputComponent />)
        const customTextInput = screen.getByTestId('text-input')

        expect(customTextInput).toBeDefined();
        expect(customTextInput.props.placeholder).toBe('Enter your value');
    });
    it('should update the input values', () => {
        render(<TextInputComponent />)
        const inputString = screen.getByTestId('text-input')

        expect(inputString.props.value).toBe('glibberish data')
    })
})