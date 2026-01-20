'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Target } from 'lucide-react';

interface RoadmapOption {
  id: string;
  title: string;
  description: string;
  fromRole: string;
  toRole: string;
  duration: string;
  difficulty: string;
}

interface RoadmapSelectorProps {
  roadmaps: RoadmapOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  advanced:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export function RoadmapSelector({
  roadmaps,
  selectedId,
  onSelect,
}: RoadmapSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <Card
          key={roadmap.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedId === roadmap.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(roadmap.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge
                className={
                  difficultyColors[
                    roadmap.difficulty as keyof typeof difficultyColors
                  ]
                }
              >
                {roadmap.difficulty}
              </Badge>
              {selectedId === roadmap.id && (
                <Badge variant="default">Selected</Badge>
              )}
            </div>
            <CardTitle className="text-lg">{roadmap.title}</CardTitle>
            <CardDescription>{roadmap.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{roadmap.fromRole}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">{roadmap.toRole}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{roadmap.duration}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
