'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth-mock';
import { useUserProgress } from '@/lib/hooks/use-user-progress';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProgressCard } from '@/components/profile/progress-card';
import { StudyPlan } from '@/components/profile/study-plan';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Award,
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(getCurrentUser());
  const { data, loading, error } = useUserProgress();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-6">My Profile</h1>
        <ProfileHeader user={user} />
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Certifications
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalCertifications}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completed} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageProgress.toFixed(0)}% avg progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudyHours}h</div>
              <p className="text-xs text-muted-foreground">Total logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Exams
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingExams}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              My Certifications
            </h2>

            {data && data.data.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No certifications tracked yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Browse certifications and start tracking your progress
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data?.data.map((progress) => (
                  <ProgressCard key={progress.id} progress={progress} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StudyPlan user={user} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Next</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Complete Security+ (45% done, ~40h remaining)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    Schedule Security+ exam (2-3 weeks after completion)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Start CEH preparation (3-4 month timeline)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/certifications"
                className="block text-sm text-primary hover:underline"
              >
                → Browse certifications
              </Link>
              <Link href="/roadmap" className="block text-sm text-primary hover:underline">
                → View career roadmap
              </Link>
              <Link href="/resources" className="block text-sm text-primary hover:underline">
                → Find study resources
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
