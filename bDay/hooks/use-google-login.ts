import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/constants/firebase';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_EXPO_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, access_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token, access_token);

            signInWithCredential(auth, credential)
                .then(() => {
                    router.replace("/cards");
                })
                .catch((error) => {
                    throw error;
                });
        } else if (response?.type === 'error') {
            throw new Error("Google login error");
        }
    }, [response]);

    return { promptAsync, isLoading: !request };
};