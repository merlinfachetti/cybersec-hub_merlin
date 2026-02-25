import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Building2, DollarSign } from 'lucide-react';
import { REGIONS, DEMAND_LEVELS } from '@/lib/constants';
import type { CertificationDetail } from '@/lib/types';

interface CertificationMarketChartProps {
  marketRecognition: CertificationDetail['marketRecognition'];
}

const demandColors = {
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  MEDIUM:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function CertificationMarketChart({
  marketRecognition,
}: CertificationMarketChartProps) {
  if (marketRecognition.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No market data available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {marketRecognition.map((market) => (
        <Card key={market.id}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">
                {REGIONS[market.region as keyof typeof REGIONS]}
                {market.country && ` - ${market.country}`}
              </CardTitle>
              <Badge
                className={
                  demandColors[market.demandLevel as keyof typeof demandColors]
                }
              >
                {
                  DEMAND_LEVELS[
                    market.demandLevel as keyof typeof DEMAND_LEVELS
                  ]
                }
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {market.jobPostingsCount && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {market.jobPostingsCount.toLocaleString()}
                </span>
                <span className="text-muted-foreground">job postings</span>
              </div>
            )}

            {market.averageSalaryImpact && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  +{market.averageSalaryImpact}%
                </span>
                <span className="text-muted-foreground">salary impact</span>
              </div>
            )}

            {(market.juniorSalaryRange ||
              market.midSalaryRange ||
              market.seniorSalaryRange) && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Salary Ranges:</p>
                <div className="space-y-1 text-sm">
                  {market.juniorSalaryRange && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Junior:</span>
                      <span className="font-medium">
                        {market.juniorSalaryRange}
                      </span>
                    </div>
                  )}
                  {market.midSalaryRange && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mid:</span>
                      <span className="font-medium">
                        {market.midSalaryRange}
                      </span>
                    </div>
                  )}
                  {market.seniorSalaryRange && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Senior:</span>
                      <span className="font-medium">
                        {market.seniorSalaryRange}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {market.topCompanies.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Top Companies:
                </div>
                <div className="flex flex-wrap gap-2">
                  {market.topCompanies.map((company) => (
                    <Badge key={company} variant="secondary">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {market.governmentRequired && (
              <Badge variant="outline" className="w-full justify-center">
                Government Required
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
