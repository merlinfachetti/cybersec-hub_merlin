'use client';

import { useState, useEffect } from 'react';
import { useResources } from '@/lib/hooks/use-resources';
import { ResourceCard } from '@/components/resources/resource-card';
import { ResourceFilters } from '@/components/resources/resource-filters';
import { ResourcesSkeleton } from '@/components/resources/resources-skeleton';
import { CertificationPagination } from '@/components/certifications/certification-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function ResourcesPage() {
  const [filters, setFilters] = useState({
    certificationId: '',
    type: '',
    isFreeOnly: false,
    minRating: 0,
    search: '',
    orderBy: 'rating',
    page: 1,
  });

  const [certifications, setCertifications] = useState
    Array<{ id: string; name: string }>
  >([]);

  const { data, loading, error } = useResources({
    certificationId: filters.certificationId || undefined,
    type: filters.type || undefined,
    isFree: filters.isFreeOnly || undefined,
    minRating: filters.minRating || undefined,
    search: filters.search || undefined,
    orderBy: filters.orderBy,
    order: 'desc',
    page: filters.page,
    limit: 12,
  });

  // Carregar certificações para filtro
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const result = await fetchApi<{
          data: Array<{ id: string; name: string }>;
        }>('/api/certifications?limit=100');
        setCertifications(result.data);
      } catch (err) {
        console.error('Failed to fetch certifications:', err);
      }
    };

    fetchCertifications();
  }, []);

  const handleCertificationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      certificationId: value === 'all' ? '' : value,
      page: 1,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      type: value === 'all' ? '' : value,
      page: 1,
    }));
  };

  const handleFreeOnlyChange = (checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isFreeOnly: checked,
      page: 1,
    }));
  };

  const handleMinRatingChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: value,
      page: 1,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleOrderByChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFilters({
      certificationId: '',
      type: '',
      isFreeOnly: false,
      minRating: 0,
      search: '',
      orderBy: 'rating',
      page: 1,
    });
  };

  // Calcular estatísticas
  const freeCount = data?.data.filter((r) => r.isFree).length || 0;
  const avgRating =
    data?.data.reduce((sum, r) => sum + (r.rating || 0), 0) /
      (data?.data.filter((r) => r.rating).length || 1) || 0;
  const totalHours =
    data?.data.reduce((sum, r) => sum + (r.durationHours || 0), 0) || 0;

  if (loading && !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Study Resources
          </h1>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
        <ResourcesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Study Resources
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Curated learning materials from the best providers
        </p>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resources
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.pagination.total}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all certifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Free Resources
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freeCount}</div>
              <p className="text-xs text-muted-foreground">
                {((freeCount / data.data.length) * 100).toFixed(0)}% of current
                results
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Hours
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}h</div>
              <p className="text-xs text-muted-foreground">
                Of learning content
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Resources Grid */}
        <div className="lg:col-span-3">
          {data && data.data.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No resources found matching your filters.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
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

        {/* Sidebar Filters */}
        <div>
          <ResourceFilters
            certifications={certifications}
            selectedCertification={filters.certificationId}
            selectedType={filters.type}
            isFreeOnly={filters.isFreeOnly}
            minRating={filters.minRating}
            search={filters.search}
            orderBy={filters.orderBy}
            onCertificationChange={handleCertificationChange}
            onTypeChange={handleTypeChange}
            onFreeOnlyChange={handleFreeOnlyChange}
            onMinRatingChange={handleMinRatingChange}
            onSearchChange={handleSearchChange}
            onOrderByChange={handleOrderByChange}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}