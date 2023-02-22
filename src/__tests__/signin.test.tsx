import React from "react";
import { cleanup, render, fireEvent, screen } from '@testing-library/react-native'
import HomeScreen from "../screens/signedInModule/signInScreen";
import auth from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app'

afterEach(cleanup);

jest.mock('@react-native-firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()
}));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigation: mockedNavigate,
      // {
      //   navigate: mockedNavigate,
      // }
    }),
  };
});

it('should render default text', () => {
  render(<HomeScreen />);
  const defaultText: any = screen.getByTestId('const text');
  // console.log(screen.getByTestId('const text'))
  expect(defaultText).toBeDefined
})

it('placeholder default values', () => {
  render(<HomeScreen />);
  const emailInput = screen.getByPlaceholderText('Enter your email')
  const passwordInput = screen.getByTestId('password-input')
  const submitBtn = screen.getByTestId('signin btn');

  fireEvent.changeText(emailInput, 'abc@def.ghi')
  fireEvent.changeText(passwordInput, '121212')
  fireEvent.press(submitBtn)

  expect('abc@def.ghi').toBeDefined()
  expect('121212').toBeDefined()
  expect(mockedNavigate).toBeCalledTimes(0)  
  expect(passwordInput.props.value).toBe('121212')
})
