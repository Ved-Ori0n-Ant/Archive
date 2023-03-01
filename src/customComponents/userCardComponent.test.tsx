import React from "react";
import UserCardComponent from "./userCardComponent";
import { render, cleanup, screen } from '@testing-library/react-native';

describe('Tests for userCardComponent', () => {
    it('should render okay', () => {
        render(<UserCardComponent />)
        expect(screen.getByTestId('user-details')).toBeDefined();
    });
    it('should have user name and image', () => {
        render(<UserCardComponent />);
        const userCard = screen.getByTestId('user-details');

        expect(userCard.props.children[0].props.children).toBe('userName');
        expect(userCard.props.children[1].props.source.testUri).toBe('../../../src/assets/images/messageIcon.png')
    })
})