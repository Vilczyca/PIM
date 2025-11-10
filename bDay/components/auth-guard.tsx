import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colors = useColors();

  useEffect(() => {
    if (isLoading) return;

    const isOnLoginScreen = segments[0] === '(screens)' && segments[1] === 'loginScreen';

    if (!user && !isOnLoginScreen) {
      router.replace('/(screens)/loginScreen');
    } else if (user && isOnLoginScreen) {
      router.replace('/(tabs)/calendar');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}