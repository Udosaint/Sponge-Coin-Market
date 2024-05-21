import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../../context/authcontext'
import { UserDashboard } from '../../../Api/ApiActions'
import MyLoading from '../../../components/MyLoading'

export default function index() {

    const [loading, setloading] = useState(false);
    const [balance, setBalance] = useState("0.00");
    const [earning, setEarning] = useState();
    const [earn, setEarn] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        getDashboardBalance();
        //getCrptoBalance();
    }, [getDashboardBalance]);

    //console.log(user);

    const getDashboardBalance = async () => {
        setloading(true);

        const response = await UserDashboard(user.userid, user.currency);

        setloading(false);
        //console.log(response);

        if (response.err) {
            console.log(response.err);
            Alert.alert("Dashboard", "An error occured. Check your network and try again", [
                {
                    text: 'Ok',
                    onPress: () => { getDashboardBalance }
                },
            ]);
            return;
        } else if (response.status) {
            setBalance(response.totalbal);
            const dataArray = Object.entries(response.earning).map(([key, value]) => ({ key, value }));
            setEarning(dataArray);
            setEarn(response.earning);

            return;
        }
        console.log(earn);
        console.log("error occured");
    }




    const goDeposit = () => {
        router.push('../deposit');
    }

    const gowithdraw = () => {
        router.push('../withdraw');
    }






    return (
        <>
            <View className="bg-purple-50 flex-1">
                <SafeAreaView className="flex p-3">

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={getDashboardBalance} />
                        }
                    >

                        <View className="flex-row items-center justify-between mb-5">
                            <Image
                                style={{ width: 160, height: 30 }}
                                source={require('../../../assets/images/sp_icon.png')}
                                className="w-12 h-14"
                            />
                            <TouchableOpacity className="text-blue-200 dark:text-white rounded-lg p-2" >
                                <MaterialIcons name="notifications-on" size={24} color="purple" />
                            </TouchableOpacity>
                        </View>

                        <View className="px-3 mb-5">
                            <Text className="font-semibold text-xl dark:text-white">Hi,  {user.username} 👋</Text>
                        </View>

                        <View className=" bg-purple-900 dark:bg-purple-800 relative rounded-xl h-40 p-5 shadow-lg shadow-blue-900 sh">
                            <Image
                                source={require('../../../assets/images/coins1.png')}
                                className="absolute w-full opacity-10"

                                style={{ height: 160 }}
                            />
                            <View className="flex">
                                <View className=" mb-3">
                                    <Text className="text-white  text-lg font-bold mb-1">Total Balance</Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white text-2xl font-light">{user.symbol + balance}</Text>
                                        <Ionicons name="reload-circle" onPress={getDashboardBalance} size={30} color="white" />
                                    </View>
                                </View>
                                <View className="flex-row mb-2 gap-5">
                                    <TouchableOpacity
                                        className="flex-row items-center bg-slate-300 rounded-xl space-x-1 px-3 p-2"
                                        onPress={goDeposit}
                                    >
                                        <Ionicons name="add-circle" size={24} color="yellow" />
                                        <Text className="text-base font-bold text-purple-800">Deposit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-row space-x-1 items-center bg-slate-300 rounded-xl px-3"
                                        onPress={gowithdraw}
                                    >
                                        <Ionicons name="arrow-up-circle" size={24} color="yellow" />
                                        <Text className="text-base font-bold text-purple-800">Withdraw</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                        <View className="px-5 mt-6">
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={earning}
                                keyExtractor={item => item.key}
                                className="overflow-visible"
                                horizontal
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ backgroundColor: '#989FCE' }} className=" p-5 w-60 px-5 rounded-lg mr-2 drop-shadow-md shadow-black">
                                            <Text className="font-semibold text-xl p-2 " >{item.value.title}</Text>
                                            <Text className="font-bold px-2 text-lg text-yellow-200" >{user.symbol + item.value.amount}</Text>
                                        </View>

                                    )
                                }}
                            />

                        </View>
                        <Text className="text-black mt-5 font-extrabold mb-2 text-base capitalize">Other Actions</Text>


                        <View className="flex-1">
                            <View className="flex-row gap-3 mb-3">
                                <TouchableOpacity
                                    onPress={() => router.push('../invest')}
                                    className="flex-1 w-1/2 h-24 p-5 rounded-xl bg-purple-200 shadow-md items-center justify-center">
                                    <Image
                                        source={require('../../../assets/images/invest.png')}
                                        className="w-12 h-14 mt-4"
                                    />
                                    <Text className="text-black font-extrabold text-xl mb-4">Investment</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => router.push('../estate')}
                                    className="flex-1 w-1/2 h-24 p-5 rounded-xl bg-purple-200 shadow-md items-center justify-center">
                                    <Image

                                        source={require('../../../assets/images/estate.png')}
                                        className="w-12 h-14 mt-4"
                                    />
                                    <Text className="text-black font-extrabold text-xl mb-4">Real Estate</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => router.push('../transfer')}
                                    className="flex-1 w-1/2 h-24 p-5 rounded-xl bg-purple-200 shadow-md items-center justify-center">
                                    <Image
                                        source={require('../../../assets/images/transfer.png')}
                                        className="w-12 h-14 mt-4"
                                    />
                                    <Text className="text-black font-extrabold text-xl mb-4">Tranfer Money</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('../history')} className="flex-1 w-1/2 h-24 p-5 rounded-xl bg-purple-200 shadow-md items-center justify-center">
                                    <Image
                                        source={require('../../../assets/images/deposit.png')}
                                        className="w-12 h-14 mt-4"
                                    />
                                    <Text className="text-black font-extrabold text-xl mb-4">Transactions</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </ScrollView>
                </SafeAreaView>

            </View>
            {loading ? (<MyLoading />) : null}

        </>
    )
}