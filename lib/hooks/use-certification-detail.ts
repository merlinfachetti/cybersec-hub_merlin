'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import type { CertificationDetail } from '@/lib/types';

export function useCertificationDetail(id: string) {
  const [data, setData] = useState<CertificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchApi<CertificationDetail>(
          `/api/certifications/${id}`
        );

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch certification')
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertification();
    }
  }, [id]);

  return { data, loading, error };
}
