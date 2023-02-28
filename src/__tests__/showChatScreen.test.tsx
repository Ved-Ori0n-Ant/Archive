import React from "react";
import ShowChat from "../screens/chatModule/showChatScreen";
import { cleanup, render, fireEvent } from "@testing-library/react-native";
import { renderWithNavigation } from "../utils/renderWithNavigation";

afterEach(cleanup);

jest.mock("firebase/database", () => ({
  getDatabase: () => ({ db: jest.fn() }),
  ref: jest.fn(),
  push: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("@react-native-firebase/database", () => ({
  database: jest.fn(),
}));

jest.mock("@react-native-firebase/storage", () => ({
  storage: () => jest.fn(),
}))

jest.mock('react-native-geolocation-service', () => ({
  geoLocation: () => ({
    getCurrentPosition: jest.fn(),
  })
}))

jest.mock('@react-navigation/native', () => ({
  useRoute : jest.fn(() => ({
    params: {
      fromUserData: [{id: 'dummy_sender_id', name: 'dummy_sender_name'}],
      item: {id: 'dummy_reciever_id', name: 'dummy_reciever_name'}
    }
  }))
}))

describe("Chat screen tests", () => {
  it("should render okay", () => {
    const tree = renderWithNavigation(<ShowChat />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it("should render header", () => {
    const tree = renderWithNavigation(<ShowChat />);
    const headerText = tree.getByTestId("header-text");

    expect(headerText).toBeDefined();
    expect(headerText.props.children).toBe('dummy_reciever_name')
  });
});
