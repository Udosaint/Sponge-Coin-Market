import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import { MyColors } from '../constants/MyColors';
import { Mycountry } from '../constants/country';
import MyLoading from '../components/MyLoading';
import { useAuth } from '../context/authcontext';

export default function Complete() {

    const [Currency, setCurrency] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const countrylist = Mycountry;

    const { UserRegister } = useAuth();

    const params = useLocalSearchParams();

    //console.log(countrylist);

    const register = async () => {

        if (!passwordRef.current || !confirmPasswordRef.current || Currency == null || country == null) {
            Alert.alert("Sign Up", "Please fill all fields");
            return;
        } else if (passwordRef.current != confirmPasswordRef.current) {
            Alert.alert("Sign Up", "Password does not match");
            return;
        }

        setLoading(true);
        const response = await UserRegister(params.fullname, params.username, params.email, params.phone, country, Currency, passwordRef.current, confirmPasswordRef.current);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Sign Up", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Sign Up", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Sign Up", response.message, [
                {
                    text: 'Verify',
                    onPress: () => verifyEmail(params.email),
                    style: 'default',
                },

            ]);
            return;
        }

        //Alert.alert("Sign Up", "Successfull");
        //setIsloading(false)
        //router.push('otp');

    }


    const verifyEmail = (email) => {
        router.push({
            pathname: 'otp',
            params: {
                useremail: email
            }
        })
    }

    const goback = () => {
        router.back();

    }
    return (

        <>
            <View className="flex-1 mt-10">

                <ScrollView>
                    <View className="px-5 flex-row">
                        <View className="bg-blue-200 rounded-full p-2">
                            <TouchableOpacity onPress={goback}>
                                <Ionicons name='arrow-back' size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 mt-5 p-5">

                        {/* The Fullname Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Currency</Text>
                            <View className="bg-slate-300 rounded-full mt-2">
                                <Picker
                                    className="px-5"
                                    mode='dialog'
                                    dropdownIconColor={'#2196f3'}
                                    selectionColor={'#2196f3'}
                                    selectedValue={country}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setCountry(itemValue)
                                    }>
                                    <Picker.Item label='Select Currency' value='' />
                                    <Picker.Item label='EUR' value='EUR' />
                                    <Picker.Item label='GBP' value='GBP' />
                                    <Picker.Item label='USD' value='USD' />
                                </Picker>
                            </View>
                        </View>

                        {/* The Email Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Country</Text>
                            <View className="bg-slate-300 rounded-full mt-2">
                                <Picker
                                    className="px-5"
                                    mode='modal'
                                    placeholder='Select Country'
                                    dropdownIconColor={'#2196f3'}
                                    selectionColor={'#2196f3'}
                                    selectedValue={Currency}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setCurrency(itemValue)
                                    }>
                                    {countrylist.map((value, index) => (
                                        <Picker.Item key={index} label={value.name} value={value.name} />
                                    ))}


                                </Picker>
                            </View>
                        </View>


                        {/* The Password Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Password</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => passwordRef.current = value}
                                    className="px-4 font-semibold"
                                    secureTextEntry
                                    placeholder='Enter Password'
                                    placeholderTextColor={'grey'}
                                />
                            </View>
                        </View>

                        {/* The Confirm Password Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Confirm Password</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => confirmPasswordRef.current = value}
                                    className="px-4 font-semibold"
                                    secureTextEntry
                                    placeholder='Confirm Password'
                                    placeholderTextColor={'grey'}
                                />
                            </View>
                        </View>

                        <View className="">
                            <TouchableOpacity className="bg-blue-500 p-3 rounded-full mt-5" onPress={register}>
                                <Text className="text-center text-xl font-extrabold text-white uppercase">Register</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </ScrollView>
            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}