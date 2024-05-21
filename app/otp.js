import { View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router';
import { SendVerifyEmail, UserVerifyEmail } from '../Api/ApiActions';
import MyLoading from '../components/MyLoading';

export default function otp() {

    const [loading, setloading] = useState(false);
    const otpRef = useRef("");

    const [count, setCount] = useState(60);
    const [isCounting, setIsCounting] = useState(false);

    const params = useLocalSearchParams();

    console.log(params.useremail);

    useEffect(() => {
        let timer;
        if (isCounting) {
            timer = setInterval(() => {
                setCount(prevCount => {
                    if (prevCount === 0) {
                        clearInterval(timer); // Stop the timer when count reaches 0
                        // Perform the action when count reaches 0
                        console.log('Countdown reached 0!');
                        setIsCounting(false);
                        setCount(60)
                        return 0; // Reset count to 0
                    }
                    return prevCount - 1; // Decrement count by 1
                });
            }, 1000); // Update count every 1 second
        } else {
            clearInterval(timer); // Clear the interval when counting is stopped
        }

        // Cleanup function to clear the interval when component unmounts or counting is stopped
        return () => clearInterval(timer);
    }, [isCounting]); // Run effect whenever isCounting changes




    const verify_account = async () => {
        if (!otpRef.current) {
            Alert.alert("Account verify", "Please enter your OTP in the fields");
            return;
        }

        setloading(true);
        const response = await UserVerifyEmail(params.useremail, otpRef.current);
        setloading(false);

        console.log(response);
        if (response.status == "success") {
            Alert.alert("Account verify", response.message);
            return router.replace('login');
        } else if (response.status == "error") {
            Alert.alert("Account verify", response.message);
            return;
        } else {
            Alert.alert("Account verify", response.message);
            return;
        }
        //router.replace('login');



    }

    const goback = () => {
        router.back();

    }

    const ResendVerifyEmail = async () => {
        setIsCounting(true);// Start counting when the button is clicked

        setloading(true);
        const response = await SendVerifyEmail(params.useremail);
        console.log(response);
        setloading(false);
        if (response.status == "success") {
            Alert.alert("Email verify", "OTP has been sent to " + params.useremail);
            return;
        } else if (response.status == "error") {
            Alert.alert("Forgot Password", response.message);
            return;
        } else {
            Alert.alert("Email verify", "An error occured, please try again later");
            return;
        }
    }



    return (

        <>
            <View className="flex-1 mt-10">

                <View className="px-5 flex-row">
                    <View className="bg-blue-200 rounded-xl p-2">
                        <TouchableOpacity onPress={goback}>
                            <Ionicons name='arrow-back' size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="items-center mt-10">
                    <Image
                        style={{ width: 200, height: 30 }}
                        source={require('../assets/images/sp_icon.png')}
                        className=""
                    />
                </View>

                <View className="flex-1 justify-center mt-5 p-5">
                    <Text className="text-3xl font-extrabold mb-2 text-purple-600 text-center">Verify Account</Text>
                    <Text className="text-lg font-normal mb-5  text-center">
                        We have sent you the verification code to your registed email account.
                    </Text>


                    {/* The Fullname Here */}
                    <View className="flex-column pt-3 mb-4">
                        <View className="bg-slate-300 rounded-xl p-3 mt-2">
                            <TextInput
                                onChangeText={value => otpRef.current = value}
                                className="px-4 font-semibold"
                                placeholder='Enter OTP'
                                placeholderTextColor={'grey'}
                                selectionColor={'black'}
                            />
                        </View>
                    </View>

                    <View className="">
                        <TouchableOpacity className="bg-purple-600 p-3 rounded-xl mt-5" onPress={verify_account}>
                            <Text className="text-center text-xl font-extrabold text-white uppercase">Verify Account</Text>
                        </TouchableOpacity>
                    </View>

                    {

                        isCounting ? (
                            <View className="mt-5 items-center">
                                <Text style={{ fontSize: 16 }}>Resend Email after  {count} secs</Text>
                            </View>
                        ) :
                            (
                                <View className="mt-5 items-center">
                                    <Text style={{ fontSize: 16 }}>No Email yet, <Text onPress={() => ResendVerifyEmail()} className="text-purple-600 font-semibold active:text-red-500">Resend email</Text> </Text>
                                </View>
                            )
                    }



                </View>
            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}