import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useAuth } from '@/context/authcontext';
import { router } from 'expo-router';

export default function Index() {

  return (

    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
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