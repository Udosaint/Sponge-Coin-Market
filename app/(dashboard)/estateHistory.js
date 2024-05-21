import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, FlatList, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyLoading from '../../components/MyLoading'
import { useAuth } from '../../context/authcontext';
import { UserEstateHistory, UserInvestmentHistory, formatCurrency } from '../../Api/ApiActions';
import ActionSheet from 'react-native-actions-sheet';

export default function EstateHistory() {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [estate, setEstate] = useState();



    const amountRef = useRef('');

    const showinvestmodal = useRef(null);
    const [myinvest, setMyinvest] = useState([]);



    useEffect(() => {
        getHistory();
    }, [getHistory]);



    const getHistory = async () => {
        setLoading(true);
        const response = await UserEstateHistory(user.userid);
        setLoading(false);

        //console.log(response);

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

                    <View className="flex-1 px-3">
                        <FlatList
                            // refreshControl={<RefreshControl refreshing={false} onRefresh={depositHistory} />}
                            showsHorizontalScrollIndicator={false}
                            data={estate}
                            keyExtractor={item => item.key}
                            className="overflow-visible"
                            contentContainerStyle={{ paddingTop: 15 }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        key={item.value.id}
                                        onPress={() => getrealestate(item.value)}
                                        className="p-3 px-2 rounded-lg drop-shadow-md
                                        bg-teal-800 dark:bg-zinc-800 shadow-black mb-3"

                                    >
                                        <View className="">
                                            <Text className="font-bold text-lg " > {item.value.name}</Text>

                                            <View className='flex-row items-center justify-between mt-2'>
                                                <Text className="font-semibold text-md text-gray-600" > {user.symbol + formatCurrency(item.value.amount)}</Text>
                                                <Text className="font-semibold text-md text-gray-500 " > {item.value.start}</Text>
                                            </View>

                                        </View>

                                    </TouchableOpacity>


                                )
                            }}
                        />


                        <ActionSheet
                            backgroundInteractionEnabled={false}
                            snapPoints={100}
                            gestureEnabled={true}
                            indicatorStyle={{ backgroundColor: 'grey', padding: 5, marginTop: 5 }}
                            ref={showinvestmodal}
                        >
                            {
                                <View className="px-5 p-5 mb-5">
                                    <Text className="font-semibold text-lg uppercase text-center text-yellow-500 mb-5">Investment Details</Text>

                                    <View className="mb-4">
                                        <Text>Investment Amount</Text>
                                        <Text className="font-extrabold text-lg">{user.symbol + formatCurrency(myinvest.amount)}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Investment Returns</Text>
                                        <Text className="font-extrabold text-lg">{user.symbol + formatCurrency(myinvest.returns)}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Estate Name</Text>
                                        <Text className="font-extrabold text-lg">{myinvest.name}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Investment Duration</Text>
                                        <Text className="font-extrabold text-lg">{myinvest.duration}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Investment Start</Text>
                                        <Text className="font-extrabold text-lg">{myinvest.start}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Investment Ends</Text>
                                        <Text className="font-extrabold text-lg">{myinvest.end}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Status</Text>
                                        <Text
                                            className={myinvest.status == 1 ? "text-green-500 text-lg font-extrabold" : "text-orange-500 text-lg font-extrabold" + " text-base"}
                                        >{myinvest.status == 1 ? "Complete" : "Pending"}
                                        </Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>
                                    <View className="mb-4">
                                        <Text>Reference </Text>
                                        <Text className="font-extrabold text-lg">{myinvest.ref}</Text>
                                        <View className="border-b-2 border-blue-800 mt-2" />
                                    </View>

                                    <TouchableOpacity onPress={() => showinvestmodal.current?.hide()} className='bg-purple-600 p-3 rounded-lg mt-5 items-center'>
                                        <Text className="text-lg text-white font-semibold uppercase">close</Text>
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