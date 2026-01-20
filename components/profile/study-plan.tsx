import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StudyPlanProps {
  user: {
    studyHoursPerWeek?: number;
  };
}

export function StudyPlan({ user }: StudyPlanProps) {
  const weeklyHours = user.studyHoursPerWeek || 10;

  const plan = [
    {
      week: 'Week 1-4',
      focus: 'Network Security Fundamentals',
      hours: weeklyHours * 4,
      status: 'completed',
      topics: ['TCP/IP', 'Subnetting', 'Firewalls', 'VPNs'],
    },
    {
      week: 'Week 5-8',
      focus: 'Cryptography & Identity Management',
      hours: weeklyHours * 4,
      status: 'in-progress',
      topics: ['Encryption', 'Hashing', 'PKI', 'IAM'],
    },
    {
      week: 'Week 9-12',
      focus: 'Security Operations & Incident Response',
      hours: weeklyHours * 4,
      status: 'upcoming',
      topics: ['SIEM', 'Forensics', 'IR Process', 'BCP/DR'],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Plan (Security+)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plan.map((phase, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                phase.status === 'in-progress'
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                {phase.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : phase.status === 'in-progress' ? (
                  <Circle className="h-5 w-5 text-primary mt-0.5 fill-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{phase.week}</p>
                      <p className="text-sm text-muted-foreground">
                        {phase.focus}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{phase.hours}h</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
