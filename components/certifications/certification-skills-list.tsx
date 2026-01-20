import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { CertificationDetail } from '@/lib/types';

interface CertificationSkillsListProps {
  skills: CertificationDetail['skills'];
}

const importanceColors = {
  CORE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  ADVANCED:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  INTERMEDIATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  BASIC: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function CertificationSkillsList({
  skills,
}: CertificationSkillsListProps) {
  if (skills.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No skills information available yet.
      </p>
    );
  }

  const sortedSkills = [...skills].sort((a, b) => {
    const order = { CORE: 0, ADVANCED: 1, INTERMEDIATE: 2, BASIC: 3 };
    return (
      order[a.importance as keyof typeof order] -
      order[b.importance as keyof typeof order]
    );
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sortedSkills.map((item) => (
        <Card key={item.skill.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold">{item.skill.name}</h4>
              <Badge
                className={
                  importanceColors[
                    item.importance as keyof typeof importanceColors
                  ]
                }
              >
                {item.importance.toLowerCase()}
              </Badge>
            </div>
            {item.skill.description && (
              <p className="text-sm text-muted-foreground">
                {item.skill.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
