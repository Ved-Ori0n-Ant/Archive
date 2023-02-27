import React, { useState, useEffect } from "react";

export default function fieldValidator() {

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [nameError, setNameError] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');

    const [isValidated, setIsValidated] = useState<boolean>(false)

    var namePattern = /^[a-zA-Z 0-9]+$/;
    var emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-z0-9-]+)*$/

    useEffect(() => {
        if(nameError === '' && emailError === '' && passwordError === '')
            setIsValidated(true)
    }, [nameError, emailError, passwordError])

    const nameValidator = (value: string) => {
        switch(true) {
            case value.length === 0:
                setNameError('This field is mendatory.')
                // Alert.alert(nameError)
                break;
            case value.length > 20: 
                setNameError('Name cannot be greater than 20 letters.')
                // Alert.alert(nameError);
                break;
            case !namePattern.test(value):
                setNameError('Use alphabets only.')
                // Alert.alert(nameError)
                break;
            default:
                setNameError('')
        }
    }

    const emailValidator = (value: string) => {
        switch(true) {
            case value.length === 0:
                setEmailError('This field is mendatory.')
                break;
            case !emailPattern.test(value): 
                setEmailError('Please enter valid mail id.')
                break;
            default: 
                setEmailError('')
        }
    }

    const passwordValidator = (valuePassword: string, valueConfirmPassword: string) => {
        switch(true){
            case valuePassword.length === 0 || valueConfirmPassword.length === 0:
                setPasswordError('Password field is mendatory.')
                break;
            case (valuePassword !== valueConfirmPassword || valuePassword.length !== valueConfirmPassword.length): 
                setPasswordError('Passwords does not match! Verify the password')
                break;
            default:
                setPasswordError('')
        }
    }

    const phoneNumberValidator = (value: string) => {
        switch(true) {
            case value.length === 0:
                setPhoneNumberError('Please enter your phone number!')
                break;
            default: 
            setPhoneNumberError('')
        }
    }

    const clearInputs = () => {
        console.log('clear pressed')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    const checkSubmit = () => {
        nameValidator(name)
        emailValidator(email)
        passwordValidator(password, confirmPassword)

        if(isValidated) {
            clearInputs()
            setIsValidated(false)
        } else {
            clearInputs()
            setIsValidated(false)
            console.log('signed up failed')
        }
    }

    return{
        nameValidator,
        emailValidator,
        passwordValidator,
        phoneNumberValidator,
        checkSubmit,
        name,
        nameError,
        email,
        emailError,
        password,
        confirmPassword,
        passwordError,
        phoneNumber,
        phoneNumberError,
        setName,
        setEmail,
        setPassword,
        setConfirmPassword,
        clearInputs,
        setPhoneNumber,
        setPhoneNumberError
    }
}