import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import MyColors from '../../constants/MyColors'
import { useAuth } from '../../context/authcontext'
import { GetAllCoin, GetCrypto, UserDeposit } from '../../Api/ApiActions'
import MyLoading from '../../components/MyLoading'
import ActionSheet from 'react-native-actions-sheet'
import * as Clipboard from 'expo-clipboard';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router'
import { WalletImage } from '../../Api/MyApi'
export default function deposit() {

    const getmenu = () => {

    }

    const showdepositmodal = useRef(null);
    const [mydeposit, setMydeposit] = useState([]);

    const [storecrypto, setStroreCrypto] = useState([]);
    const [crypto, setCrypto] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const amountRef = useRef('');
    const walletRef = useRef('');

    const [proof, setProof] = useState(null);

    useEffect(() => {
        getCoin()
    }, [getCoin]);


    const getCoin = async () => {
        setLoading(true);
        const response = await GetAllCoin();
        setLoading(false);

        //console.log(response.data);

        if (response.err) {
            Alert.alert("Deposit", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Deposit", response.message);
            return;
        } else if (response.status == "success") {
            const dataArray = Object.entries(response.data).map(([index, value]) => ({ index, value }));
            setStroreCrypto(response.data);
            //console.log(response.data)
            return;
        }
    }


    const copywallet = async (wallet) => {
        await Clipboard.setStringAsync(wallet)
        Alert.alert('Deposit', 'The wallet address has been copied to the clipboard.');
    };



    const handleDeposit = () => {

        if (!amountRef.current || crypto == "") {
            Alert.alert("Deposit", "All fields must not be empty");
            return;
        }
        const coin = storecrypto.filter((item) => item.crypto_name == crypto);
        setMydeposit(coin);

        showdepositmodal.current?.show();

    }

    const uploadProof = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
        });

        //console.log(result.assets[0].uri);

        if (!result.canceled) {
            setProof(result.assets[0]);
        }
    };


    const ConfirmDeposit = async () => {
        showdepositmodal.current?.hide();
        //setLoading(true)
        if (!proof) {
            Alert.alert("Deposit", "Please upload the payment proof");
            return;
        }

        setLoading(true)
        const response = await UserDeposit(user.userid, amountRef.current, crypto, proof);
        //console.log(response);
        setLoading(false)
        if (response.err) {
            Alert.alert("Deposit", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Deposit", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Deposit", response.message, [
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
            <View>
                <SafeAreaView className="flex  p-2">


                    <View className="flex justify-items-center items-center mb-5 mt-5">
                        <Text className="font-semibold text-xl">Make Deposit</Text>
                    </View>

                    <Text className="font-bold text-lg">Fill in the form below to make a Deposit</Text>
                    <View className="flex justify-center mt-5 p-3">

                        {/* The Username Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Select Crypto</Text>
                            <View className="bg-slate-300 rounded-full px-4 p-0 mt-2">
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

                                        <Picker.Item key={index} label={item.crypto_name} value={item.crypto_name} />
                                    ))}
                                </Picker>
                            </View>

                        </View>

                        {/* The Password Here */}
                        <View className="flex-column pt-3 mb-4">
                            <Text className="text-md font-extrabold">Amount</Text>
                            <View className="bg-slate-300 rounded-full p-3 mt-2">
                                <TextInput
                                    onChangeText={value => amountRef.current = value}
                                    className="px-4 font-semibold"
                                    placeholder='Enter deposit amount'
                                    placeholderTextColor={'grey'}
                                    keyboardType='phone-pad'
                                />
                            </View>
                        </View>


                        <TouchableOpacity onPress={handleDeposit} className="bg-blue-500 p-3 rounded-full mt-5" >
                            <Text className="text-center text-xl font-extrabold text-white ">Proceed</Text>
                        </TouchableOpacity>

                    </View>

                    <ActionSheet
                        backgroundInteractionEnabled={false}
                        snapPoints={50}
                        gestureEnabled={true}
                        indicatorStyle={{ backgroundColor: 'grey' }}
                        ref={showdepositmodal}
                    >
                        {
                            mydeposit.map((item, index) => (
                                <View key={index} className="px-3 p-3">
                                    <Text className="font-semibold text-lg uppercase text-center"> Deposit Details </Text>
                                    <View className="flex-column pt-3 mb-4">
                                        <View className="items-center justify-center rounded-md p-3 mt-2">
                                            <Image source={{ uri: WalletImage + item.barcode }}
                                                className=" w-52 h-52"
                                            />
                                        </View>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-lg font-semibold text-center">
                                            Make a deposit of {amountRef.current + item.crypto_name} to the wallet address.
                                        </Text>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Crypto Address</Text>
                                        <View className="flex ">
                                            <View className="bg-slate-300 flex-row items-center justify-end px-2 p-2 space-x-1 rounded-md  mt-2">
                                                <TextInput
                                                    value={item.wallet_addr}
                                                    className="px-0 font-semibold flex-1 text-end"
                                                    placeholderTextColor={'grey'}
                                                    readOnly={true}

                                                />
                                                <TouchableOpacity onPress={() => copywallet(item.wallet_addr)} className=" flex-shrink bg-blue-500 p-2 rounded-md">
                                                    <Text className="font-semibold text-white">Copy</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <TouchableOpacity onPress={uploadProof} className='bg-slate-500 p-3 rounded-lg mt-5 items-center'>
                                            <Text className="text-lg text-white font-semibold uppercase">upload payment proof</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity onPress={ConfirmDeposit} className='bg-blue-500 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">confirm deposit</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </ActionSheet>

                </SafeAreaView>

            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}