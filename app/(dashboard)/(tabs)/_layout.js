import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MyColors from '../../../constants/MyColors';





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

    return (
        <Tabs
            initialRouteName='index'
            screenOptions={({ route, focused }) => ({
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "900",
                },
                tabBarInactiveTintColor: '#5b5f67',
                tabBarActiveTintColor: MyColors.primary,
                tabBarIcon: ({ focused }) => BarIcon(route, focused),
                tabBarStyle: {
                    //marginBottom: 5,
                    paddingBottom: 5,
                    height: 60,
                    borderTopColor: MyColors.primary,
                    borderTopWidth: 2,
                    //alignItems: 'center',
                    //borderRadius: 10,
                    //marginHorizontal: 10,
                    //backgroundColor: MyColors.primary,

                },
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />

            <Tabs.Screen
                name="wallets"
                options={{
                    title: 'Wallets',
                    headerShown: true,
                    tabBarLabel: "Wallet",
                    headerTintColor: MyColors.primary,
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: 'bold',
                    },
                    //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: 'Transactions',
                    headerShown: true,
                    tabBarLabel: "History",
                    headerTintColor: MyColors.primary,
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: 'bold',
                    },
                    //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />


            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Account',
                    headerShown: true,
                    tabBarLabel: "Account",
                    headerTintColor: MyColors.primary,
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: 'bold',
                    },
                    //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />


        </Tabs>

    )
}