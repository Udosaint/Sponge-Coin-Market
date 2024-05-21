import { View, Text, FlatList, TouchableOpacity, Modal, Image, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Link, Navigator, router, useNavigation } from 'expo-router'
import MyLoading from '../../components/MyLoading'
import { UserDepositHistory } from '../../Api/ApiActions'
import { useAuth } from '../../context/authcontext'



export default function depositHistory() {

    const navigate = useNavigation()

    useEffect(() => {

        DepositHistory();


    }, [DepositHistory]);



    const { user } = useAuth();
    const [status, Setstatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalvisible, Setmodalvisible] = useState(false);
    const [showmodal, Setshowmodal] = useState([]);
    const [data, Setdata] = useState([]);

    const viewdata = (item) => {
        Setmodalvisible(true);
        Setshowmodal(item)
    }

    const closemodal = () => {
        Setmodalvisible(false);
    }

    const DepositHistory = async () => {
        setLoading(true);
        const response = await UserDepositHistory(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Deposit History", "An error occured. Check your network and try again");
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


    const formatCurrency = (number) => {
        // Convert number to string and split into integer and decimal parts
        const parts = String(number).split('.');
        // Get the integer part
        let integerPart = parts[0];
        // Get the decimal part (if exists)
        const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        // Add commas every three digits in the integer part
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Return the formatted currency string
        return integerPart + decimalPart;
    };



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
                                <View className="items-center justify-center">
                                    <Image source={require('../../assets/images/depview.png')}
                                        className="w-24 h-24 mb-5"
                                    />
                                </View>

                                <View className=" bg-zinc-100 p-5 rounded-lg">

                                    <View className="mb-4">

                                        <Text className="font-extrabold text-lg">{user.symbol + formatCurrency(showmodal.finalamount)}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Payment Mode</Text>
                                        <Text className="font-extrabold text-lg">{showmodal.crypto_name}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Payment Type</Text>
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