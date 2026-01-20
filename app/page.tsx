import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {APP_DESCRIPTION}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Certifications</CardTitle>
              <CardDescription>
                Explore 100+ cybersecurity certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/certifications">Browse Certifications</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗺️ Career Roadmap</CardTitle>
              <CardDescription>
                Visualize your path to success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/roadmap">View Roadmap</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Market Insights</CardTitle>
              <CardDescription>
                Demand and salary data by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/market">Explore Market</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            🚀 Project Setup Complete - Sprint 1 in Progress
          </p>
        </div>
      </div>
    </main>
  );
}