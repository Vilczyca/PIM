// app/index.tsx
import { useAppStart } from "@/hooks/use-app-start";
import { Redirect, Stack } from "expo-router";
import { SplashScreen } from "@/components/views/splash-screen";

export default function Index() {
    const appIsReady = useAppStart();

    if (!appIsReady) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SplashScreen />
            </>
        );
    }
    return <Redirect href="/(tabs)/cards" />;
}
