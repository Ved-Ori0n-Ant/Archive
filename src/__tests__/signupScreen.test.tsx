import React from "react";
import { cleanup, render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from "@react-navigation/native";
import SecondaryScreen from "../screens/signUpModule/signUpScreen";

afterEach(cleanup);

jest.mock('@react-native-firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()
}));

jest.mock('firebase/app', () => ({
    // ...jest.requireActual('firebase/app'),
    initializeApp: () => ({app: jest.fn()}),
}));

jest.mock('firebase/database', () => ({
    getDatabase: () => ({db: jest.fn()}),
    ref: jest.fn(),
    push: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    dispatch: mockedNavigate,
  }),
}));

jest.mock('@react-native-firebase/database', () => ({
  database: () => jest.fn(),
  ref: () => jest.fn(),
  set: () => jest.fn(),
  remove: () => jest.fn(),
  update: () => jest.fn(),
  once: () => jest.fn(),
  on: () => jest.fn(),
}));

jest.mock('@react-native-firebase/storage', () => ({
  storage: jest.fn()
}))


describe('sign up renders okay', () => {
    it('should render fine', () => {
      const tree = render(
      <NavigationContainer>
        <SecondaryScreen />
      </NavigationContainer>
      );
      expect(tree.toJSON()).toMatchSnapshot();
    })
    it('should render all text inputs', () => {
      const tree = render(
        <NavigationContainer>
            <SecondaryScreen />
        </NavigationContainer>
      );
      const emailInput = screen.getByTestId('email-input')
      const nameInput = tree.getByTestId('name-input')
      const phoneNumInput = tree.getByTestId('number-input')
      const passwords = tree.getAllByTestId('pass-input')

      expect(emailInput).not.toBeNull();
      expect(nameInput).not.toBeNull();
      expect(phoneNumInput).not.toBeNull();
      expect(passwords).not.toBeNull();

      expect(emailInput.props.placeholder).toBe('Enter your email');
      expect(nameInput.props.placeholder).toBe('Enter your name');
      expect(phoneNumInput.props.placeholder).toBe('Enter your phone number');
      expect(passwords[0].props.placeholder).toBe('Enter your password');
      expect(passwords[1].props.placeholder).toBe('Confirm your password');
    });
    it('should render clear and signup buttons',() => {
      const tree = render(
        <NavigationContainer>
          <SecondaryScreen />
        </NavigationContainer>
      );

      const clearBtn = tree.getByTestId('clear_btn');
      const submitBtn = tree.getByTestId('submit_btn');

      expect(clearBtn.props.children).toBeDefined();
      expect(submitBtn.props.children).toBeDefined();
    });
    it('clear btn should call clearPressed', () => {
      const tree = render(
        <NavigationContainer>
          <SecondaryScreen />
        </NavigationContainer>
      );

      const clearInputs = jest.fn();
      const clearBtn = tree.getByTestId('clear_btn');

      fireEvent.press(clearBtn);
      // If touchables could be pressed then number of calls made would be one
      expect(clearInputs).toBeCalledTimes(0);
    });
    it('should have goBack function', () => {
      const tree = render(
        <NavigationContainer>
          <SecondaryScreen />
        </NavigationContainer>
      );

        const moveToSignIn = tree.getByTestId('Move_TO_Signin');
        const temp = moveToSignIn.props.children;

        expect(moveToSignIn).toBeDefined();
        expect(temp[0].props.text).toBe('Already have an account?')
    });
    it('should have image picker component', () => {
      const tree = render(
        <NavigationContainer>
          <SecondaryScreen />
        </NavigationContainer>
      );

      const imagePicker = tree.getByTestId('profile-pic')

      expect(imagePicker.props.children).toBeDefined();
    });
    it('should have date picker component', () => {
      const tree = render(
        <NavigationContainer>
          <SecondaryScreen />
        </NavigationContainer>
      );

      const datePicker = tree.getByTestId('D_O_B')

      expect(datePicker.props.children).toBeDefined();
    });
})