'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { REGIONS } from '@/lib/constants';

interface SalaryImpactChartProps {
  data: Array<{
    region: string;
    avgImpact: number;
  }>;
}

const REGION_ABBREVIATIONS: Record<string, string> = {
  'North America': 'N. America',
  'South America': 'S. America',
  Europe: 'Europe',
  Asia: 'Asia',
  Oceania: 'Oceania',
  Africa: 'Africa',
  'Middle East': 'Mid. East',
};

export function SalaryImpactChart({ data }: SalaryImpactChartProps) {
  const chartData = data.map((item) => ({
    region:
      REGION_ABBREVIATIONS[REGIONS[item.region as keyof typeof REGIONS]] ||
      REGIONS[item.region as keyof typeof REGIONS] ||
      item.region,
    impact: Math.round(item.avgImpact),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Salary Impact</CardTitle>
        <CardDescription>
          Percentage increase in salary by region
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="region" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 40]} tick={{ fontSize: 10 }} />
              <Radar
                name="Salary Impact %"
                dataKey="impact"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => `${value}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
