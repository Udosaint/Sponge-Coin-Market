import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, BackHandler, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MyLoading from '../components/MyLoading';

export default function register() {

    // useEffect(() => {
    //     const backAction = () => {
    //         BackHandler.exitApp(); // This will close the app
    //         return true; // Prevent default behavior
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     return () => backHandler.remove(); // Remove the event listener on component unmount
    // }, []);

    const login = () => {
        router.push('login');

    }

    const [loading, setLoading] = useState(false);

    const fullnameRef = useRef("");
    const usernameRef = useRef("");
    const emailRef = useRef("");
    const phoneRef = useRef("");

    const proceed = () => {

        if (!fullnameRef.current || !usernameRef.current || !emailRef.current || !phoneRef.current) {
            Alert.alert("Sign Up", "Please fill all fields");
            return;
        }

        //console.log(phoneRef.current);

        setLoading(true);
        setTimeout(() => {
            router.push({
                pathname: 'complete',
                params: {
                    fullname: fullnameRef.current,
                    username: usernameRef.current,
                    phone: phoneRef.current,
                    email: emailRef.current,

                }
            });
            setLoading(false);
        }, 3000);



    }



    return (
        <>
            <View className="flex-1 mt-1">

                <ScrollView>

                    <View className="items-center mt-10">
                        <Image
                            source={require('../assets/images/sp_icon.png')}
                            className="w-24 h-24"

                        />
                    </View>
                    <View className="flex-1 mt-5 p-5">
                        <Text className="text-3xl font-extrabold mb-3 text-blue-500">Create Account</Text>

                        {/* The Fullname Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Fullname</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => fullnameRef.current = value}
                                    className="px-4"
                                    placeholder='Enter Fullname here'

                                />
                            </View>
                        </View>

                        {/* The Username Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Username</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => usernameRef.current = value}
                                    className="px-4"
                                    placeholder='Enter Username'

                                />
                            </View>
                        </View>

                        {/* The Email Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Email</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => emailRef.current = value}
                                    className="px-4"
                                    keyboardType='email-address'
                                    placeholder='Enter Email '
                                />
                            </View>
                        </View>

                        {/* The Email Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Phone</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => phoneRef.current = value}
                                    className="px-4"
                                    keyboardType='phone-pad'
                                    placeholder='Enter Phone number '
                                />
                            </View>
                        </View>

                        <View className="">
                            <TouchableOpacity className="bg-blue-500 p-3 rounded-full mt-5" onPress={proceed}>
                                <Text className="text-center text-xl font-extrabold text-white ">Proceed</Text>
                            </TouchableOpacity>
                        </View>



                        <View className="flex-1 mt-5">
                            <Text className="text-center text-md font-bold text-dark ">Already Have account ? <Text onPress={login} className="text-blue-500 font-extrabold">Login</Text></Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {loading ? (<MyLoading />) : null}
        </>
    )
}