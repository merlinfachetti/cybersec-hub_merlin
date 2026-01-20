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

export function SalaryImpactChart({ data }: SalaryImpactChartProps) {
  const chartData = data.map((item) => ({
    region: REGIONS[item.region as keyof typeof REGIONS] || item.region,
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
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="region" />
            <PolarRadiusAxis angle={90} domain={[0, 40]} />
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
      </CardContent>
    </Card>
  );
}
