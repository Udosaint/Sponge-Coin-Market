import { View, Text, useColorScheme, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, Tabs, router } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MyColors from '../../constants/MyColors';





const BarIcon = (route, focused) => {
    let icon;


    if (route.name === 'index') {
        icon = focused ? <Ionicons name='home' size={24} color={MyColors.primary} /> : <Ionicons name='home-outline' size={24} color="#5b5f67" />
    }

    else if (route.name === 'wallets') {
        icon = focused ? <Ionicons name='wallet' size={24} color={MyColors.primary} /> : <Ionicons name='wallet-outline' size={24} color="#5b5f67" />
    } else if (route.name === 'profile') {
        icon = focused ? <Ionicons name='person' size={24} color={MyColors.primary} /> : <Ionicons name='person-outline' size={24} color="#5b5f67" />
    } else if (route.name === 'history') {
        icon = focused ? <Ionicons name='bar-chart' size={24} color={MyColors.primary} /> : <Ionicons name='bar-chart-outline' size={24} color="#5b5f67" />
    }


    return (
        <View >
            {icon}
        </View>
    )
}

export default function _layout() {

    const colorScheme = useColorScheme();

    const getdeposit = () => {
        router.push('../(dashboard)/depositHistory');
    }

    const getwithdraw = () => {
        router.push('../(dashboard)/withdrawHistory');
    }

    return (
        <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{

                }} initialRouteName='index'
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="deposit"
                    options={{
                        headerTitle: "Deposit",
                        headerShadowVisible: false,
                        headerTintColor: MyColors.primary,
                        headerTitleAlign: 'center',
                        headerRight: () => (
                            <TouchableOpacity onPress={getdeposit} className="flex-row items-center justify-center">
                                <Ionicons name="list" size={26} color={MyColors.primary} />
                            </TouchableOpacity>
                        ),
                        headerTitleStyle: {
                            fontSize: 22,
                            fontWeight: 'bold',
                        },
                    }}
                />

                <Stack.Screen
                    name='viewDeposit'
                    options={{
                        headerShown: false,
                        presentation: "modal"
                    }}
                />
                <Stack.Screen
                    name="depositHistory"
                    options={{
                        headerTitle: "Deposit History",
                        headerShadowVisible: false,
                        headerTintColor: MyColors.primary,
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontSize: 22,
                            fontWeight: 'bold',
                        },
                    }}
                />
                <Stack.Screen
                    name="withdraw"
                    options={{
                        headerTitle: "Withdrawal",
                        headerShadowVisible: false,
                        headerTintColor: MyColors.primary,
                        headerTitleAlign: 'center',
                        headerRight: () => (
                            <TouchableOpacity onPress={getwithdraw} className="flex-row items-center justify-center">
                                <Ionicons name="list" size={26} color={MyColors.primary} />
                            </TouchableOpacity>
                        ),
                        headerTitleStyle: {
                            fontSize: 22,
                            fontWeight: 'bold',
                        },
                    }}
                />

                <Stack.Screen
                    name="withdrawHistory"
                    options={{
                        headerTitle: "Withdrawal History",
                        headerShadowVisible: false,
                        headerTintColor: MyColors.primary,
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontSize: 22,
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Stack>
        </ThemeProvider>

    )
}