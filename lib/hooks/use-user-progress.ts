'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import type { UserProgress, UserStats } from '@/lib/types';

interface UserProgressResponse {
  data: UserProgress[];
  stats: UserStats;
}

export function useUserProgress() {
  const [data, setData] = useState<UserProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await fetchApi<UserProgressResponse>('/api/user/progress');
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch progress')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const refetch = async () => {
    const result = await fetchApi<UserProgressResponse>('/api/user/progress');
    setData(result);
  };

  return { data, loading, error, refetch };
}
