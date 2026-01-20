'use client';

import { useRoadmap } from '@/lib/hooks/use-roadmap';
import { RoadmapViewer } from '@/components/roadmap/roadmap-viewer';
import { RoadmapLegend } from '@/components/roadmap/roadmap-legend';
import { RoadmapSkeleton } from '@/components/roadmap/roadmap-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Map, TrendingUp } from 'lucide-react';

export default function RoadmapPage() {
  const { data, loading, error } = useRoadmap();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <RoadmapSkeleton />
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
            {error?.message || 'Failed to load roadmap'}
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
          <Map className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Certification Roadmap
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Visualize your path from beginner to expert. Click on any
          certification to learn more.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Certifications
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.nodes.length}</div>
            <p className="text-xs text-muted-foreground">Across all levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entry Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.nodes.filter((n) => n.level === 'ENTRY').length}
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
            <div className="text-2xl font-bold">{data.edges.length}</div>
            <p className="text-xs text-muted-foreground">
              Prerequisites tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Roadmap Viewer */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Roadmap</CardTitle>
              <CardDescription>
                Explore certification paths and prerequisites
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RoadmapViewer data={data} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RoadmapLegend />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Start with entry-level certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Follow arrows for recommended progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Advanced certs require prerequisites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Click any node to see full details</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
