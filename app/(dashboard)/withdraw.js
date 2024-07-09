import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import MyColors from '../../constants/MyColors';
import { Picker } from '@react-native-picker/picker';
import { GetAllCoin, GetCrypto, UserCheckCot, UserCheckPin, UserCheckTax, UserWithdrawak, UserWithdrawal } from '../../Api/ApiActions';
import { router } from 'expo-router';
import ActionSheet from 'react-native-actions-sheet';
import { API, SITE_EMAIL } from '../../Api/MyApi';

export default function withdraw() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [storecrypto, setStroreCrypto] = useState([]);
    const [crypto, setCrypto] = useState('');
    const [account, setAccount] = useState('');


    const amountRef = useRef('');
    const walletRef = useRef('');

    const pin = useRef('');
    const cotcode = useRef('');
    const taxcode = useRef('');

    const showpinmodal = useRef(null);
    const showcotmodal = useRef(null);
    const showtaxmodal = useRef(null);


    const HandleWithdraw = async () => {
        if (!amountRef.current || !walletRef.current || crypto == '' || account == '') {
            Alert.alert("Withdraw", "Please fill all fields");
            return;
        }

        setLoading(true);
        const response = await UserWithdrawal(user.userid, amountRef.current, crypto, walletRef.current, account, user.currency);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Withdraw", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Withdraw", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Withdraw", response.message, [
                {
                    text: 'OK',
                    onPress: () => router.push('(tabs)'),
                    style: 'default',
                },

            ]);
            return;
        }

    }


    const LetCheckAction = () => {
        if (!amountRef.current || !walletRef.current || crypto == '' || account == '') {
            Alert.alert("Withdraw", "Please fill all fields");
            return;
        }

        showcotmodal.current?.show();
    }

    const LetCheckTax = () => {
        showtaxmodal.current?.show();
    }

    const LetCheckPin = () => {
        showpinmodal.current?.show();
    }

    const CheckPin = async () => {
        showpinmodal.current?.hide();
        setLoading(true);
        const response = await UserCheckPin(user.userid, 'checkpin', pin.current);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Account Pin", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Account Pin", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Account Pin", response.message, [
                {
                    text: 'Procced',
                    onPress: () => HandleWithdraw(),
                    style: 'default',
                },

            ]);
            return;
        }

    }

    const CheckCot = async () => {
        //console.log(cotcode.current);
        showcotmodal.current?.hide();
        setLoading(true);
        const response = await UserCheckCot(user.userid, cotcode.current);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("COT Code", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("COT Code", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("COT Code", response.message, [
                {
                    text: 'Procced',
                    onPress: () => LetCheckTax(),
                    style: 'default',
                },

            ]);
            return;
        }

    }


    const CheckTax = async () => {
        showtaxmodal.current?.hide();
        setLoading(true);
        const response = await UserCheckTax(user.userid, 'checktax', taxcode.current);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Tax Code", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Tax Code", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Tax Code", response.message, [
                {
                    text: 'Procced',
                    onPress: () => LetCheckPin(),
                    style: 'default',
                },

            ]);
            return;
        }

    }

    useEffect(() => {
        getCoin()
    }, [getCoin]);


    const getCoin = async () => {
        setLoading(true);
        const response = await GetCrypto();
        setLoading(false);

        //console.log(response.data);

        if (response.err) {
            Alert.alert("Withdraw", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Withdraw", response.message);
            return;
        } else if (response.status == "success") {
            const dataArray = Object.entries(response.data).map(([index, value]) => ({ index, value }));
            //console.log(dataArray);
            setStroreCrypto(dataArray);
            return;
        }
    }

    //console.log(crypto);

    return (
        <>
            <View className="flex-1">
                <KeyboardAvoidingView className="flex-1">

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="flex px-4 items-center justify-center mt-5">
                            <Text className="font-semibold text-xl mb-5">Make Withdrawal</Text>
                            {/* <Text className="font-bold text-md text-red-600">
                                A minimum of $100 should remain in your
                                account when withdrawing and also your
                                daily minimum withdrawal is $100
                            </Text> */}
                        </View>

                        <View className="flex-1 p-4  ">
                            {/* The Username Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Select Account</Text>
                                <View className="bg-slate-300 rounded-xl mt-2">

                                    <Picker
                                        className="px-5"
                                        mode='dialog'
                                        dropdownIconColor={MyColors.primary}
                                        selectionColor={MyColors.primary}
                                        selectedValue={crypto}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setCrypto(itemValue)
                                        }>
                                        <Picker.Item label='Select Crypto' value='' />
                                        {storecrypto.map((item, index) => (

                                            <Picker.Item key={item.value.short} label={item.value.crypto_name} value={item.value.short} />
                                        ))}
                                    </Picker>
                                </View>

                            </View>

                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Withdrawal Account</Text>
                                <View className="bg-slate-300 rounded-xl mt-2">
                                    <Picker
                                        className="px-5"
                                        mode='dialog'
                                        dropdownIconColor={'#2196f3'}
                                        selectionColor={'#2196f3'}
                                        selectedValue={account}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setAccount(itemValue)
                                        }>
                                        <Picker.Item label='Withdraw From' value='' />
                                        <Picker.Item label='Main Account' value='mainbal' />
                                        <Picker.Item label='Trade Account' value='tradebal' />
                                        <Picker.Item label='Profit Account' value='profitbal' />
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
                                        placeholder='Enter amount to withdraw'
                                        placeholderTextColor={'grey'}
                                        keyboardType='phone-pad'
                                    />
                                </View>
                            </View>

                            {/* The wallet address Here */}
                            <View className="flex-column pt-3 mb-4">
                                <Text className="text-md font-extrabold">Wallet Address</Text>
                                <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => walletRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder='Enter wallet address'
                                        placeholderTextColor={'grey'}
                                    />
                                </View>
                            </View>


                            <TouchableOpacity onPress={LetCheckAction} className="bg-purple-600 p-3 rounded-xl mt-5" >
                                <Text className="text-center text-xl font-extrabold text-white ">Withdraw</Text>
                            </TouchableOpacity>
                        </View>

                        {/* COt Code Checking */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={100}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey', padding: 5, marginTop: 5 }}
                            ref={showcotmodal}
                        >
                            {
                                <View className="px-5 p-5 mb-5">
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500 mb-5">COT Code Confirmation</Text>
                                    <Text className="font-semibold text-md  text-center text-BLUE-500 mb-5">Contact support for your Cot Code {user.SITE_EMAIL}</Text>
                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Enter Cot code here</Text>
                                        <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                            <TextInput
                                                onChangeText={value => cotcode.current = value}
                                                className="px-4 font-semibold"
                                                placeholder='Enter cot code'
                                                placeholderTextColor={'grey'}
                                                keyboardType='phone-pad'
                                                maxLength={6}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => CheckCot()} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">check cot code</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ActionSheet>

                        {/* Tax Code Checking */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={100}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey', padding: 5, marginTop: 5 }}
                            ref={showtaxmodal}
                        >
                            {
                                <View className="px-5 p-5 mb-5">
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500 mb-5">Tax Code Confirmation</Text>
                                    <Text className="font-semibold text-md  text-center text-BLUE-500 mb-5">Contact support for your Tax Code {user.SITE_EMAIL}</Text>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Enter Tax code here</Text>
                                        <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                            <TextInput
                                                onChangeText={value => taxcode.current = value}
                                                className="px-4 font-semibold"
                                                placeholder='Enter tax code'
                                                placeholderTextColor={'grey'}
                                                keyboardType='phone-pad'
                                                maxLength={6}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => CheckTax()} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">check tax code</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ActionSheet>


                        {/* Account Pin Checking */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={100}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey', padding: 5, marginTop: 5 }}
                            ref={showpinmodal}
                        >
                            {
                                <View className="px-5 p-5 mb-5">
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500 mb-5">Account Pin Confirmation</Text>
                                    <Text className="font-semibold text-md  text-center text-BLUE-500 mb-5">Contact support for your Account Pin {user.SITE_EMAIL}</Text>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Enter pin here</Text>
                                        <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                            <TextInput
                                                onChangeText={value => pin.current = value}
                                                className="px-4 font-semibold"
                                                placeholder='Enter account pin'
                                                placeholderTextColor={'grey'}
                                                keyboardType='phone-pad'
                                                maxLength={6}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => CheckPin()} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">check account pin</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ActionSheet>

                    </ScrollView>
                </KeyboardAvoidingView>

            </View >

            {loading ? (<MyLoading />) : null}

        </>
    )
}