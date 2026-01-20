'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import type { RoadmapData } from '@/lib/types';

export function useRoadmap() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchApi<RoadmapData>('/api/roadmap');
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch roadmap')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  return { data, loading, error };
}
