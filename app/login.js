import { View, Text, Image, TextInput, TouchableOpacity, Alert, BackHandler, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';

import { AuthContext, useAuth } from '../context/authcontext'
import MyLoading from '../components/MyLoading';
import { SendVerifyEmail } from '../Api/ApiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {

    useEffect(() => {

        letGetUser();

        const backAction = () => {
            BackHandler.exitApp(); // This will close the app
            return true; // Prevent default behavior
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Remove the event listener on component unmount


    }, []);

    const forgetpassword = () => {
        router.push('forgetPassword');
    }
    const register = () => {
        router.push('register');

    }

    const [loading, setloading] = useState(false);
    const [getuser, setGetuser] = useState(null);
    const passwordRef = useRef("");
    const usernameRef = useRef("");


    const { UserLogin, setIsAuthenticated, setUser, user } = useContext(AuthContext);


    // send otp for verification;
    const verifyEmail = async (email) => {
        setloading(true);
        const response = await SendVerifyEmail(email);
        setloading(false);
        if (response.status == "success") {
            Alert.alert("Email verify", "OTP has been sent to " + email);
            return router.push({
                pathname: 'otp',
                params: {
                    useremail: email
                }
            });;
        } else {
            Alert.alert("Email verify", "An error occured, please try again later");
            return;
        }

    }

    const loginHandle = async () => {

        if (!passwordRef.current || !usernameRef.current) {
            Alert.alert("Sign In", "Please fill all fields");
            return;
        }

        setloading(true);

        const response = await UserLogin(usernameRef.current, passwordRef.current);


        console.log(response);

        if (response.err) {
            Alert.alert("Sign In", "An error occured. Check your network and try again");
            return;
        } else if (response.error) {
            Alert.alert("Sign In", response.message);
            return;
        } else if (response.error == "0") {
            Alert.alert("Sign In", response.message, [
                {
                    text: 'Verify',
                    onPress: () => verifyEmail(response.data),
                    style: 'default',
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: 'cancel',
                },

            ]);
            return;
        }


        await AsyncStorage.setItem('user', JSON.stringify(response.data))
            .then((result) => {
                setIsAuthenticated(true)
                setUser(response.data)
                console.log("data save successfuly");

                AsyncStorage.setItem('username', response.data.username)
                router.replace('(dashboard)');
                setloading(false);
            })
            .catch((error) => {
                console.log("Error storing user: " + error)
            })


    }


    const letGetUser = async () => {
        const value = await AsyncStorage.getItem('username');

        //console.log(JSON.parse(jsonValue));
        if (value != null) {
            setGetuser(value);

        } else {
            setGetuser(null);
        }

    }




    return (

        <>
            <View className="flex-1 mt-10">
                <KeyboardAvoidingView className="flex-1">
                    <ScrollView>
                        <View className="items-center mt-10">
                            <Image
                                source={require('../assets/images/sp_icon.png')}
                                className="w-24 h-24"
                            />
                        </View>
                        <View className="flex-1 mt-5 p-5">
                            <Text className="text-3xl font-extrabold mb-3 text-blue-500">{getuser != null ? "Welcome back " + getuser : "Login"}</Text>
                            {/* The Username Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Username / Email</Text>
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
                                    <TextInput
                                        //defaultValue={myuser}
                                        onChangeText={value => usernameRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Enter Username here'
                                        placeholderTextColor={'grey'}
                                        selectionColor={'black'}
                                    />
                                </View>

                            </View>

                            {/* The Password Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Password</Text>
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => passwordRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Enter Username here'
                                        secureTextEntry
                                        placeholderTextColor={'grey'}
                                        selectionColor={'black'}
                                    />
                                </View>
                            </View>

                            <View className="mb-5 items-end" >
                                <Text className="text-md font-extrabold active:text-blue-500" onPress={forgetpassword}>Forget Password</Text>
                            </View>

                            <TouchableOpacity className="bg-blue-500 p-3 rounded-full" onPress={loginHandle}>
                                <Text className="text-center text-xl font-extrabold text-white ">Log In</Text>
                            </TouchableOpacity>
                            <View className="flex-1 mt-10">
                                <Text className="text-center text-md font-bold text-dark ">Don't Have account yet? <Text onPress={register} className="text-blue-500 font-extrabold">Register</Text></Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            {loading ? (<MyLoading />) : null}

        </>
    )
}