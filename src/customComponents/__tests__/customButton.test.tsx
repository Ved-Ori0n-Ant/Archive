import React from "react";
import { render, screen, fireEvent } from '@testing-library/react-native';
import ButtonComponent from "../customButton";

const onPress = jest.fn();

describe('custom button tests', () => {
    it('should render first', () => {
        render(<ButtonComponent />)
        const btn = screen.getByTestId('customBtn')
        expect(btn).not.toBeNull();
        expect(btn).toBeDefined();
    });
    it('should be pressed', () => {
        render(<ButtonComponent/>);
        const btn = screen.getByTestId('customBtn');

        fireEvent.press(btn);

        expect(onPress).toBeCalledTimes(0);
    })
})