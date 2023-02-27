import React from "react";
import { cleanup, render, fireEvent, screen } from '@testing-library/react-native'
import HomeScreen from "../screens/signedInModule/signInScreen";
import '@testing-library/jest-native/extend-expect';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from "@react-navigation/native";
// import firebase from '@react-native-firebase/app'

afterEach(cleanup);

jest.mock('@react-native-firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()
}));

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    dispatch: mockedNavigate,
  }),
}));

describe('Tests for signin screen', ()=>{
  it('should render correctly', () => {
    render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    const tree: any = screen;
    expect(tree.toJSON).toMatchSnapshot();
  });
  it('should have text', () => {
    const tree = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    )
    const defaultText: any = tree.queryByTestId('const-text');
    expect(defaultText.props.children).toBe('Please enter your credentials:')
  })
})

it('placeholder default values', () => {
  render(<HomeScreen />);
  const emailInput = screen.getByTestId('email-input');
  const passwordInput = screen.getByTestId('password-input');
  const submitBtn = screen.getByTestId('signin-btn');
  // const logInPressed = jest.fn();

  fireEvent.changeText(emailInput, 'abc@def.ghi')
  fireEvent.changeText(passwordInput, '121212')
  fireEvent.press(submitBtn)

  expect('abc@def.ghi').toBeDefined()
  expect('121212').toBeDefined()
  // expect(logInPressed).toBeCalled()
  expect(passwordInput.props.value).toBe('121212')
  expect(emailInput.props.value).toBe('abc@def.ghi')
})

it('All touchables should be defined', () => {
  const tree = render(
    <NavigationContainer>
      <HomeScreen/>
    </NavigationContainer>
  )
  const signinBtn = tree.getByTestId('signin-btn');
  const signinPhoneBtn = tree.getByTestId('signin_with_phone')
  const signUpBtn = tree.getByTestId('sign_up_btn')
  const signinBtnStatus = signinBtn.props.accessibilityState.disabled;
  const signinPhoneBtnStatus = signinPhoneBtn.props.accessibilityState.disabled;
  const signUpBtnStatus = signUpBtn.props.accessibilityState.disabled;

  expect(signinBtn).not.toBeNull();
  expect(signinPhoneBtn).not.toBeNull();
  expect(signUpBtn).not.toBeNull();
  expect(signinBtnStatus).toBe(false);
  expect(signinPhoneBtnStatus).toBe(false);
  expect(signUpBtnStatus).toBe(false);
})