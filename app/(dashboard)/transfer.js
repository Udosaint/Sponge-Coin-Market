import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import MyColors from '../../constants/MyColors';
import { Picker } from '@react-native-picker/picker';
import { GetAllCoin, UserTransfer, UserWithdrawal } from '../../Api/ApiActions';
import { router } from 'expo-router';

export default function Tranfer() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');


    const amountRef = useRef('');


    const handleTransfer = async () => {
        if (!amountRef.current || from == '' || to == '') {
            Alert.alert("Transfer", "Please fill all fields");
            return;
        }

        setLoading(true);
        const response = await UserTransfer(user.userid, amountRef.current, from, to);
        setLoading(false);

        ///console.log(response);

        if (response.err) {
            Alert.alert("Transfer ", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Transfer ", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Transfer ", response.message, [
                {
                    text: 'OK',
                    onPress: () => router.push('(tabs)'),
                    style: 'default',
                },

            ]);
            return;
        }

    }

    return (
        <>
            <View className="flex-1">
                <KeyboardAvoidingView className="flex-1">

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="flex px-4 items-center justify-center mt-5">
                            <Text className="font-semibold text-xl mb-5">Transfer money within your accounts</Text>
                            {/* <Text className="font-bold text-md text-red-600">
                                A minimum of $100 should remain in your
                                account when withdrawing and also your
                                daily minimum withdrawal is $100
                            </Text> */}
                        </View>

                        <View className="flex-1 p-4  ">
                            {/* The Username Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Transfer From</Text>
                                <View className="bg-slate-300 rounded-xl mt-2">

                                    <Picker
                                        className="px-5"
                                        mode='dialog'
                                        dropdownIconColor={MyColors.primary}
                                        selectionColor={MyColors.primary}
                                        selectedValue={from}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setFrom(itemValue)
                                        }>
                                        <Picker.Item label='Select Account' value='' />
                                        <Picker.Item label='Main Account' value='mainbal' />
                                        <Picker.Item label='Trade Account' value='tradebal' />
                                        <Picker.Item label='Copy Account' value='copybal' />
                                    </Picker>
                                </View>

                            </View>

                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Transfer To</Text>
                                <View className="bg-slate-300 rounded-xl mt-2">
                                    <Picker
                                        className="px-5"
                                        mode='dialog'
                                        dropdownIconColor={'#2196f3'}
                                        selectionColor={'#2196f3'}
                                        selectedValue={to}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setTo(itemValue)
                                        }>
                                        <Picker.Item label='Select Account' value='' />
                                        <Picker.Item label='Main Account' value='mainbal' />
                                        <Picker.Item label='Trade Account' value='tradebal' />
                                        <Picker.Item label='Copy Account' value='copybal' />
                                    </Picker>
                                </View>

                            </View>

                            {/* The Password Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Amount</Text>
                                <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => amountRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Enter amount to transfer'
                                        placeholderTextColor={'grey'}
                                        keyboardType='phone-pad'
                                    />
                                </View>
                            </View>



                            <TouchableOpacity onPress={handleTransfer} className="bg-purple-600 p-3 rounded-xl mt-5" >
                                <Text className="text-center text-xl font-extrabold text-white ">Transfer</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

            </View >

            {loading ? (<MyLoading />) : null}

        </>
    )
}