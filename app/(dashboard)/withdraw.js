import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import MyColors from '../../constants/MyColors';
import { Picker } from '@react-native-picker/picker';
import { GetAllCoin, GetCrypto, UserWithdrawak, UserWithdrawal } from '../../Api/ApiActions';
import { router } from 'expo-router';

export default function withdraw() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [storecrypto, setStroreCrypto] = useState([]);
    const [crypto, setCrypto] = useState('');
    const [account, setAccount] = useState('');


    const amountRef = useRef('');
    const walletRef = useRef('');


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


                            <TouchableOpacity onPress={HandleWithdraw} className="bg-purple-600 p-3 rounded-xl mt-5" >
                                <Text className="text-center text-xl font-extrabold text-white ">Withdraw</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

            </View >

            {loading ? (<MyLoading />) : null}

        </>
    )
}