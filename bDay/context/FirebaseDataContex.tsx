import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CalendarRecord } from "@/constants/types";
import { selectAllMyHomie } from "@/components/database";

interface FirebaseContextType {
    calendarData: CalendarRecord[];
    loading: boolean;
    refresh: () => void;
}

const FirebaseDataContext = createContext<FirebaseContextType>({
    calendarData: [],
    loading: true,
    refresh: () => {},
});

// Provider
export const FirebaseDataProvider = ({ children }: { children: ReactNode }) => {
    const [calendarData, setCalendarData] = useState<CalendarRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await selectAllMyHomie();
        if (result) {
            setCalendarData(result);
        }
        setLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        fetchData().then(() => {
            // tylko jeśli komponent nadal zamontowany
            if (!isMounted) return;
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <FirebaseDataContext.Provider value={{ calendarData: calendarData, loading, refresh: fetchData }}>
    {children}
    </FirebaseDataContext.Provider>
);
};

export const useFirebaseData = () => useContext(FirebaseDataContext);
