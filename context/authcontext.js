import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { LoginLink, RegisterLink } from '../Api/MyApi';

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios, { formToJSON } from 'axios'



export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {

        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user');

                //console.log(JSON.parse(jsonValue));
                if (jsonValue == "logout") {
                    setIsAuthenticated(null);

                } else if (jsonValue != null) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(jsonValue));
                } else {
                    setIsAuthenticated(false);
                }

            } catch (e) {

                console.log(e)
                // error reading value
            }
        };

        getData();

    }, [])


    const UserLogin = async (username, password) => {
        try {

            const formdata = new FormData();

            formdata.append('username', username);
            formdata.append('password', password);

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const response = await axios.post(LoginLink, formdata, config);
            return response.data;

        } catch (error) {
            console.error('Error while logging in:', error);
            return { err: "An error occured. Check your network and try again" };
        }
    }

    const logout = async () => {
        try {

            await AsyncStorage.setItem("user", "logout");
            //setUser(null);
            setIsAuthenticated(null);

            return { response: "User logout" };

        } catch (error) {
            console.error('Error while logging out:', error);
            return { err: "An error occured. Check your network and try again" };
        }
    }

    const UserRegister = async (fullname, username, email, phone, gender, country, currency, password, conpassword) => {
        try {

            const formdata = new FormData();

            formdata.append('fullname', fullname);
            formdata.append('username', username);
            formdata.append('email', email);
            formdata.append('phone', phone);
            formdata.append('gender', gender);
            formdata.append('country', country);
            formdata.append('currency', currency);
            formdata.append('conpassword', conpassword);
            formdata.append('password', password);

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const response = await axios.post(RegisterLink, formdata, config);
            return response.data;

        } catch (error) {
            console.error('Error while creating account:', error);
            return { err: "An error occured. Check your network and try again" };
        }
    }




    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, UserLogin, logout, UserRegister }}>
            {children}
        </AuthContext.Provider>
    )
}




export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be wrapped inside AuthContextProvider");
    }

    return value;
}