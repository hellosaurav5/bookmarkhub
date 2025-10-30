'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const AuthInitializer: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
};

