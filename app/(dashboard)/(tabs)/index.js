import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../../context/authcontext'
import { UserCryptoBalance, UserDashboard } from '../../../Api/ApiActions'
import MyLoading from '../../../components/MyLoading'

export default function index() {

    const [loading, setloading] = useState(false);
    const [balance, setBalance] = useState("0.00");
    const [earning, setEarning] = useState();
    const [deposit, setDeposit] = useState("0.00");
    const [withdraw, setWithdraw] = useState("0.00");
    const [invest, setInvest] = useState("0.00");
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
        //console.log(response.earning);

        if (response.err) {
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
            setDeposit(response.deposit);
            setWithdraw(response.withdraw);
            setInvest(response.invest);
            //console.log(dataArray);
            return;
        } else {
            Alert.alert("Dashboard", "An error occured, pull down to refresh", [
                {
                    text: 'Ok',
                    onPress: () => { getDashboardBalance }
                },
            ]);
            return;
        }
    }



    const getCrptoBalance = async () => {
        setloading(true);

        const response = await UserCryptoBalance(user.userid, user.currency);


        //console.log(response.earning);

        if (response.err) {
            Alert.alert("Dashboard", "An error occured. Check your network and try again", [
                {
                    text: 'Ok',
                    onPress: () => { getDashboardBalance }
                },
            ]);
            return;
        } else if (response.status) {
            setBalance(balance);
            setloading(false);
            return;
        } else {
            setBalance(balance);
            setloading(false);
            return;
        }
    }

    //console.log(earning);

    const goDeposit = () => {
        router.push('../deposit');
    }

    const gowithdraw = () => {
        router.push('../withdraw');
    }


    return (
        <>
            <View>
                <SafeAreaView className="flex p-2">

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={getDashboardBalance} />
                        }
                    >

                        <View className="flex-row items-center justify-between mb-5">
                            <Image
                                source={require('../../../assets/images/sp_icon.png')}
                                className="w-12 h-14"
                            />
                            <TouchableOpacity className="text-blue-200 rounded-lg p-2" >
                                <MaterialIcons name="notifications-on" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View className="px-3 mb-5">
                            <Text className="font-semibold text-xl">Hi,  {user.username} 👋</Text>
                        </View>

                        <View className=" bg-slate-900 relative rounded-xl h-40 p-5 shadow-lg shadow-blue-900 sh">
                            <Image
                                source={require('../../../assets/images/coins1.png')}
                                className="absolute w-full opacity-10"

                                style={{ height: 160 }}
                            />
                            <View className="flex">
                                <View className=" mb-3">
                                    <Text className="text-white  text-lg font-bold mb-1">Balance</Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white text-xl font-light">{user.symbol + balance}</Text>
                                        <Ionicons name="reload-circle" onPress={getCrptoBalance} size={30} color="white" />
                                    </View>
                                </View>
                                <View className="flex-row mb-2 gap-5">
                                    <TouchableOpacity
                                        className="flex-row items-center bg-slate-600 rounded-full space-x-1 px-3 p-2"
                                        onPress={goDeposit}
                                    >
                                        <Ionicons name="add-circle" size={24} color="yellow" />
                                        <Text className="text-base font-bold text-white">Add Money</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-row space-x-1 items-center bg-slate-600 rounded-full px-3"
                                        onPress={gowithdraw}
                                    >
                                        <Ionicons name="arrow-up-circle" size={24} color="yellow" />
                                        <Text className="text-base font-bold text-white">Withdraw</Text>
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
                                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} className="p-5 w-60 px-5 rounded-lg mr-2 drop-shadow-md shadow-black">
                                            <Text className="font-semibold text-lg p-2" >{item.value.title}</Text>
                                            <Text className="font-normal px-2 text-yellow-200" >{user.symbol + item.value.amount}</Text>
                                        </View>

                                    )
                                }}
                            />

                        </View>
                        <Text className="text-black mt-5 font-extrabold mb-2 text-base capitalize">Account Summary</Text>


                        <View className=" bg-slate-300 px-4  p-4  rounded shadow-md shadow-blue-600">

                            <View className="flex mb-6 mt-4 items-center justify-between flex-row border-b-2 border-spacing-5 border-sky-800">
                                <Text className="text-black font-extrabold">Total Deposit</Text>
                                <Text className="text-black font-extrabold">{user.symbol + deposit}</Text>
                            </View>
                            <View className="flex mb-6 items-center justify-between flex-row border-b-2 border-spacing-5 border-sky-800">
                                <Text className="text-black font-extrabold">Total Withdrawal</Text>
                                <Text className="text-black font-extrabold">{user.symbol + withdraw}</Text>
                            </View>
                            <View className="flex mb-6 items-center justify-between flex-row border-b-2 border-spacing-5 border-sky-800">
                                <Text className="text-black font-extrabold">Total Investment</Text>
                                <Text className="text-black font-extrabold">{user.symbol + invest}</Text>
                            </View>

                        </View>

                    </ScrollView>
                </SafeAreaView>

            </View>
            {loading ? (<MyLoading />) : null}

        </>
    )
}