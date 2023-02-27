import React from "react";
import ShowChat from "../screens/chatModule/showChatScreen";
import { cleanup, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import storage from '@react-native-firebase/storage';

afterEach(cleanup);

function renderWithNavigation(renderComponent: any) {
  return render(<NavigationContainer>{renderComponent}</NavigationContainer>);
}

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

describe("Chat screen tests", () => {
  it("should render okay", () => {
    const tree = renderWithNavigation(<ShowChat />);

    console.log("@@@@@", tree.toJSON());

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it("should render header", () => {
    const tree = render(
      <NavigationContainer>
        <ShowChat />
      </NavigationContainer>
    );
    const headerText = tree.getByTestId("header-text");

    console.log("~~{}~~>", headerText);
  });
});
