import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, FlatList, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import { GetEarningBalance, GetEstate, UserEstateInvestment, UserInvestment, formatCurrency } from '../../Api/ApiActions';
import { router } from 'expo-router';
import ActionSheet from 'react-native-actions-sheet';
import { EstateImageLink } from '../../Api/MyApi';

export default function Estate() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [balance, setBalance] = useState();
    const [estate, setEstate] = useState();



    const amountRef = useRef('');

    const showinvestmodal = useRef(null);
    const [myinvest, setMyinvest] = useState([]);


    const HandleInvestment = async (id, durations) => {
        if (!amountRef.current) {
            Alert.alert("Real Estate", "Please enter the amount to invest");
            return;
        }

        // close the modal
        showinvestmodal.current?.hide();

        setLoading(true);
        const response = await UserEstateInvestment(user.userid, amountRef.current, id, durations);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Real Estate", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Real Estate", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Real Estate", response.message, [
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
        getEstate();
        getBalance();
    }, [getEstate]);



    // show the portfolio balance to carryout the investment
    const getBalance = async () => {
        setLoading(true);
        const response = await GetEarningBalance(user.userid, user.currency);
        setLoading(false);

        //console.log(response.tradebal);

        if (response.err) {
            Alert.alert("Real Estate", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Real Estate", response.message);
            return;
        } else if (response.status == "success") {
            setBalance(response.tradebal);
            return;
        }
    }

    const getEstate = async () => {
        setLoading(true);
        const response = await GetEstate();
        setLoading(false);

        //console.log(response.data);

        if (response.err) {
            Alert.alert("Real Estate", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Real Estate", response.message);
            return;
        } else if (response.status == "success") {
            const dataArray = Object.entries(response.data).map(([index, value]) => ({ index, value }));
            setEstate(dataArray);
            return;
        }
    }


    //this handle the opening of the modal

    const getrealestate = (invest) => {
        showinvestmodal.current?.show();
        setMyinvest(invest);

    }

    return (
        <>
            <View className="flex-1">
                <KeyboardAvoidingView className="flex-1">
                    <View style={{ zIndex: 2, }} className="border-b-4 border-yellow-200 dark:border-slate-900">
                        <View

                            className=" bg-purple-900 dark:bg-purple-800  h-24 p-2 px-5 shadow-lg shadow-blue-900">
                            <Text className="text-white  text-lg font-bold mb-2">Trade Balance</Text>
                            <Text className="text-white text-2xl font-semibold">{user.symbol + balance}</Text>
                        </View>
                    </View>
                    <View className="flex-1 px-3">
                        <FlatList
                            // refreshControl={<RefreshControl refreshing={false} onRefresh={depositHistory} />}
                            showsHorizontalScrollIndicator={false}
                            data={estate}
                            keyExtractor={item => item.index}
                            className="overflow-visible"
                            contentContainerStyle={{ paddingTop: 15 }}
                            renderItem={({ item }) => {
                                return (
                                    <View
                                        key={item.value.id}
                                        onPress={() => viewdata(item.value)}
                                        className="p-3 px-2 rounded-lg drop-shadow-md
                                        bg-teal-800 dark:bg-zinc-800 shadow-black mb-3"

                                    >
                                        <Image

                                            source={{ uri: EstateImageLink + item.value.image }}
                                            className=" h-40 -mt-1 mb-3 rounded-lg"
                                        />
                                        <Text className="font-semibold text-2xl text-center items-center text-yellow-500" > {item.value.estate_name}</Text>
                                        <View className="flex-row items-center justify-between  mt-5 space-x-2">
                                            <View className='flex-1 items-center bg-purple-300 p-4'>
                                                <Text className="font-semibold text-md " > Minimum Amount</Text>
                                                <Text className="font-semibold text-lg " > {user.symbol + formatCurrency(item.value.amount)}</Text>
                                            </View>

                                            <View className='flex-1 items-center bg-purple-300 p-4 '>
                                                <Text className="font-semibold text-md " > ROI</Text>
                                                <Text className="font-semibold text-lg " > {item.value.roi}%</Text>
                                            </View>

                                        </View>

                                        <TouchableOpacity onPress={() => getrealestate(item.value)} className="bg-purple-600 p-3 rounded-lg mt-5" >
                                            <Text className="text-center text-xl font-extrabold text-white ">INVEST</Text>
                                        </TouchableOpacity>

                                    </View>


                                )
                            }}
                        />


                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={100}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey' }}
                            ref={showinvestmodal}
                        >
                            {
                                <View className="px-5 p-3 mb-5">
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500"> Real Estate Investment</Text>

                                    <View className="flex-column pt-3 px-5 mb-4">
                                        <Text className="text-md font-semibold text-center">
                                            You are about to invest in {myinvest.estate_name} please confirm your investment amount and proceed
                                        </Text>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Invest Amount</Text>
                                        <View className="flex ">
                                            <View className="bg-slate-300 py-3 rounded-md  mt-2">
                                                <TextInput
                                                    onChangeText={value => amountRef.current = value}
                                                    className="px-4 font-semibold"
                                                    placeholder='Enter deposit amount'
                                                    placeholderTextColor={'grey'}
                                                    keyboardType='phone-pad'

                                                />
                                            </View>
                                        </View>
                                    </View>


                                    <TouchableOpacity onPress={() => HandleInvestment(myinvest.main_id, myinvest.duration)} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">confirm investment</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ActionSheet>


                    </View>


                </KeyboardAvoidingView>
            </View >

            {loading ? (<MyLoading />) : null}

        </>
    )
}