import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import MyLoading from '../../../components/MyLoading'
import { UserProfile } from '../../../Api/ApiActions'
import { useAuth } from '../../../context/authcontext'
import { router } from 'expo-router'

export default function profile() {


    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([]);
    const [coin, setCoin] = useState([]);

    const { user, logout } = useAuth();

    useEffect(() => {
        getProfile();
    }, [getProfile]);


    const getProfile = async () => {
        setLoading(true);
        const response = await UserProfile(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Deposit History", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            return;
        } else if (response.status == "success") {
            const profileArray = Object.entries(response.profile).map(([index, value]) => ({ index, value }));
            const coinArray = Object.entries(response.coinadetails).map(([index, value]) => ({ index, value }));
            //Setdata(dataArray);
            setProfile(response.profile);
            setCoin(response.coinadetails);
            return;
        }
    }


    const UserLogout = async () => {
        const res = await logout();
        if (res.response) {
            router.replace('../../login')
            Alert.alert("Logout", "Logout Success");
        }

    }

    //console.log(profile)

    // coin.map((item) => {
    //     console.log(item)
    // })

    return (
        <>
            <View className="bg-white flex-1 px-4">
                <ScrollView
                    refreshControl={<RefreshControl refreshing={false} onRefresh={getProfile} />}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        profile.map((item, index) => (
                            <View key={index}>
                                <View className="flex-row space-x-4 items-center">
                                    <View className="bg-blue-200 rounded-full">
                                        <Ionicons name="person-circle-outline" size={65} color="black" />
                                        {/* <Image
                                            source={require('../../../assets/images/sp_icon.png')}
                                        /> */}
                                    </View>
                                    <View>
                                        <Text className="text-lg font-semibold text-gray-900">{item.fullname}</Text>
                                        <View className="flex-row bg-slate-700 items-center justify-start px-1  rounded-full">
                                            <Ionicons name="at-outline" size={20} color="white" />
                                            <Text className="font-medium text-base text-white">{item.username}</Text>
                                        </View>
                                    </View>

                                </View>
                                <View style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 3,
                                        height: 2,
                                    },
                                    shadowOpacity: 2.5,
                                    shadowRadius: 5,
                                    elevation: 3,
                                }}
                                    className="flex bg-slate-100 mt-5 px-4 py-4  rounded-lg">
                                    <View className="flex-row justify-between mb-5">
                                        <Text className="text-base font-semibold">Email:</Text>
                                        <Text>{item.email}</Text>
                                    </View>
                                    {/* <View className="flex-row justify-between mb-5">
                                        <Text className="text-base font-semibold">Gender:</Text>
                                        <Text>{item.gender}</Text>
                                    </View> */}
                                    <View className="flex-row justify-between mb-5">
                                        <Text className="text-base font-semibold">Phone:</Text>
                                        <Text>{item.phone}</Text>
                                    </View>
                                    <View className="flex-row justify-between mb-5">
                                        <Text className="text-base font-semibold">Country:</Text>
                                        <Text>{item.country}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-base font-semibold">Currency:</Text>
                                        <Text>{item.currency}</Text>
                                    </View>

                                </View>
                            </View>

                        ))

                    }




                    <View className="flex bg-slate-100 mt-5 px-4 py-4 rounded-lg mb-5  shadow-yellow-950 drop-shadow-2xl">
                        <Text className="text-blue-800 text-xl font-bold mb-5">Receiving Wallet</Text>

                        {coin.map((item, index) => (
                            <View className="mb-3" key={index}>
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-base font-semibold">{item.name}</Text>
                                    <TouchableOpacity className="bg-blue-400 p-2 rounded-lg">
                                        <Text className="font-semibold">Copy</Text>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    className="bg-slate-200 rounded-lg px-4 p-2"
                                    readOnly
                                    value={item.wallet}
                                />
                            </View>
                        ))}

                    </View>

                </ScrollView>
                <View style={{ zIndex: 1 }} className="mt-5 mb-5  drop">
                    <TouchableOpacity onPress={UserLogout} className="flex-row space-x-3 items-center p-4 border-2 border-red-600 rounded-lg">
                        <Ionicons name='log-out' size={24} />
                        <Text className="font-semibold text-xl">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>



            {loading ? (<MyLoading />) : null}

        </>
    )
}