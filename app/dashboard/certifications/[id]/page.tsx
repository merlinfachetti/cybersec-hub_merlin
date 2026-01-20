'use client';

import { use } from 'react';
import { useCertificationDetail } from '@/lib/hooks/use-certification-detail';
import { CertificationBreadcrumb } from '@/components/certifications/certification-breadcrumb';
import { CertificationCostsTable } from '@/components/certifications/certification-costs-table';
import { CertificationSkillsList } from '@/components/certifications/certification-skills-list';
import { CertificationResourcesList } from '@/components/certifications/certification-resources-list';
import { CertificationMarketChart } from '@/components/certifications/certification-market-chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  ExternalLink,
  Clock,
  FileText,
  Languages,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  formatLevel,
  getLevelColor,
  formatCategory,
  getCategoryIcon,
} from '@/lib/format';

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const {
    data: certification,
    loading,
    error,
  } = useCertificationDetail(resolvedParams.id);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-6 w-48 mb-8" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !certification) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Certification not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <CertificationBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Certifications', href: '/certifications' },
          { label: certification.name },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {getCategoryIcon(certification.category)}
            </span>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {certification.name}
              </h1>
              {certification.fullName &&
                certification.fullName !== certification.name && (
                  <p className="text-lg text-muted-foreground mt-1">
                    {certification.fullName}
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className={getLevelColor(certification.level)}>
            {formatLevel(certification.level)}
          </Badge>
          <Badge variant="outline">
            {formatCategory(certification.category)}
          </Badge>
          <Link
            href={certification.provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {certification.provider.name}
          </Link>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {certification.description}
        </p>

        <div className="flex gap-3 mt-6">
          <Button asChild size="lg">
            <a
              href={certification.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          {certification.syllabusPdfUrl && (
            <Button asChild variant="outline" size="lg">
              <a
                href={certification.syllabusPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Syllabus
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {certification.examDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Duration:{' '}
                    <strong>{certification.examDuration} minutes</strong>
                  </span>
                </div>
              )}
              {certification.numberOfQuestions && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Questions:{' '}
                    <strong>{certification.numberOfQuestions}</strong>
                  </span>
                </div>
              )}
              {certification.passingScore && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Passing Score: <strong>{certification.passingScore}</strong>
                  </span>
                </div>
              )}
              {certification.examFormat && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Format: <strong>{certification.examFormat}</strong>
                  </span>
                </div>
              )}
              {certification.examLanguages.length > 0 && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Languages:{' '}
                    <strong>{certification.examLanguages.join(', ')}</strong>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Objectives */}
          {certification.objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {certification.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Target Audience */}
          {certification.targetAudience && (
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {certification.targetAudience}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Validity */}
          <Card>
            <CardHeader>
              <CardTitle>Validity & Renewal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {certification.validityYears
                    ? `Valid for ${certification.validityYears} years`
                    : 'Lifetime certification'}
                </span>
              </div>
              {certification.requiresRenewal &&
                certification.renewalRequirements && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Renewal:</strong>{' '}
                    {certification.renewalRequirements}
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {certification.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {certification.prerequisites.map((prereq) => (
                    <Link
                      key={prereq.id}
                      href={`/certifications/${prereq.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getLevelColor(prereq.level)}>
                          {formatLevel(prereq.level)}
                        </Badge>
                        <span className="font-medium">{prereq.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {certification.prerequisitesFor.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {certification.prerequisitesFor.map((next) => (
                    <Link
                      key={next.id}
                      href={`/certifications/${next.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getLevelColor(next.level)}>
                          {formatLevel(next.level)}
                        </Badge>
                        <span className="font-medium">{next.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Costs by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificationCostsTable costs={certification.costs} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificationSkillsList skills={certification.skills} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Study Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificationResourcesList resources={certification.resources} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificationMarketChart
                marketRecognition={certification.marketRecognition}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
