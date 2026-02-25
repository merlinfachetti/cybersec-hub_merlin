'use client';

import { useState, useEffect } from 'react';
import { useRoadmap } from '@/lib/hooks/use-roadmap';
import { RoadmapViewer } from '@/components/roadmap/roadmap-viewer';
import { RoadmapLegend } from '@/components/roadmap/roadmap-legend';
import { RoadmapSelector } from '@/components/roadmap/roadmap-selector';
import { RoadmapSkeleton } from '@/components/roadmap/roadmap-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Map, TrendingUp, RotateCcw } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

interface PredefinedRoadmap {
  id: string;
  title: string;
  description: string;
  fromRole: string;
  toRole: string;
  duration: string;
  difficulty: string;
}

interface RoadmapData {
  nodes: Array<{
    id: string;
    certificationId: string;
    name: string;
    level: string;
    category: string;
    highlighted?: boolean;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
  }>;
}

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'predefined'>(
    'predefined'
  );
  const [predefinedRoadmaps, setPredefinedRoadmaps] = useState<
    PredefinedRoadmap[]
  >([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(
    null
  );
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const { data: allData, loading: loadingAll, error: errorAll } = useRoadmap();

  // Carregar lista de roadmaps predefinidos
  useEffect(() => {
    const fetchPredefined = async () => {
      try {
        const result = await fetchApi<{ roadmaps: PredefinedRoadmap[] }>(
          '/api/roadmap/predefined'
        );
        setPredefinedRoadmaps(result.roadmaps);

        // Selecionar primeiro roadmap por padrão
        if (result.roadmaps.length > 0) {
          setSelectedRoadmapId((previous) => previous || result.roadmaps[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch predefined roadmaps:', err);
      }
    };

    fetchPredefined();
  }, []);

  // Carregar dados do roadmap selecionado
  useEffect(() => {
    if (!selectedRoadmapId) return;

    const fetchRoadmapData = async () => {
      try {
        setLoadingRoadmap(true);
        const result = await fetchApi<{ nodes: any[]; edges: any[] }>(
          `/api/roadmap/predefined?id=${selectedRoadmapId}`
        );
        setRoadmapData(result);
      } catch (err) {
        console.error('Failed to fetch roadmap data:', err);
      } finally {
        setLoadingRoadmap(false);
      }
    };

    if (activeTab === 'predefined') {
      fetchRoadmapData();
    }
  }, [selectedRoadmapId, activeTab]);

  const handleResetView = () => {
    setActiveTab('all');
    setSelectedRoadmapId(null);
  };

  const currentData = activeTab === 'all' ? allData : roadmapData;
  const isLoading = activeTab === 'all' ? loadingAll : loadingRoadmap;
  const error = activeTab === 'all' ? errorAll : null;

  if (isLoading && !currentData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <RoadmapSkeleton />
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
            {error.message || 'Failed to load roadmap'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Certification Roadmap
            </h1>
          </div>
          {selectedRoadmapId && (
            <Button variant="outline" onClick={handleResetView}>
              <RotateCcw className="h-4 w-4 mr-2" />
              View All
            </Button>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          {activeTab === 'predefined'
            ? 'Follow proven career paths designed for your goals'
            : 'Explore all certifications and create your own path'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="predefined">Career Paths</TabsTrigger>
          <TabsTrigger value="all">All Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-6 mt-6">
          {/* Roadmap Selector */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Choose Your Career Path
            </h2>
            <RoadmapSelector
              roadmaps={predefinedRoadmaps}
              selectedId={selectedRoadmapId || undefined}
              onSelect={setSelectedRoadmapId}
            />
          </div>

          {/* Stats Cards */}
          {roadmapData && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Certifications
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {roadmapData.nodes.length}
                  </div>
                  <p className="text-xs text-muted-foreground">In this path</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {roadmapData.edges.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dependencies tracked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {predefinedRoadmaps.find((r) => r.id === selectedRoadmapId)
                      ?.difficulty || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {predefinedRoadmaps.find((r) => r.id === selectedRoadmapId)
                      ?.duration || 'N/A'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Roadmap Viewer */}
          {roadmapData && (
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {
                        predefinedRoadmaps.find(
                          (r) => r.id === selectedRoadmapId
                        )?.title
                      }
                    </CardTitle>
                    <CardDescription>
                      Click on any certification to view details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <RoadmapViewer data={roadmapData} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <RoadmapLegend />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Path Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">From:</dt>
                        <dd className="font-medium">
                          {
                            predefinedRoadmaps.find(
                              (r) => r.id === selectedRoadmapId
                            )?.fromRole
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">To:</dt>
                        <dd className="font-medium">
                          {
                            predefinedRoadmaps.find(
                              (r) => r.id === selectedRoadmapId
                            )?.toRole
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Duration:</dt>
                        <dd className="font-medium">
                          {
                            predefinedRoadmaps.find(
                              (r) => r.id === selectedRoadmapId
                            )?.duration
                          }
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6 mt-6">
          {allData && (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Certifications
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allData.nodes.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all levels
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Entry Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allData.nodes.filter((n) => n.level === 'ENTRY').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Great starting points
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Learning Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allData.edges.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Prerequisites tracked
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Roadmap Viewer */}
              <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Certifications</CardTitle>
                      <CardDescription>
                        Complete overview of all available certifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <RoadmapViewer data={allData} />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <RoadmapLegend />
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
