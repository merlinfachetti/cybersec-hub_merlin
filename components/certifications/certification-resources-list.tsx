import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { CertificationDetail } from '@/lib/types';

interface CertificationResourcesListProps {
  resources: CertificationDetail['resources'];
}

const resourceTypeLabels: Record<string, string> = {
  COURSE_VIDEO: 'Video Course',
  COURSE_INTERACTIVE: 'Interactive Course',
  BOOK: 'Book',
  PRACTICE_EXAM: 'Practice Exam',
  LAB_ENVIRONMENT: 'Lab Environment',
  CHEAT_SHEET: 'Cheat Sheet',
  STUDY_GUIDE: 'Study Guide',
  BOOTCAMP: 'Bootcamp',
  MENTORSHIP: 'Mentorship',
  COMMUNITY: 'Community',
};

export function CertificationResourcesList({
  resources,
}: CertificationResourcesListProps) {
  if (resources.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No resources available yet. Check back soon!
      </p>
    );
  }

  const sortedResources = [...resources].sort((a, b) => {
    // Ordenar por: free primeiro, depois por rating
    if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div className="grid gap-4">
      {sortedResources.map((resource) => (
        <Card key={resource.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <Badge variant="outline">
                    {resourceTypeLabels[resource.type] || resource.type}
                  </Badge>
                  {resource.isFree && (
                    <Badge className="bg-green-100 text-green-800">FREE</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Provider:{' '}
                  <span className="font-medium">{resource.provider}</span>
                </p>

                {resource.description && (
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {resource.rating && resource.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {resource.rating.toFixed(1)}
                      </span>
                      {resource.reviewsCount && (
                        <span className="text-muted-foreground">
                          ({resource.reviewsCount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}

                  {resource.durationHours && (
                    <span className="text-muted-foreground">
                      {resource.durationHours}h
                    </span>
                  )}

                  {!resource.isFree && (
                    <span className="font-semibold text-primary">
                      {formatCurrency(resource.cost, resource.currency)}
                    </span>
                  )}
                </div>
              </div>

              <Button asChild size="sm" className="w-full sm:w-auto">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
