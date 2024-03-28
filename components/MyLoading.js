import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function MyLoading({ size }) {
    return (
        // <View style={{ height: size, aspectRatio: 1 }}>
        //     <LottieView
        //         autoPlay
        //         loop
        //         style={{ flex: 1 }}
        //         source={require('../assets/images/loading.json')}
        //     />
        // </View>

        <View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    //backgroundColor: "rgba(0,0,0,0.9)",
                    backgroundColor: "white",
                    //opacity: 0.9,
                    zIndex: 1
                }
            ]}
        >
            <View style={{ height: 70, aspectRatio: 1 }}>
                <LottieView
                    autoPlay
                    loop
                    style={{ flex: 1 }}
                    source={require('../assets/images/loading2.json')}
                />
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        //flex: 2,
        aspectRatio: 1,
        height: 50,
        justifyContent: 'center',
        alignContent: "center",
        backgroundColor: "rgb(0.0.0.0.3)",
        zIndex: 1
    }
})