import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CalendarRecord } from "@/constants/types";
import {selectAllMyHomie, selectRegisteredUsers} from "@/components/database";
import {useAuth} from "@/hooks/use-auth";

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
    const { user, isLoading } = useAuth();
    const [calendarData, setCalendarData] = useState<CalendarRecord[]>([]);
    const [usersData, setUsersData] = useState<CalendarRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (isLoading || !user) return;
        setLoading(true);

        try {
            const result = await selectAllMyHomie(user.uid);
            if (result) setCalendarData(result);

            const result2 = await selectRegisteredUsers();
            if (result2) setUsersData(result2);
        } catch (err) {
            console.error("Błąd przy pobieraniu danych:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, [user, isLoading]);

    return (
        <FirebaseDataContext.Provider value={{ calendarData: calendarData, usersData: usersData, loading, refresh: fetchData }}>
    {children}
    </FirebaseDataContext.Provider>
);
};

export const useFirebaseData = () => useContext(FirebaseDataContext);
