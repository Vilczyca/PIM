import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CalendarRecord } from "@/constants/types";
import {selectAllMyHomie, selectRegisteredUsers} from "@/components/database";

interface FirebaseContextType {
    calendarData: CalendarRecord[];
    usersData: CalendarRecord[];
    loading: boolean;
    refresh: () => void;
}

const FirebaseDataContext = createContext<FirebaseContextType>({
    calendarData: [],
    usersData: [],
    loading: true,
    refresh: () => {},
});

// Provider
export const FirebaseDataProvider = ({ children }: { children: ReactNode }) => {
    const [calendarData, setCalendarData] = useState<CalendarRecord[]>([]);
    const [usersData, setUsersData] = useState<CalendarRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await selectAllMyHomie();
        if (result) {
            setCalendarData(result);
        }

        const result2 = await selectRegisteredUsers();
        if (result2) {
            setUsersData(result2);
        }
        setLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        fetchData().then(() => {
            if (!isMounted) return;
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <FirebaseDataContext.Provider value={{ calendarData: calendarData, usersData: usersData, loading, refresh: fetchData }}>
    {children}
    </FirebaseDataContext.Provider>
);
};

export const useFirebaseData = () => useContext(FirebaseDataContext);
