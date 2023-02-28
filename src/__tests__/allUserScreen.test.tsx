import React from 'react';
import ShowAllUser from '../screens/chatModule/allUserScreen';
import { cleanup, render } from '@testing-library/react-native'
import { renderWithNavigation } from '../utils/renderWithNavigation';
import * as ReactNative from 'react-native';
// import { jest } from '@jest/globals';

afterEach(cleanup);

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

jest.mock('@react-native-firebase/auth', () => ({
  auth: jest.fn(() => ({
    currentUser: {
      email: 'abc@def.ghi',
      phoneNumber: '+11 1111111111',
    }
  }))
}))

jest.mock('@react-native-firebase/database', () => ({
    database: () => jest.fn(),
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

jest.mock('firebase/database', () => ({
  getDatabase: () => ({db: jest.fn()}),
  ref: jest.fn(),
  push: jest.fn(),
}));

describe('allUserScreen tests', () => {
    it('it should render okay', () => {
      const tree = renderWithNavigation(<ShowAllUser />).toJSON();
        expect(tree).toMatchSnapshot();
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