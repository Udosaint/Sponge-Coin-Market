import { View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/authcontext'
import { formatCurrency } from '../Api/ApiActions';

export default function SwapTransaction({ data }) {
    const { user } = useAuth();
    const [modalvisible, Setmodalvisible] = useState(false);
    const [showmodal, Setshowmodal] = useState([]);

    const viewdata = (item) => {
        Setmodalvisible(true);
        Setshowmodal(item)
    }

    const closemodal = () => {
        Setmodalvisible(false);
    }

    //console.log(data)


    return (
        <View className="flex-1">
            <FlatList
                // refreshControl={<RefreshControl refreshing={false} onRefresh={depositHistory} />}
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
                                    <Ionicons name="arrow-down-circle-outline" size={30} color="green" />
                                    <View className="items-start">
                                        <View className="flex-row items-center space-x-2">
                                            <Text className="font-semibold text" >{item.value.crypto_name}</Text>
                                            <Ionicons name="arrow-forward-outline" size={15} color="green" />
                                            <Text className="font-semibold text" >{item.value.swapto}</Text>
                                        </View>
                                        <Text className="font-semibold text-md " >{item.value.date_added}</Text>
                                    </View>

                                </View>

                                <View className="items-end text-end">
                                    <Text className="font-bold text-base items-end" >{item.value.quantity + " " + item.value.swapto}</Text>
                                </View>

                            </View>

                        </TouchableOpacity>


                    )
                }}
            />

            <Modal
                visible={modalvisible}
                animationType='slide'
                transparent={true}

            >
                <View style={{ backgroundColor: "rgba(0,0,0,0.8)" }} className="flex-1 ">
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
                        className="bg-white flex-1 mt-10 mb-2 mx-3 p-3 rounded-lg"
                    >
                        <View className="items-center justify-center">
                            <Image source={require('../assets/images/depview.png')}
                                className="w-24 h-24 mb-5"
                            />
                        </View>

                        <View style={{
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 5,
                                height: 3,
                            },
                            shadowOpacity: 1.3,
                            shadowRadius: 4,
                            elevation: 4,
                        }} className=" bg-zinc-100 p-5 rounded-lg">

                            <View className="mb-4">
                                <Text>Swap From</Text>
                                <Text className="font-extrabold text-lg">{showmodal.swapamnt + " " + showmodal.crypto_name}</Text>
                                <View className="border-b-2 border-blue-800 mt-2" />
                            </View>
                            <View className="mb-4">
                                <Text>Swap To</Text>
                                <Text className="font-extrabold text-lg">{showmodal.quantity + " " + showmodal.swapto}</Text>
                                <View className="border-b-2 border-blue-800 mt-2" />
                            </View>
                            <View className="mb-4">
                                <Text>Transaction Type</Text>
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

                            <View className="mb-4">
                                <Text>Transaction ID</Text>
                                <Text className="font-extrabold text-lg">{showmodal.transc_id}</Text>
                            </View>

                        </View>

                        <TouchableOpacity onPress={closemodal} className='bg-blue-500 p-3 rounded-lg mt-5 items-center'>
                            <Text className="text-lg text-white font-bold ">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </View>
    )
}