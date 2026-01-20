import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { REGIONS } from '@/lib/constants';

interface TopCompaniesTableProps {
  data: Array<{
    region: string;
    country: string | null;
    topCompanies: string[];
    certification: {
      name: string;
      level: string;
    };
  }>;
}

export function TopCompaniesTable({ data }: TopCompaniesTableProps) {
  // Consolidar empresas por região
  const companiesByRegion = data.reduce((acc: any, item) => {
    if (!acc[item.region]) {
      acc[item.region] = new Set();
    }
    item.topCompanies.forEach((company) => acc[item.region].add(company));
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Top Hiring Companies</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(companiesByRegion).map(
                ([region, companies]: [string, any]) => (
                  <TableRow key={region}>
                    <TableCell className="font-medium">
                      {REGIONS[region as keyof typeof REGIONS] || region}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(companies)
                          .slice(0, 5)
                          .map((company: any) => (
                            <Badge key={company} variant="secondary">
                              {company}
                            </Badge>
                          ))}
                        {companies.size > 5 && (
                          <Badge variant="outline">
                            +{companies.size - 5} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {companies.size}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
