import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import PhoneSigninScreen from "../screens/signedInModule/signInWithPhoneScreen";

function renderWithNavigation(renderComponent: any) {
    return render(<NavigationContainer>{renderComponent}</NavigationContainer>);
}

jest.mock('@react-native-firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn()
}));

describe('Phone signin screen should render okay!', () => {
    it('should render okay', ()=>{
        const tree = renderWithNavigation(<PhoneSigninScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should display const text', ()=>{
        const tree = renderWithNavigation(<PhoneSigninScreen />);
        const defaultText = tree.getByTestId('const-txt');

        expect(defaultText.props.children).toBe('Please enter your credentials:');
    });
    it('should have textInput', () => {
        const tree = renderWithNavigation(<PhoneSigninScreen />)
        const numInput = tree.getByTestId('phone-input');
        expect(numInput.props.placeholder).toBe('Enter your phone number');
    });
    it('should call generate OTP function', () => {
        const tree = renderWithNavigation(<PhoneSigninScreen />)
        const btn =  tree.getByTestId('otp_generator');
        const generateOTP = jest.fn();

        fireEvent.press(btn);

        expect(btn).toBeDefined();
        ()=>{
            expect(generateOTP).toBeCalledTimes(1);
        }
    });
    it('should render otp textInput', ()=>{
        const tree = renderWithNavigation(<PhoneSigninScreen />);
        const btn = tree.getByTestId('otp_generator');

        fireEvent.press(btn);
        () => {
            const otpInput = tree.getByTestId('otp-input');
            
            expect(otpInput.props.placeholder).toBe('Enter the OTP')
        }
    });
    it('should have signin btn and signup btn', ()=>{
        const tree = renderWithNavigation(<PhoneSigninScreen/>);
        const submitBtn = tree.getByTestId('sign_in_with_email');
        const signupBtn = tree.getByTestId('sign_up');
        
        expect(submitBtn).not.toBeNull();
        expect(signupBtn).not.toBeNull();
        expect(submitBtn).toBeDefined();
        expect(signupBtn).toBeDefined();
    });
})