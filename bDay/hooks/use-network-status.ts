import * as Network from "expo-network";
import {useEffect, useRef, useState} from "react";
import {Platform} from "react-native";
import {router} from "expo-router";

export function useNetworkStatus(intervalMs:number) {
    const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const state = await Network.getNetworkStateAsync();
                let connected = state.isConnected && !!state.isInternetReachable
                setIsOnline(connected);
            } catch {
                setIsOnline(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    const used = useRef<boolean>(false);

    useEffect(() => {
        if (!used.current && isOnline===true) {
            used.current = true;
            router.replace("/loginScreen");
        }
    }, [isOnline]);

    return { isOnline };
}
