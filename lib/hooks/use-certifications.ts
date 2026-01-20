'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';

export interface CertificationListItem {
  id: string;
  slug: string;
  name: string;
  level: string;
  category: string;
  description: string;
  provider: {
    name: string;
    slug: string;
    logo: string | null;
  };
  costs: Array<{
    region: string;
    currency: string;
    examCost: number;
  }>;
  _count: {
    resources: number;
  };
}

export interface CertificationsResponse {
  data: CertificationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseCertificationsParams {
  level?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useCertifications(params: UseCertificationsParams = {}) {
  const [data, setData] = useState<CertificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();

        if (params.level) queryParams.append('level', params.level);
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `/api/certifications?${queryParams.toString()}`;
        const result = await fetchApi<CertificationsResponse>(url);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch certifications')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [params.level, params.category, params.search, params.page, params.limit]);

  return { data, loading, error };
}
