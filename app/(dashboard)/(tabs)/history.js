import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyColors from '../../../constants/MyColors';
import { Ionicons } from '@expo/vector-icons';
import MyLoading from '../../../components/MyLoading';
import OtherTransaction from '../../../components/OtherTransaction';
import SwapTransaction from '../../../components/SwapTransaction';
import { UserOtherTransaction, UserSweapTransaction } from '../../../Api/ApiActions';
import { useAuth } from '../../../context/authcontext';



export default function history() {

    useEffect(() => {
        setTab(true);
        getSwapHistory();
    }, []);

    const [status, setStatus] = useState(false)
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(false);

    const [swapData, setSwapData] = useState();
    const [otherData, setOtherData] = useState();

    const { user } = useAuth();

    const getSwapHistory = async () => {
        setTab(true);

        setLoading(true);
        const response = await UserSweapTransaction(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Swap History", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            setStatus(true)
            return;
        } else if (response.status == "success") {
            setStatus(false)
            const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            setSwapData(dataArray);
            return;
        }

    }

    const getOthersHistory = async () => {
        setTab(false);
        setLoading(true);
        const response = await UserOtherTransaction(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Others History", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            setStatus(true)
            return;
        } else if (response.status == "success") {
            setStatus(false)
            const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            setOtherData(dataArray);
            return;
        }
    }



    return (

        <>
            <View className="flex-1 bg-white">

                <View className="fixed top-0">
                    <View style={{ zIndex: 1 }} className="flex-row items-center bg-white justify-center space-x-2 pb-5">
                        <TouchableOpacity
                            onPress={getSwapHistory}
                            style={{ backgroundColor: tab ? MyColors.primary : '#c4ccd4' }}
                            className="items-center p-2 w-40 rounded-md"
                        >
                            <Text className="text-lg font-bold text-white">
                                Swap
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={getOthersHistory}
                            style={{ backgroundColor: !tab ? MyColors.primary : '#c4ccd4' }}
                            className="p-2 w-40 rounded-md items-center "
                        >
                            <Text className="text-lg font-bold text-white">
                                Others
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    status ? (
                        <View className="flex-1 items-center justify-center">
                            <Ionicons name="ban-outline" size={70} color="grey" />
                            <Text className="font-semibold text-lg"> No Data found</Text>

                        </View>
                    ) :
                        (
                            <View className='flex-1 px-4'>
                                {
                                    tab ? (
                                        <SwapTransaction data={swapData} />
                                    ) :
                                        (
                                            <OtherTransaction data={otherData} />
                                        )
                                }


                            </View>
                        )
                }






            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}