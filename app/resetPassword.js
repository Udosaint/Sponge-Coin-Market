import { View, Text, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReducedMotion } from 'react-native-reanimated';
import MyLoading from '../components/MyLoading';
import { UserForgorPassword, UserResetPassword } from '../Api/ApiActions';

export default function resetPassword() {

    const [loading, setloading] = useState(false);
    const params = useLocalSearchParams();
    const otpRef = useRef("");
    const passwordRef = useRef("");
    const conpasswordRef = useRef("");


    const reset = async () => {

        if (!otpRef.current || !passwordRef.current || !conpasswordRef.current) {
            Alert.alert("Reset Password", "Please fill all fields");
            return;
        }

        if (passwordRef.current != conpasswordRef.current) {
            Alert.alert("Reset Password", "Password does not match");
            return;
        }

        setloading(true);
        const response = await UserResetPassword(params.userEmail, otpRef.current, passwordRef.current, conpasswordRef.current);
        console.log(response);
        setloading(false);
        if (response.status == "success") {
            Alert.alert("Reset Password", response.message,
                [
                    {
                        text: 'LOGIN',
                        onPress: () => {
                            router.replace('login');
                        }

                    }
                ],);
            return;
        } else if (response.status == "error") {
            Alert.alert("Reset Password", response.message);
            return;
        } else {
            Alert.alert("Reset Password", "An error occured, please try again later");
            return;
        }

    }

    const ResendForgotPasswordCode = async () => {

        setloading(true);
        const response = await UserForgorPassword(params.userEmail);
        console.log(response);
        setloading(false);
        if (response.status == "success") {
            Alert.alert("Reset Password", "Password Reset code has been sent to " + params.userEmail);
            return;
        } else if (response.status == "error") {
            Alert.alert("Forgot Password", response.message);
            return;
        } else {
            Alert.alert("Reset Password", "An error occured, please try again later");
            return;
        }
    }

    const goback = () => {
        router.push('forgetPassword');

    }
    return (
        <>


            <View className="flex-1 mt-10">
                <KeyboardAvoidingView className="flex-1">

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="px-5 flex-row">
                            <View className="bg-blue-200 rounded-full p-2">
                                <TouchableOpacity onPress={goback}>
                                    <Ionicons name='arrow-back' size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="items-center mt-3">
                            <Image
                                source={require('../assets/images/sp_icon.png')}
                                className="w-24 h-24"
                            />
                        </View>

                        <View className="flex-1 justify-center mt-3 p-5">
                            <Text className="text-3xl font-extrabold mb-2 text-blue-500 text-center capitalize">Reset password</Text>
                            <Text className="text font-normal mb-5  text-center">
                                We have sent you your verification code to the email address provided.
                            </Text>


                            {/* The OTP Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Password Reset Code</Text>
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => otpRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Enter Reset code'
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
                                        placeholder='Enter Password'
                                        placeholderTextColor={'grey'}
                                        selectionColor={'black'}
                                    />
                                </View>
                            </View>

                            {/* The Confirm Password Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Confirm Password</Text>
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => conpasswordRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Confirm Password'
                                        placeholderTextColor={'grey'}
                                        selectionColor={'black'}
                                    />
                                </View>
                            </View>


                            <View className="">
                                <TouchableOpacity className="bg-blue-500 p-3 rounded-full mt-5" onPress={reset}>
                                    <Text className="text-center text-xl font-extrabold text-white uppercase">Reset Password</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6 items-center">
                                <Text style={{ fontSize: 16 }}>No Email yet, <Text onPress={() => ResendForgotPasswordCode()} className="text-blue-500 font-semibold active:text-red-500">Resend email</Text> </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>


            {loading ? (<MyLoading />) : null}

        </>
    )
}