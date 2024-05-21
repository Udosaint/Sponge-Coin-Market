import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyLoading from '../../components/MyLoading';
import OtherTransaction from '../../components/OtherTransaction';
import { UserOtherTransaction } from '../../Api/ApiActions';
import { useAuth } from '../../context/authcontext';



export default function history() {

    useEffect(() => {
        getOthersHistory();
    }, []);

    const [loading, setLoading] = useState(false);

    const [otherData, setOtherData] = useState();

    const { user } = useAuth();


    const getOthersHistory = async () => {
        setLoading(true);
        const response = await UserOtherTransaction(user.userid);
        setLoading(false);

        //console.log(response);

        if (response.err) {
            Alert.alert("Others History", "An error occured. Check your network and try again");
            return;
        } else if (response.status == "error") {
            return;
        } else if (response.status == "success") {
            const dataArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            setOtherData(dataArray);
            return;
        }
    }



    return (

        <>
            <View className="flex-1 bg-white">

                <View className='flex-1 px-4'>

                    <OtherTransaction data={otherData} />
                </View>



            </View>

            {loading ? (<MyLoading />) : null}

        </>
    )
}