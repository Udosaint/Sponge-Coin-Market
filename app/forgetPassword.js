import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MyLoading from '../components/MyLoading';
import { UserForgorPassword } from '../Api/ApiActions';

export default function forgetPassword() {


    const [loading, setloading] = useState(false);
    const emailRef = useRef("");

    const goback = () => {
        router.back();

    }

    const proceed = async () => {

        if (!emailRef.current) {
            Alert.alert("Forgot Password", "Please enter your registered email address");
            return;
        }


        setloading(true);
        const response = await UserForgorPassword(emailRef.current);
        console.log(response);
        setloading(false);
        if (response.status == "success") {
            Alert.alert("Forgot Password", "Password Reset code has been sent to " + emailRef.current,
                [
                    {
                        text: 'CONTINUE',
                        onPress: () => {
                            router.push({
                                pathname: 'resetPassword',
                                params: {
                                    userEmail: emailRef.current
                                }
                            });
                        }

                    }
                ],);
            return;
        } else if (response.status == "error") {
            Alert.alert("Forgot Password", response.message);
            return;
        } else {
            Alert.alert("Forgot Password", "An error occured, please try again later");
            return;
        }
        //router.replace('resetPassword');

    }
    return (
        <>
            <View className="flex-1 mt-10">

                <View className="px-5 flex-row">
                    <View className="bg-blue-200 rounded-full p-2">
                        <TouchableOpacity onPress={goback}>
                            <Ionicons name='arrow-back' size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="items-center mt-10">
                    <Image
                        source={require('../assets/images/sp_icon.png')}
                        className="w-24 h-24"
                    />
                </View>

                <View className="flex-1 justify-center mt-5 p-5">
                    <Text className="text-3xl font-extrabold mb-2 text-blue-500 text-center capitalize">Forgot password</Text>
                    <Text className="text font-normal mb-5  text-center">
                        Enter your email for the verification process. We will send you code to your email
                    </Text>


                    {/* The Fullname Here */}
                    <View className="flex-column pt-3 mb-4">
                        <View className="bg-slate-300 rounded-full p-3 mt-2">
                            <TextInput
                                onChangeText={value => emailRef.current = value}
                                className="px-4 font-semibold"
                                placeholder='Enter Email'
                                placeholderTextColor={'grey'}
                                selectionColor={'black'}
                            />
                        </View>
                    </View>

                    <View className="">
                        <TouchableOpacity className="bg-blue-500 p-3 rounded-full mt-5" onPress={proceed}>
                            <Text className="text-center text-xl font-extrabold text-white uppercase">Procced</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}