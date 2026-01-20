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

export function MarketDemandChart({ data }: MarketDemandChartProps) {
  const chartData = data.map((item) => ({
    region: REGIONS[item.region as keyof typeof REGIONS] || item.region,
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
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
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
      </CardContent>
    </Card>
  );
}
