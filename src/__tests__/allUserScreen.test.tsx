import React from 'react';
import ShowAllUser from '../screens/chatModule/allUserScreen';
import { cleanup, render, fireEvent, screen } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect';
import { NavigationContainer } from "@react-navigation/native";
import * as ReactNative from 'react-native';
import { jest } from '@jest/globals';

afterEach(cleanup);

function renderWithNavigation(renderComponent: any){
    return(render(<NavigationContainer>{renderComponent}</NavigationContainer>));
}


jest.doMock('react-native', () => {
  return Object.setPrototypeOf(
    {
      Platform: {
        OS: 'android',
        select: () => {},
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNFBAnalyticsModule: {
          logEvent: jest.fn(),
        },
        RNFBAppModule: {
          NATIVE_FIREBASE_APPS: [
            {
              appConfig: {
                name: '[DEFAULT]',
              },
              options: {},
            },

            {
              appConfig: {
                name: 'secondaryFromNative',
              },
              options: {},
            },
          ],
          FIREBASE_RAW_JSON: '{}',
          addListener: jest.fn(),
          eventsAddListener: jest.fn(),
          eventsNotifyReady: jest.fn(),
          removeListeners: jest.fn(),
        },
        RNFBAuthModule: {
          APP_LANGUAGE: {
            '[DEFAULT]': 'en-US',
          },
          APP_USER: {
            '[DEFAULT]': 'jestUser',
          },
          addAuthStateListener: jest.fn(),
          addIdTokenListener: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBCrashlyticsModule: {},
        RNFBDatabaseModule: {
          on: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBFirestoreModule: {
          settings: jest.fn(),
          documentSet: jest.fn(),
        },
        RNFBMessagingModule: {
          onMessage: jest.fn(),
        },
        RNFBPerfModule: {},
        RNFBStorageModule: {
          useEmulator: jest.fn(),
        },
      },
    },
    ReactNative,
  );
});

jest.mock("@react-native-firebase/auth", () => ({
    auth: {currentUser: () => jest.fn().mockReturnValue({
        email: 'abc@def.ghi',
        phoneNumber: '+12 1212121212',
    })}
}));

jest.mock('@react-native-firebase/database', () => ({
    database: () => {},
    ref: () => jest.fn(),
    set: () => jest.fn(),
    remove: () => jest.fn(),
    update: () => jest.fn(),
    once: () => jest.fn(),
    on: () => jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useRoute: () => ({route: jest.fn()}),
}))

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    dispatch: mockedNavigate,
  }),
}));



describe('allUserScreen tests', () => {
    it('it should render okay', () => {
        const tree = renderWithNavigation(<ShowAllUser />)
        expect(tree.toJSON()).toMatchSnapshot();
    });
    it('should render FlatList', () => {
        const tree = renderWithNavigation(<ShowAllUser />)
        const flatList = tree.getByTestId('Flat_list');

        expect(flatList.props).not.toBeNull();
        expect(flatList.props.data.length).toBe(1)
    });
    it('should render logout button', () => {
        const tree = renderWithNavigation(<ShowAllUser />)
        const logOutBtn = tree.getByTestId('Logout_btn');

        expect(logOutBtn).not.toBeNull();
    });
})