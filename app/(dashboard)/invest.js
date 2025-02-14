import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import { GetAllCoin, GetEarningBalance, GetPlan, UserInvestment, UserWithdrawal, formatCurrency } from '../../Api/ApiActions';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actions-sheet';

export default function Invest() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [balance, setBalance] = useState();
    const [plan, setPlan] = useState();



    const amountRef = useRef('');

    const showinvestmodal = useRef(null);
    const [myinvest, setMyinvest] = useState([]);


    const HandleInvestment = async (id) => {
        if (!amountRef.current) {
            Alert.alert("Investment", "Please enter the amount to invest");
            return;
        }

        // close the modal
        showinvestmodal.current?.hide();

        setLoading(true);
        const response = await UserInvestment(user.userid, amountRef.current, id, user.currency);
        setLoading(false);

        console.log(response);

        if (response.err) {
            Alert.alert("Investment", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Investment", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Investment", response.message, [
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
        getPlan();
        getBalance();
    }, [getPlan]);

    const getBalance = async () => {
        setLoading(true);
        const response = await GetEarningBalance(user.userid, user.currency);
        setLoading(false);

        //console.log(response.tradebal);

        if (response.err) {
            Alert.alert("Investment", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Investment", response.message);
            return;
        } else if (response.status == "success") {
            setBalance(response.tradebal);
            return;
        }
    }

    const getPlan = async () => {
        setLoading(true);
        const response = await GetPlan();
        setLoading(false);

        //console.log(response.data);

        if (response.err) {
            Alert.alert("Investment", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Investment", response.message);
            return;
        } else if (response.status == "success") {
            const dataArray = Object.entries(response.data).map(([index, value]) => ({ index, value }));
            setPlan(dataArray);
            return;
        }
    }


    //this handle the opening of the modal

    const getinvest = (invest) => {
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
                            data={plan}
                            keyExtractor={item => item.index}
                            className="overflow-visible"
                            contentContainerStyle={{ paddingTop: 15 }}
                            renderItem={({ item }) => {
                                return (
                                    <View
                                        key={item.value.id}
                                        onPress={() => viewdata(item.value)}
                                        className="p-3 px-2 rounded-lg drop-shadow-md
                                        bg-teal-800 dark:bg-zinc-800 shadow-black mb-2"
                                    >
                                        <Text className="font-semibold text-2xl text-yellow-500" > {item.value.name} PLAN</Text>
                                        <View className="flex-row items-center justify-between  mt-5 space-x-2">
                                            <View className='flex-1 items-center bg-purple-300 p-4'>
                                                <Text className="font-semibold text-md " > Minimum Amount</Text>
                                                <Text className="font-semibold text-lg " > {user.symbol + formatCurrency(item.value.min)}</Text>
                                            </View>

                                            <View className='flex-1 items-center bg-purple-300 p-4 '>
                                                <Text className="font-semibold text-md " > Maximum Amount</Text>
                                                <Text className="font-semibold text-lg " > {user.symbol + formatCurrency(item.value.max)}</Text>
                                            </View>

                                        </View>

                                        <View className="flex-row items-center justify-between  mt-5 space-x-2">
                                            <View className='flex-1 items-center bg-purple-300 p-4'>
                                                <Text className="font-semibold text-md " > Duration</Text>
                                                <Text className="font-semibold text-lg " > {item.value.duration + " Days"}</Text>
                                            </View>

                                            <View className='flex-1 items-center bg-purple-300 p-4 '>
                                                <Text className="font-semibold text-md " > Returns</Text>
                                                <Text className="font-semibold text-lg " > {item.value.returns}%</Text>
                                            </View>

                                        </View>

                                        <TouchableOpacity onPress={() => getinvest(item.value)} className="bg-purple-600 p-3 rounded-lg mt-5" >
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
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500"> {myinvest.name} plan</Text>

                                    <View className="flex-column pt-3 px-5 mb-4">
                                        <Text className="text-md font-semibold text-center">
                                            You are about to make an investment, please confirm the amount to invest
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


                                    <TouchableOpacity onPress={() => HandleInvestment(myinvest.id)} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
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