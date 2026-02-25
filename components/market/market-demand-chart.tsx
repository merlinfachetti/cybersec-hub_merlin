'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { REGIONS } from '@/lib/constants';

interface MarketDemandChartProps {
  data: Array<{
    region: string;
    totalJobs: number;
    certifications: number;
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

export function MarketDemandChart({ data }: MarketDemandChartProps) {
  const chartData = data.map((item) => ({
    region:
      REGION_ABBREVIATIONS[REGIONS[item.region as keyof typeof REGIONS]] ||
      REGIONS[item.region as keyof typeof REGIONS] ||
      item.region,
    jobs: item.totalJobs,
    certs: item.certifications,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Demand by Region</CardTitle>
        <CardDescription>
          Total job postings and tracked certifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={72}
                tick={{ fontSize: 11 }}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                yAxisId="left"
                dataKey="jobs"
                fill="hsl(var(--primary))"
                name="Job Postings"
              />
              <Bar
                yAxisId="right"
                dataKey="certs"
                fill="hsl(var(--chart-2))"
                name="Certifications"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
