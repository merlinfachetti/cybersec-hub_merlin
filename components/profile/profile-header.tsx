import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, MapPin, Target, DollarSign, Clock } from 'lucide-react';
import type { User as UserType } from '@/lib/auth-mock';

interface ProfileHeaderProps {
  user: UserType;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarFallback className="text-xl sm:text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Current Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>

              {user.targetRole && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Target Role</p>
                    <p className="font-medium">{user.targetRole}</p>
                  </div>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                </div>
              )}

              {user.studyHoursPerWeek && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Study Time</p>
                    <p className="font-medium">
                      {user.studyHoursPerWeek}h/week
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
