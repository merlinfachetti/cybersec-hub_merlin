import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import Link from 'next/link';
import type { ResourceItem } from '@/lib/hooks/use-resources';

interface ResourceCardProps {
  resource: ResourceItem;
}

const resourceTypeLabels: Record<string, string> = {
  COURSE_VIDEO: 'Video Course',
  COURSE_INTERACTIVE: 'Interactive Course',
  BOOK: 'Book',
  PRACTICE_EXAM: 'Practice Exam',
  LAB_ENVIRONMENT: 'Lab',
  CHEAT_SHEET: 'Cheat Sheet',
  STUDY_GUIDE: 'Study Guide',
  BOOTCAMP: 'Bootcamp',
  MENTORSHIP: 'Mentorship',
  COMMUNITY: 'Community',
};

const typeColors: Record<string, string> = {
  COURSE_VIDEO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  COURSE_INTERACTIVE:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  BOOK: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  PRACTICE_EXAM:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  LAB_ENVIRONMENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    typeColors[resource.type] || 'bg-gray-100 text-gray-800'
                  }
                >
                  {resourceTypeLabels[resource.type] || resource.type}
                </Badge>
                {resource.isFree && (
                  <Badge className="bg-green-100 text-green-800">FREE</Badge>
                )}
                <Badge variant="outline">
                  {resource.language.toUpperCase()}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg leading-tight">
                {resource.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                by <span className="font-medium">{resource.provider}</span>
              </p>
            </div>

            {!resource.isFree && (
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(resource.cost, resource.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Certification */}
          <Link
            href={`/certifications/${resource.certification.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            For:{' '}
            <span className="font-medium">{resource.certification.name}</span>
          </Link>

          {/* Description */}
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Metrics */}
          <div className="flex items-center gap-4 text-sm">
            {resource.rating && resource.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {resource.rating.toFixed(1)}
                </span>
                {resource.reviewsCount && resource.reviewsCount > 0 && (
                  <span className="text-muted-foreground">
                    ({resource.reviewsCount.toLocaleString()})
                  </span>
                )}
              </div>
            )}

            {resource.durationHours && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{resource.durationHours}h</span>
              </div>
            )}
          </div>

          {/* Action */}
          <Button asChild className="w-full">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Resource
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
