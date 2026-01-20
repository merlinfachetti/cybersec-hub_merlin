import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatLevel, getLevelColor } from '@/lib/format';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface ProgressCardProps {
  progress: {
    id: string;
    status: string;
    progressPercent: number;
    studyHours: number;
    startedAt: string | null;
    notes: string | null;
    certification: {
      id: string;
      name: string;
      slug: string;
      level: string;
      provider: {
        name: string;
      };
    };
  };
}

const statusColors = {
  INTERESTED: 'bg-gray-100 text-gray-800',
  STUDYING: 'bg-blue-100 text-blue-800',
  SCHEDULED: 'bg-yellow-100 text-yellow-800',
  PASSED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  INTERESTED: 'Interested',
  STUDYING: 'In Progress',
  SCHEDULED: 'Exam Scheduled',
  PASSED: 'Passed',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {progress.certification.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {progress.certification.provider.name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getLevelColor(progress.certification.level)}>
              {formatLevel(progress.certification.level)}
            </Badge>
            <Badge
              className={
                statusColors[progress.status as keyof typeof statusColors]
              }
            >
              {statusLabels[progress.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {progress.status === 'STUDYING' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.progressPercent}%</span>
            </div>
            <Progress value={progress.progressPercent} />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {progress.startedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Started{' '}
                {new Date(progress.startedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {progress.studyHours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{progress.studyHours}h studied</span>
            </div>
          )}
        </div>

        {progress.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            <strong>Notes:</strong> {progress.notes}
          </p>
        )}

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/certifications/${progress.certification.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
