import { View, Text, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../../components/MyLoading'
import { UserCoinBalance, UserSendCoin, UserSwapCoin } from '../../../Api/ApiActions';
import { useAuth } from '../../../context/authcontext';
import ActionSheet from 'react-native-actions-sheet';

export default function wallets() {

    const [loading, setLoading] = useState(false);

    const [coinlist, setCoinlist] = useState([]);

    const showsendmodal = useRef(null);
    const showswapmodal = useRef(null);

    const walletRef = useRef("");
    const coinamountRef = useRef("");
    const amountRef = useRef("");

    const [modalswap, setModalswap] = useState([]);
    const [swapto, setSwapto] = useState([]);
    const [modalsend, setModalsend] = useState([]);

    const { user } = useAuth();


    useEffect(() => {
        GetCoinList();
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
            const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            //setCoinlist(dataArray);
            setCoinlist(response.data);
            return;
        }
    }

    const getswapcoin = (mydata) => {
        showswapmodal.current?.show();
        const filtered = coinlist.filter((data) => data.symbol != mydata.symbol);
        const data = filtered.map((val) => val)
        setSwapto(filtered)
        //setSwapto(data)
        setModalswap(mydata)

        //console.log()



    }


    const SwapCoin = async (swapFromPrice, swapFrom, swapToPrice, swapTo) => {


        if (!amountRef.current) {
            Alert.alert("Swap Coin", "Enter the amount to swap")
            return;
        }

        const receive = ((swapFromPrice * amountRef.current) / swapToPrice).toFixed(2);

        setLoading(true);
        showswapmodal.current?.hide();
        const response = await UserSwapCoin(user.userid, amountRef.current, swapFrom, swapTo, receive)
        setLoading(false);
        if (response.err) {
            Alert.alert("Swap Coin", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Alert.alert("Swap Coin", response.message);
            return;
        } else if (response.status == "success") {
            Alert.alert("Swap Coin", response.message, [
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
        showsendmodal.current?.show();
        setModalsend(item)

    }



    const SendCoin = async (coin) => {

        if (!walletRef.current || !coinamountRef.current) {
            Alert.alert("Send Coin", "Enter fill all fields");
            return;
        }
        setLoading(true);
        showsendmodal.current?.hide();
        const response = await UserSendCoin(user.userid, coinamountRef.current, coin, walletRef.current)
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





    return (

        <>
            <View className="pt-5 bg-white flex-1">
                <View className="px-5 mt-5">
                    <FlatList
                        refreshControl={<RefreshControl refreshing={false} onRefresh={GetCoinList} />}
                        showsHorizontalScrollIndicator={false}
                        data={coinlist}
                        keyExtractor={item => item.name}
                        className="overflow-visible"
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={null}
                                    className="p-5 w-full px-3 rounded-lg mr-2 drop-shadow-md
                                                bg-slate-300 shadow-black mb-5"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className='flex-row items-center space-x-2'>
                                            <Image
                                                source={{ uri: item.link }}
                                                loadingIndicatorSource={require('../../../assets/images/sp_icon.png')}
                                                className="w-10 h-10"
                                            />
                                            <View className="items-start">
                                                <Text className="font-semibold text-lg uppercase" >{item.name}</Text>
                                                <Text className="font-semibold text-md " >{item.symbol}</Text>
                                            </View>

                                        </View>

                                        <View className="items-end">
                                            <Text className="font-semibold text-lg  text-end" >{item.amount}</Text>
                                            <Text className="font-bold text-md text-end" >{user.symbol + item.balance}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center justify-between mt-5 space-x-4">
                                        <TouchableOpacity onPress={() => getswapcoin(item)} className="bg-blue-500 p-3 rounded-md flex-1">
                                            <Text className="font-semibold text-white text-center uppercase">Swap {item.symbol}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => getsendcoin(item)} className="bg-red-500 p-3 rounded-md flex-1">
                                            <Text className="font-semibold text-white text-center uppercase">Send {item.symbol}</Text>
                                        </TouchableOpacity>
                                    </View>


                                </TouchableOpacity>

                            )
                        }}
                    />
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
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
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
                                <View className="bg-slate-300 rounded-full p-3 mt-2">
                                    <TextInput
                                        onChangeText={value => walletRef.current = value}
                                        className="px-4 font-semibold"
                                        placeholder={'Enter ' + modalsend.symbol + ' wallet address'}
                                        placeholderTextColor={'grey'}

                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => SendCoin(modalsend.symbol)} className='bg-blue-500 p-3 rounded-lg mt-5 items-center'>
                                <Text className="text-lg text-white font-semibold uppercase">Send {modalsend.name}</Text>
                            </TouchableOpacity>
                        </View>
                    </ActionSheet>


                    <ActionSheet
                        backgroundInteractionEnabled={false}
                        snapPoints={50}
                        gestureEnabled={true}
                        indicatorStyle={{ backgroundColor: 'grey' }}
                        ref={showswapmodal}
                    >
                        {
                            swapto.map((item, index) => (
                                <View key={index} className="px-3 p-5 mt-5 mb-10">
                                    <Text className="font-semibold text-lg uppercase text-center"> swap coin </Text>
                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Swap From</Text>
                                        <View className="bg-slate-300 rounded-full p-3 mt-2">
                                            <TextInput
                                                value={modalswap.symbol}
                                                className="px-4 font-semibold"
                                                placeholderTextColor={'grey'}
                                                editable={false}

                                            />
                                        </View>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Swap To</Text>
                                        <View className="bg-slate-300 rounded-full p-3 mt-2">
                                            <TextInput
                                                value={item.symbol}
                                                className="px-4 font-semibold"
                                                placeholderTextColor={'grey'}
                                                editable={false}

                                            />
                                        </View>
                                    </View>

                                    <View className="flex-column pt-3 mb-4">
                                        <Text className="text-md font-extrabold">Swap Amount</Text>
                                        <View className="bg-slate-300 rounded-full p-3 mt-2">
                                            <TextInput
                                                onChangeText={value => amountRef.current = value}
                                                className="px-4 font-semibold"
                                                placeholder={'Enter amount of ' + modalswap.symbol + ' to swap'}
                                                placeholderTextColor={'grey'}
                                                keyboardType='phone-pad'
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => SwapCoin(modalswap.priceUsd, modalswap.symbol, item.priceUsd, item.symbol)} className='bg-blue-500 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">swap {modalswap.symbol}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </ActionSheet>


                </View>

            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}