'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  provider: string;
  url: string;
  description: string | null;
  cost: number;
  currency: string;
  isFree: boolean;
  rating: number | null;
  reviewsCount: number | null;
  language: string;
  durationHours: number | null;
  certification: {
    id: string;
    name: string;
    slug: string;
    level: string;
  };
}

export interface ResourcesResponse {
  data: ResourceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseResourcesParams {
  certificationId?: string;
  type?: string;
  isFree?: boolean;
  minRating?: number;
  language?: string;
  search?: string;
  orderBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export function useResources(params: UseResourcesParams = {}) {
  const [data, setData] = useState<ResourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();

        if (params.certificationId)
          queryParams.append('certificationId', params.certificationId);
        if (params.type) queryParams.append('type', params.type);
        if (params.isFree !== undefined)
          queryParams.append('isFree', params.isFree.toString());
        if (params.minRating)
          queryParams.append('minRating', params.minRating.toString());
        if (params.language) queryParams.append('language', params.language);
        if (params.search) queryParams.append('search', params.search);
        if (params.orderBy) queryParams.append('orderBy', params.orderBy);
        if (params.order) queryParams.append('order', params.order);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `/api/resources?${queryParams.toString()}`;
        const result = await fetchApi<ResourcesResponse>(url);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch resources')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [
    params.certificationId,
    params.type,
    params.isFree,
    params.minRating,
    params.language,
    params.search,
    params.orderBy,
    params.order,
    params.page,
    params.limit,
  ]);

  return { data, loading, error };
}
