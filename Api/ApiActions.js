import React from 'react'
import axios from 'axios'

import { Coin, CoinBalance, CryptoBalance, DashboardLink, DepositHistoryLink, DepositLink, ForgotPasswordLink, OtherTransactionLink, ProfileLink, ResetPasswordLink, SendCoinLink, SendOTPLink, SwapCoinLink, SwapTransactionLink, VerifyOTPLink, Wallet, WithdrawHistoryLink, WithdrawLink } from './MyApi'


export const SendVerifyEmail = async (email) => {

    try {

        const formdata = new FormData();

        formdata.append('email', email);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(SendOTPLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserVerifyEmail = async (username, otp) => {

    try {

        const formdata = new FormData();

        formdata.append('username', username);
        formdata.append('otp', otp);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(VerifyOTPLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserForgorPassword = async (email) => {

    try {

        const formdata = new FormData();

        formdata.append('email', email);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(ForgotPasswordLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserResetPassword = async (email, otp, password, conpassword) => {

    try {

        const formdata = new FormData();

        formdata.append('email', email);
        formdata.append('otp', otp);
        formdata.append('password', password);
        formdata.append('conpassword', conpassword);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(ResetPasswordLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserDashboard = async (userid, currency) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('currency', currency);


        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(DashboardLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserDeposit = async (userid, amount, type, proof) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('amount', amount);
        formdata.append('type', type);
        formdata.append('proof', {
            uri: proof.uri,
            type: proof.mimeType,
            name: proof.fileName
        });


        const config = {
            headers: {

                'Content-Type': 'multipart/form-data',
                "cache-control": "no-cache",
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
        };
        const response = await axios.post(DepositLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while depositing in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserWithdrawal = async (userid, amount, type, wallet, account) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('amount', amount);
        formdata.append('type', type);
        formdata.append('wallet', wallet);
        formdata.append('account', account);


        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(WithdrawLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}



export const UserWithdrawalHistory = async (userid) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(WithdrawHistoryLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}





export const UserDepositHistory = async (userid) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(DepositHistoryLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}



export const UserProfile = async (userid) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(ProfileLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error.response);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserSweapTransaction = async (userid) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(SwapTransactionLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserOtherTransaction = async (userid) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(OtherTransactionLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while logging in:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserCoinBalance = async (userid, currency) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('currency', currency);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(CoinBalance, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while getting coinlist:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}

export const UserCryptoBalance = async (userid, currency) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('currency', currency);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(CryptoBalance, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while getting coinlist:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserSendCoin = async (userid, amount, coin, wallet) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        formdata.append('amount', amount);
        formdata.append('coin', coin);
        formdata.append('wallet_address', wallet);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(SendCoinLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while Sending Coin:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const UserSwapCoin = async (userid, amount, coin, swapto, receive) => {

    try {

        const formdata = new FormData();

        formdata.append('user_id', userid);
        //formdata.append('coinprice', coinprice);
        formdata.append('amount', amount);
        formdata.append('swapto', swapto);
        formdata.append('coin', coin);
        formdata.append('receive', receive);



        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.post(SwapCoinLink, formdata, config);
        return response.data;

    } catch (error) {
        console.error('Error while swapping Coin:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const GetCrypto = async () => {

    try {

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.get(Wallet);
        return response.data;

    } catch (error) {
        console.error('Error while getting crypto:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}


export const GetAllCoin = async () => {

    try {

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axios.get(Coin);
        return response.data;

    } catch (error) {
        console.error('Error while getting crypto:', error);
        return { err: "An error occured. Check your network and try again" };
    }

}





export const formatCurrency = (number) => {
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