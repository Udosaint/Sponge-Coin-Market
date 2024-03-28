import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'

import { Router, router } from 'expo-router'
import { country } from '../constants/country';

export default function welcome() {



    const login = () => {
        router.push('login');

    }
    const register = () => {
        router.push('register');



    }
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 p-5 mt-10">
                <Image
                    source={require('../assets/images/home.png')}
                    style={{ width: '100%', height: '50%' }}
                />
                <View className="flex-1">
                    <View className="items-start mt-12">
                        <View className="flex-row items-center justify-center">
                            <Image
                                source={require('../assets/images/sp_icon.png')}
                                className="w-14 h-14"

                            />
                            <Text className="text-2xl font-extrabold">Sponge<Text className="font-normal">Coin</Text></Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-semibold mt-5 mb-5">Everything you need is in one place</Text>
                    <View className="mt-5 gap-3 justify-center ">
                        <TouchableOpacity className="bg-blue-500 p-3 rounded-full" onPress={login}>
                            <Text className="text-center text-xl font-bold text-white">Log In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="border-blue-500 border-2 p-3 rounded-full" onPress={register}>
                            <Text className="text-center text-xl font-bold text-dark">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}