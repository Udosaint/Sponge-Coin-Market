import { View, Text, StyleSheet, StatusBar, Platform, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

export default function ViewDeposit() {

    const params = useLocalSearchParams();

    return (
        <View className="flex-1 px-5 justify-center">

            <View className="items-center justify-center">
                <Image source={require('../../assets/images/depview.png')}
                    className="w-24 h-24 mb-5"
                />
            </View>

            <View className=" bg-zinc-400 p-5 rounded-md">

                <View className="mb-4">
                    <Text className="font-extrabold text-lg">{params.amount}</Text>
                    <View className="border-b-2 border-blue-800 mt-2" />
                </View>
                <View className="mb-4">
                    <Text>Crypto</Text>
                    <Text className="font-extrabold text-lg">{params.crypto}</Text>
                    <View className="border-b-2 border-blue-800 mt-2" />
                </View>
                <View className="mb-4">
                    <Text>Payment Type</Text>
                    <Text className="font-extrabold text-lg">{params.type}</Text>
                    <View className="border-b-2 border-blue-800 mt-2" />
                </View>
                <View className="mb-4">
                    <Text>Date</Text>
                    <Text className="font-extrabold text-lg">{params.date}</Text>
                    <View className="border-b-2 border-blue-800 mt-2" />
                </View>
                <View className="mb-4">
                    <Text>Status</Text>
                    <Text
                        className={params.status == 1 ? "text-green-500 text-lg font-extrabold" : "text-orange-500 text-lg font-extrabold" + " text-base"}
                    >{params.status == 1 ? "Complete" : "Pending"}
                    </Text>
                    <View className="border-b-2 border-blue-800 mt-2" />
                </View>

                <View className="mb-4">
                    <Text>Transaction ID</Text>
                    <Text className="font-extrabold text-lg">fsfajfkfgkajfaksj</Text>
                </View>

            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },

});