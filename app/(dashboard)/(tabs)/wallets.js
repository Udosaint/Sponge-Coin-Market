import { View, Text, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../../components/MyLoading'
import { CoinCap, UserBuyCoin, UserCoinBalance, UserSellCoin, UserSendCoin, UserSwapCoin } from '../../../Api/ApiActions';
import { useAuth } from '../../../context/authcontext';
import ActionSheet from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';

export default function wallets() {

    const [loading, setLoading] = useState(false);

    const [coinlist, setCoinlist] = useState([]);

    const showsendmodal = useRef(null);
    const showBuySellModal = useRef(null);
    const showdetailmodal = useRef(null);

    const walletRef = useRef("");
    const coinamountRef = useRef("");
    const amountRef = useRef("");

    const [coinMode, setCoinMode] = useState([]);
    const [modalsend, setModalsend] = useState([]);

    const [balance, setBalance] = useState("0.00");
    const [balance2, setBalance2] = useState("0.00");

    const [coinview, setCoinView] = useState([]);
    const [percentage, setPercentage] = useState();

    const { user } = useAuth();

    const [currentDateTime, setCurrentDateTime] = useState({
        date: '',
        time: ''
    });

    useEffect(() => {

        GetCoinList();
        const intervalId = setInterval(() => {
            const now = new Date();

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[now.getMonth()];
            const day = String(now.getDate()).padStart(2, '0');

            const hours = now.getHours() % 12 || 12;
            const amPm = now.getHours() >= 12 ? 'PM' : 'AM';
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const formattedDate = `${month} ${day}, ${String(hours).padStart(2, '0')}: ${minutes} ${amPm}`;

            setCurrentDateTime({
                date: formattedDate,
            });
        }, 1000);

        return () => clearInterval(intervalId);

    }, [GetCoinList]);


    const GetCoinList = async () => {
        setLoading(true);

        const response = await UserCoinBalance(user.userid, user.currency);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("My Wallet", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            //setStatus(true)
            return;
        } else if (response.status == "success") {
            //setStatus(false)
            //const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            //setCoinlist(dataArray);
            setCoinlist(response.assets);
            setBalance(response.balance);
            setBalance2(response.trade);
            return;
        }
    }

    const getCoinMode = (mode) => {
        showdetailmodal.current?.hide();
        showBuySellModal.current?.show();
        setCoinMode(mode)

    }


    const handleBuyAction = async () => {

        if (!amountRef.current) {
            Alert.alert(coinMode + " Coin", "Enter  amount ")
            return;
        }

        setLoading(true);
        showBuySellModal.current?.hide();
        const response = await UserBuyCoin(user.userid, amountRef.current, coinview.name, user.currency)

        //console.log(coinview.name);
        setLoading(false);
        if (response.err) {
            Alert.alert(coinMode + " Coin", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert(coinMode + " Coin", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert(coinMode + " Coin", response.message, [
                {
                    text: 'OKAY',
                    onPress: () => GetCoinList(),
                    style: 'default'
                }
            ]);
            return;

        }

    }


    const handleSellAction = async () => {

        if (!amountRef.current) {
            Alert.alert(coinMode + " Coin", "Enter  amount ")
            return;
        }

        setLoading(true);
        showBuySellModal.current?.hide();
        const response = await UserSellCoin(user.userid, amountRef.current, coinview.name, user.currency)

        //console.log(coinview.name);
        setLoading(false);
        if (response.err) {
            Alert.alert(coinMode + " Coin", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert(coinMode + " Coin", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert(coinMode + " Coin", response.message, [
                {
                    text: 'OKAY',
                    onPress: () => GetCoinList(),
                    style: 'default'
                }
            ]);
            return;

        }

    }


    const getsendcoin = (item) => {
        showdetailmodal.current?.hide();
        showsendmodal.current?.show();
        setModalsend(item)

    }

    const getdetail = (coin) => {
        showdetailmodal.current?.show();
        setCoinView(coin)
        CoinCapApi(coin.name)

    }



    const SendCoin = async (coin) => {

        if (!walletRef.current || !coinamountRef.current) {
            Alert.alert("Send Coin", "Enter fill all fields");
            return;
        }
        setLoading(true);
        showsendmodal.current?.hide();
        const response = await UserSendCoin(user.userid, coinamountRef.current, coin, walletRef.current, user.currency)
        setLoading(false);
        if (response.err) {
            Alert.alert("Send Coin", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Send Coin", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Send Coin", response.message, [
                {
                    text: 'OKAY',
                    onPress: () => GetCoinList(),
                    style: 'default'
                }
            ]);
            return;

        }

    }


    const CoinCapApi = async (coinname) => {
        const response = await CoinCap(coinname);

        setPercentage(parseFloat(response.data.changePercent24Hr).toFixed(2));
    }



    return (

        <>
            <View className=" bg-white flex-1">
                <KeyboardAvoidingView className="flex-1">
                    <View style={{ zIndex: 1, }} className="border-b-4 border-yellow-200 dark:border-slate-900">
                        <View
                            className="flex-row justify-between bg-purple-900 dark:bg-purple-800  h-20 p-2 px-5 shadow-lg shadow-blue-900">
                            <View>
                                <Text className="text-white  text-lg font-bold mb-0">Assets Balance</Text>
                                <Text className="text-gray-400 text-lg font-bold">{user.symbol + balance}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white  text-lg text-end font-bold mb-0">Trade Balance</Text>
                                <Text className="text-gray-400 text-lg text-end font-bold">{user.symbol + balance2}</Text>
                            </View>
                        </View>

                    </View>
                    <View className="flex-1 px-4 mb-1">
                        <FlatList
                            refreshControl={<RefreshControl refreshing={false} onRefresh={GetCoinList} />}
                            showsHorizontalScrollIndicator={false}
                            data={coinlist}
                            keyExtractor={item => item.name}
                            className="overflow-visible"
                            contentContainerStyle={{ paddingTop: 8 }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => getdetail(item)}
                                        className="p-3 w-full px-3 rounded-lg mr-2 drop-shadow-md
                                                bg-slate-300 shadow-black mb-3"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View className='flex-row items-center space-x-2'>
                                                <Image
                                                    source={{ uri: item.link }}
                                                    loadingIndicatorSource={require('../../../assets/images/sp_icon.png')}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <View className="items-start">
                                                    <Text className="font-semibold text-md capitalize" >{item.updatedname}</Text>
                                                    <Text className="font-semibold text-md " >{item.symbol}</Text>
                                                </View>

                                            </View>

                                            <View className="items-end">
                                                <Text className="font-semibold text-lg  text-end" >{item.amount}</Text>
                                                <Text className="font-bold text-md text-end" >{user.symbol + item.balance}</Text>
                                            </View>
                                        </View>

                                    </TouchableOpacity>

                                )
                            }}
                        />

                        {/* This is to show a detail of the coin */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            gestureEnabled={true}
                            snapPoints={50}
                            indicatorStyle={{ backgroundColor: 'grey' }}
                            ref={showdetailmodal}
                        >
                            <View className="px-3 p-5  mb-10">
                                <View className="flex-row items-center justify-between rounded-lg mb-5 p-3 bg-gray-300">
                                    <View className='flex-row items-center space-x-2'>
                                        <Image
                                            source={{ uri: coinview.link }}
                                            loadingIndicatorSource={require('../../../assets/images/sp_icon.png')}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <View className="items-start">
                                            <Text className="font-semibold text-md capitalize text-gray-700" >{user.symbol + coinview.price}</Text>
                                            <Text className="font-bold text-lg capitalize" >{coinview.updatedname}</Text>
                                        </View>

                                    </View>

                                    <View className="items-end">
                                        {percentage > 0 ? (
                                            <View className="flex-row justify-center items-center" >
                                                <Ionicons name="arrow-up-outline" size={18} color="green" />
                                                <Text className="font-semibold text-lg  text-end text-green-600">{percentage} %</Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row justify-center items-center" >
                                                <Ionicons name="arrow-down-outline" size={18} color="red" />
                                                <Text className="font-semibold text-lg  text-end text-[#e13434]">{percentage} %</Text>
                                            </View>
                                        )}
                                        <Text className="font-bold text-lg text-end text-yellow-600" >{currentDateTime.date}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between rounded-lg mb-5 p-3 bg-gray-300">
                                    <View className='flex-row items-center space-x-2'>
                                        <View className="items-start">
                                            <Text className="font-semibold text-md capitalize text-gray-700" >Balance</Text>
                                            <Text className="font-bold text-xl uppercase" >{coinview.amount + ' ' + coinview.symbol}</Text>
                                        </View>
                                    </View>

                                    <View className="items-end">
                                        <Text className="font-semibold text-md  text-end text-gray-700" >Value</Text>
                                        <Text className="font-bold text-xl text-end" >{user.symbol + coinview.balance}</Text>
                                    </View>
                                </View>


                                <View className="flex-row items-center justify-between space-x-2">
                                    <TouchableOpacity onPress={() => getCoinMode("Buy")}
                                        className='flex-1 bg-green-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-md text-white font-semibold uppercase">Buy {coinview.symbol}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => getCoinMode("Sell")}
                                        className='flex-1 bg-red-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-md text-white font-semibold uppercase">Sell {coinview.symbol}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => getsendcoin(coinview)}
                                        className='flex-1 bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-md text-white font-semibold uppercase">Send {coinview.symbol}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ActionSheet>

                        {/* This is to Send coin */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            gestureEnabled={true}
                            snapPoints={50}
                            indicatorStyle={{ backgroundColor: 'grey' }}
                            ref={showsendmodal}
                        >
                            <View className="px-3 p-5 mt-5 mb-10">
                                <Text className="font-semibold text-lg uppercase text-center"> send coin </Text>
                                <View className="flex-column pt-3 mb-4">
                                    <Text className="text-md font-extrabold">Send Amount</Text>
                                    <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                        <TextInput
                                            onChangeText={value => coinamountRef.current = value}
                                            className="px-4 font-semibold"
                                            placeholder={'Enter amount of ' + modalsend.symbol + ' to send'}
                                            placeholderTextColor={'grey'}
                                            keyboardType='phone-pad'
                                        />
                                    </View>
                                </View>
                                <View className="flex-column pt-3 mb-4">
                                    <Text className="text-md font-extrabold">Wallet Address</Text>
                                    <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                        <TextInput
                                            onChangeText={value => walletRef.current = value}
                                            className="px-4 font-semibold"
                                            placeholder={'Enter ' + modalsend.symbol + ' wallet address'}
                                            placeholderTextColor={'grey'}

                                        />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => SendCoin(modalsend.symbol)} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                    <Text className="text-lg text-white font-semibold uppercase">Send {modalsend.symbol}</Text>
                                </TouchableOpacity>
                            </View>
                        </ActionSheet>

                        {/* This is to Buy and Sell coin */}
                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={50}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey' }}
                            ref={showBuySellModal}
                        >
                            <View className="px-3 p-5 mt-5 mb-10">
                                <Text className="font-semibold text-lg uppercase text-center"> {coinMode + ' ' + coinview.symbol} </Text>

                                <View className="flex-column pt-3 mb-4">
                                    <Text className="text-md font-extrabold">Enter Amount</Text>
                                    <View className="bg-slate-300 rounded-xl p-3 mt-2">
                                        <TextInput
                                            onChangeText={value => amountRef.current = value}
                                            className="px-4 font-semibold"
                                            placeholder={'Enter amount to ' + coinMode}
                                            placeholderTextColor={'grey'}
                                            keyboardType='phone-pad'
                                        />
                                    </View>
                                </View>
                                {
                                    coinMode == "Buy" ? (
                                        <TouchableOpacity
                                            onPress={() => handleBuyAction()}
                                            className='bg-green-600 p-3 rounded-lg mt-5 items-center'>
                                            <Text className="text-lg text-white font-semibold uppercase">{coinMode + ' ' + coinview.symbol}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleSellAction()}
                                            className='bg-red-600 p-3 rounded-lg mt-5 items-center'>
                                            <Text className="text-lg text-white font-semibold uppercase">{coinMode + ' ' + coinview.symbol}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </ActionSheet>


                    </View>
                </KeyboardAvoidingView>

            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}