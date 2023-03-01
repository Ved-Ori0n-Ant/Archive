import React from "react";
import { render, fireEvent, screen } from '@testing-library/react-native';
import ImagePickerComponent from "../ImagePickerComponent";
import { launchCamera } from "react-native-image-picker";

jest.mock('react-native-image-picker', () => ({
    camera: () => ({
        launchCamera: jest.fn()  
    }),
    storage: () => ({
        launchImageLibrary: jest.fn()  
    })
}))

describe('tests for imagePickerComponent', () => {
    const isClicked = true;
    it('should render okay', () => {
        render(<ImagePickerComponent fileOption={{mediaType: "photo"}} />)
        const imagePickerBtnView = screen.getByTestId('image-picker');

        expect(imagePickerBtnView).not.toBeNull();
        expect(imagePickerBtnView).toBeDefined();
    });
    it('should have upload image btn', () => {
        render(<ImagePickerComponent fileOption={{mediaType: "photo"}} />)
        const imagePickerBtnView = screen.getByTestId('image-picker');

        expect(imagePickerBtnView.props.children[0].props.children.props.children.props.text).toBe('Upload image')
    });
    it('should have two buttons after pressing upload image', () => {
        render(<ImagePickerComponent fileOption={{mediaType: 'photo'}} />)
        const imagePickerBtn = screen.getByTestId('image_upload');
        
        fireEvent.press(imagePickerBtn);

        const camImageBtn = screen.getByTestId('cam_btn');
        const galleryImageBtn = screen.getByTestId('gallery_btn');

        console.log('~~{}~~>', camImageBtn.props.children[1])

        expect(camImageBtn).toBeDefined();
        expect(galleryImageBtn).toBeDefined();
        expect(camImageBtn.props.children[0].props.children.props.children).toBe('Open Camera');
        expect(galleryImageBtn.props.children[0].props.children.props.children).toBe('From Gallery');
    });
})