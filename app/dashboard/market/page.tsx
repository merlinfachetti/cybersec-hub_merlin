'use client';

import { useState, useEffect } from 'react';
import { useMarketStats } from '@/lib/hooks/use-market-stats';
import { MarketDemandChart } from '@/components/market/market-demand-chart';
import { SalaryImpactChart } from '@/components/market/salary-impact-chart';
import { TopCompaniesTable } from '@/components/market/top-companies-table';
import { MarketFilters } from '@/components/market/market-filters';
import { MarketSkeleton } from '@/components/market/market-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Globe2, 
  Award,
  AlertCircle 
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function MarketPage() {
  const [filters, setFilters] = useState({
    certificationId: '',
    region: '',
  });

  const [certifications, setCertifications] = useState
    Array<{ id: string; name: string }>
  >([]);

  const { data, loading, error } = useMarketStats({
    certificationId: filters.certificationId || undefined,
    region: filters.region || undefined,
  });

  // Carregar lista de certificações para filtro
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
    }));
  };

  const handleRegionChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      region: value === 'all' ? '' : value,
    }));
  };

  const handleReset = () => {
    setFilters({
      certificationId: '',
      region: '',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <MarketSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load market data'}
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
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Market Analysis
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Explore demand, salaries, and hiring trends across regions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Job Postings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalJobs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Salary Impact
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{data.summary.avgSalaryImpact}%
            </div>
            <p className="text-xs text-muted-foreground">
              With certification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regions Tracked
            </CardTitle>
            <Globe2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.regionsTracked}
            </div>
            <p className="text-xs text-muted-foreground">
              Global coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certifications
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.certificationsTracked}
            </div>
            <p className="text-xs text-muted-foreground">
              With market data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Charts */}
        <div className="lg:col-span-3 space-y-6">
          <MarketDemandChart data={data.byRegion} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <SalaryImpactChart data={data.byRegion} />
            
            <Card>
              <CardHeader>
                <CardTitle>Top Demand Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.byRegion.slice(0, 5).map((region) => (
                    <div key={region.region}>
                      <p className="text-sm font-medium mb-2">
                        {region.region}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {region.topDemand.slice(0, 3).map((cert) => (
                          <span
                            key={cert}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <TopCompaniesTable data={data.details} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <MarketFilters
            certifications={certifications}
            selectedCertification={filters.certificationId}
            selectedRegion={filters.region}
            onCertificationChange={handleCertificationChange}
            onRegionChange={handleRegionChange}
            onReset={handleReset}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    North America shows highest demand with{' '}
                    {data.byRegion
                      .find((r) => r.region === 'NORTH_AMERICA')
                      ?.totalJobs.toLocaleString() || 'N/A'}{' '}
                    job postings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Average salary increase of {data.summary.avgSalaryImpact}%
                    across all regions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Europe shows strong demand for OSCP and advanced
                    certifications
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Government positions often require Security+ as baseline
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}