import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatLevel,
  getLevelColor,
  getCategoryIcon,
} from '@/lib/format';
import { ExternalLink, BookOpen } from 'lucide-react';
import type { CertificationListItem } from '@/lib/hooks/use-certifications';
import { GitCompare } from 'lucide-react';

interface CertificationCardProps {
  certification: CertificationListItem;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const primaryCost = certification.costs[0];
  const categoryIcon = getCategoryIcon(certification.category);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcon}</span>
            <Badge className={getLevelColor(certification.level)}>
              {formatLevel(certification.level)}
            </Badge>
          </div>
          {primaryCost && (
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">
                {formatCurrency(primaryCost.examCost, primaryCost.currency)}
              </p>
              <p className="text-xs text-muted-foreground">Exam</p>
            </div>
          )}
        </div>

        <CardTitle className="text-xl">{certification.name}</CardTitle>

        <CardDescription className="flex items-center gap-2 text-sm">
          <span className="font-medium">{certification.provider.name}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {certification.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{certification._count.resources} resources</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/certifications/${certification.id}`}>View Details</Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(certification.name + ' ' + certification.provider.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search "${certification.name}" on Google`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline" size="icon" title="Compare">
          <Link href={`/certifications/compare?ids=${certification.id}`}>
            <GitCompare className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
