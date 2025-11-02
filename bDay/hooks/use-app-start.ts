// hooks/use-app-start.ts
import { useState, useEffect } from 'react';

export function useAppStart() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // TODO: Loading database
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (e) {
                console.warn('Błąd ładowania aplikacji:', e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    return appIsReady;
}