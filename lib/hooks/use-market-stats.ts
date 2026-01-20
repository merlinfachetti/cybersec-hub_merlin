'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';

export interface MarketStats {
  summary: {
    totalJobs: number;
    avgSalaryImpact: number;
    regionsTracked: number;
    certificationsTracked: number;
  };
  byRegion: Array<{
    region: string;
    totalJobs: number;
    certifications: number;
    avgImpact: number;
    topDemand: string[];
  }>;
  details: Array<{
    id: string;
    region: string;
    country: string | null;
    demandLevel: string;
    jobPostingsCount: number | null;
    averageSalaryImpact: number | null;
    juniorSalaryRange: string | null;
    midSalaryRange: string | null;
    seniorSalaryRange: string | null;
    topCompanies: string[];
    governmentRequired: boolean;
    certification: {
      id: string;
      name: string;
      level: string;
      category: string;
    };
  }>;
}

export interface UseMarketStatsParams {
  certificationId?: string;
  region?: string;
}

export function useMarketStats(params: UseMarketStatsParams = {}) {
  const [data, setData] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (params.certificationId)
          queryParams.append('certificationId', params.certificationId);
        if (params.region) queryParams.append('region', params.region);

        const url = `/api/market/stats?${queryParams.toString()}`;
        const result = await fetchApi<MarketStats>(url);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch market stats')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [params.certificationId, params.region]);

  return { data, loading, error };
}
