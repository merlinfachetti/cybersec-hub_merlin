'use client';

import { useState } from 'react';
import { useCertifications } from '@/lib/hooks/use-certifications';
import { CertificationCard } from '@/components/certifications/certification-card';
import { CertificationFilters } from '@/components/certifications/certification-filters';
import { CertificationPagination } from '@/components/certifications/certification-pagination';
import { CertificationsSkeleton } from '@/components/certifications/certifications-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CertificationsPage() {
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    search: '',
    page: 1,
  });

  const { data, loading, error } = useCertifications({
    level: filters.level || undefined,
    category: filters.category || undefined,
    search: filters.search || undefined,
    page: filters.page,
    limit: 12,
  });

  const handleLevelChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      level: level === 'all' ? '' : level,
      page: 1,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? '' : category,
      page: 1,
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFilters({
      level: '',
      category: '',
      search: '',
      page: 1,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Cybersecurity Certifications
        </h1>
        <p className="text-muted-foreground">
          Explore {data?.pagination.total || '100+'} certifications to advance
          your career
        </p>
      </div>

      <div className="mb-6">
        <CertificationFilters
          level={filters.level}
          category={filters.category}
          search={filters.search}
          onLevelChange={handleLevelChange}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <CertificationsSkeleton />
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No certifications found matching your filters.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
              />
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-8">
              <CertificationPagination
                currentPage={filters.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
