import React, { createContext, useContext } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";

type NetworkContextType = {
    isOnline: boolean | undefined;
};

const NetworkContext = createContext<NetworkContextType>({
    isOnline: undefined,
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isOnline } = useNetworkStatus(2000);
    return (
        <NetworkContext.Provider value={{ isOnline }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => useContext(NetworkContext);
