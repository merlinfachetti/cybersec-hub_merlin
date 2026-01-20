import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RoadmapSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="h-[700px] w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
