// hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '@/constants/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setIsLoading(false);
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
  };

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ useAuth: User is signed in:', user.email);
      } else {
        console.log('❌ useAuth: No user signed in');
      }
      
      setUser(user);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }, (error) => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, isLoading, isDemoMode, enableDemoMode, disableDemoMode };
};