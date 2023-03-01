import React from "react";
import TextComponent from "../textComponent";
import {render, screen, cleanup} from '@testing-library/react-native';

afterEach(cleanup);

describe('Tests for TextComponent', () => {
    it('should render okay', () => {
        render(<TextComponent />)
        expect(screen.getByTestId('custom-text')).toBeDefined();
    });
    it('should render text', () => {
        render(<TextComponent />)
        const defaultCustomText = screen.getByTestId('custom-text').props.children

        expect(defaultCustomText).toBe('TextComponent');
    });
})