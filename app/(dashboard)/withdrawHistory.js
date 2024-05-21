import { View, Text, FlatList, TouchableOpacity, Modal, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Link, Navigator, router, useNavigation } from 'expo-router'
import MyLoading from '../../components/MyLoading'
import { UserWithdrawalHistory, formatCurrency } from '../../Api/ApiActions'
import { useAuth } from '../../context/authcontext'



export default function withdrawHistory() {

    const navigate = useNavigation()

    useEffect(() => {

        getWithdrawalHistory();


    }, [getWithdrawalHistory]);


    const [status, Setstatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modalvisible, Setmodalvisible] = useState(false);
    const [showmodal, Setshowmodal] = useState([]);

    const [data, Setdata] = useState([]);

    const { user } = useAuth();

    const viewdata = (item) => {
        Setmodalvisible(true);
        Setshowmodal(item)
    }

    const closemodal = () => {
        Setmodalvisible(false);
    }


    const getWithdrawalHistory = async () => {
        setLoading(true);
        const response = await UserWithdrawalHistory(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Withdrwal History", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            Setstatus(true)
            return;
        } else if (response.status == "success") {
            Setstatus(false)
            const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            Setdata(dataArray);
            return;
        }

    }

    //console.log(data)




    return (
        <>
            {
                status ? (

                    <View className="flex-1 items-center justify-center">
                        <Ionicons name="ban-outline" size={70} color="grey" />
                        <Text className="font-semibold text-lg"> No Data found</Text>

                    </View>

                ) : (

                    <View className="flex-1 bg-white px-2">
                        <FlatList
                            refreshControl={<RefreshControl refreshing={false} onRefresh={getWithdrawalHistory} />}
                            showsHorizontalScrollIndicator={false}
                            data={data}
                            keyExtractor={item => item.key}
                            className="overflow-visible"
                            renderItem={({ item }) => {
                                return (

                                    <TouchableOpacity
                                        onPress={() => viewdata(item.value)}
                                        className="p-5 w-full px-4 
                                rounded-lg mr-2 drop-shadow-md
                                bg-slate-200 shadow-black mb-2"
                                    >

                                        <View className="flex-row items-center justify-between w-full">
                                            <View className='flex-row items-center space-x-5 '>
                                                <Ionicons name="arrow-up-circle-outline" size={30} color="red" />
                                                <View className="items-start">
                                                    <Text className="font-semibold text-lg " >{item.value.crypto_name}</Text>
                                                    <Text className="font-semibold text-md " >{item.value.date_added}</Text>
                                                </View>

                                            </View>

                                            <View className="items-end text-end">
                                                <Text className="font-semibold text-base items-end" >{user.symbol + formatCurrency(item.value.finalamount)}</Text>
                                            </View>

                                        </View>

                                    </TouchableOpacity>


                                )
                            }}
                        />

                        <Modal
                            // style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                            visible={modalvisible}
                            animationType='slide'
                            transparent={false}

                        >
                            <View
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 5,
                                        height: 3,
                                    },
                                    shadowOpacity: 1.3,
                                    shadowRadius: 4,
                                    elevation: 6,
                                }}
                                className="bg-white flex-1 mt-20 mb-2 mx-3 p-3 rounded-lg"
                            >
                                {/* <View className="items-center justify-center">
                                    <Image source={require('../../assets/images/depview.png')}
                                        className="w-24 h-24 mb-5"
                                    />
                                </View> */}

                                <View className=" bg-zinc-100 p-5 rounded-lg mt-5">

                                    <View className="mb-4">
                                        <Text className="font-extrabold text-lg">{user.symbol + formatCurrency(showmodal.finalamount)}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Crypto</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.crypto_name}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Wallet Address</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.wallet_addr}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Withdrawal From</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.transc_type}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Date</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.date_added}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Status</Text>
                                        <Text
                                            className={showmodal.status == 1 ? "text-green-500 text-lg font-extrabold" : "text-orange-500 text-lg font-extrabold" + " text-base"}
                                        >{showmodal.status == 1 ? "Complete" : "Pending"}
                                        </Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>

                                    <View className="mb-2">
                                        <Text>Transaction ID</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.transc_id}</Text>
                                    </View>

                                </View>

                                <TouchableOpacity onPress={closemodal} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                    <Text className="text-lg text-white font-bold ">Close</Text>
                                </TouchableOpacity>
                            </View>

                        </Modal>

                    </View>
                )
            }
            {loading ? (<MyLoading />) : null}

        </>
    )
}