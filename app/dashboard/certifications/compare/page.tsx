'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatLevel, getLevelColor } from '@/lib/format';
import { X, Plus, Info } from 'lucide-react';
import Link from 'next/link';
import type { CertificationDetail } from '@/lib/types';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<CertificationDetail[]>(
    []
  );
  const [allCerts, setAllCerts] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Carregar IDs da URL
  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    setSelectedIds(ids);
  }, [searchParams]);

  // Carregar lista de certificações
  useEffect(() => {
    const fetchAllCerts = async () => {
      try {
        const result = await fetchApi<{
          data: Array<{ id: string; name: string }>;
        }>('/api/certifications?limit=100');
        setAllCerts(result.data);
      } catch (err) {
        console.error('Failed to fetch certifications:', err);
      }
    };
    fetchAllCerts();
  }, []);

  // Carregar detalhes das certificações selecionadas
  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedIds.length === 0) {
        setCertifications([]);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          selectedIds.map((id) =>
            fetchApi<CertificationDetail>(`/api/certifications/${id}`)
          )
        );
        setCertifications(results);
      } catch (err) {
        console.error('Failed to fetch certification details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedIds]);

  const handleAddCertification = (id: string) => {
    if (selectedIds.length >= 3) {
      alert('Maximum 3 certifications can be compared');
      return;
    }
    if (!selectedIds.includes(id)) {
      const newIds = [...selectedIds, id];
      setSelectedIds(newIds);
      window.history.pushState(
        {},
        '',
        `/certifications/compare?ids=${newIds.join(',')}`
      );
    }
  };

  const handleRemoveCertification = (id: string) => {
    const newIds = selectedIds.filter((i) => i !== id);
    setSelectedIds(newIds);
    window.history.pushState(
      {},
      '',
      newIds.length > 0
        ? `/certifications/compare?ids=${newIds.join(',')}`
        : '/certifications/compare'
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Compare Certifications
        </h1>
        <p className="text-muted-foreground">
          Compare up to 3 certifications side by side
        </p>
      </div>

      {/* Selector */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {selectedIds.map((id) => {
                const cert = certifications.find((c) => c.id === id);
                return (
                  <Badge key={id} variant="secondary" className="px-3 py-2">
                    {cert?.name || 'Loading...'}
                    <button
                      onClick={() => handleRemoveCertification(id)}
                      className="ml-2 hover:text-destructive"
                      title="Remove certification"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}

              {selectedIds.length < 3 && (
                <Select onValueChange={handleAddCertification}>
                  <SelectTrigger className="w-62.5">
                    <SelectValue placeholder="Add certification..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allCerts
                      .filter((c) => !selectedIds.includes(c.id))
                      .map((cert) => (
                        <SelectItem key={cert.id} value={cert.id}>
                          {cert.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      {certifications.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select at least one certification to start comparing. You can
            compare up to 3 at once.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Attribute</TableHead>
                    {certifications.map((cert) => (
                      <TableHead key={cert.id} className="min-w-62.5">
                        <div className="space-y-2">
                          <Link
                            href={`/certifications/${cert.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {cert.name}
                          </Link>
                          <div>
                            <Badge className={getLevelColor(cert.level)}>
                              {formatLevel(cert.level)}
                            </Badge>
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Provider */}
                  <TableRow>
                    <TableCell className="font-medium">Provider</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>{cert.provider.name}</TableCell>
                    ))}
                  </TableRow>

                  {/* Exam Cost */}
                  <TableRow>
                    <TableCell className="font-medium">
                      Exam Cost (USD)
                    </TableCell>
                    {certifications.map((cert) => {
                      const cost = cert.costs.find((c) => c.currency === 'USD');
                      return (
                        <TableCell
                          key={cert.id}
                          className="font-semibold text-primary"
                        >
                          {cost ? formatCurrency(cost.examCost, 'USD') : 'N/A'}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Exam Duration */}
                  <TableRow>
                    <TableCell className="font-medium">Exam Duration</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.examDuration
                          ? `${cert.examDuration} minutes`
                          : 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Questions */}
                  <TableRow>
                    <TableCell className="font-medium">Questions</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.numberOfQuestions || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Validity */}
                  <TableRow>
                    <TableCell className="font-medium">Validity</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.validityYears
                          ? `${cert.validityYears} years`
                          : 'Lifetime'}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Prerequisites */}
                  <TableRow>
                    <TableCell className="font-medium">Prerequisites</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.prerequisites.length > 0
                          ? cert.prerequisites.map((p) => p.name).join(', ')
                          : 'None'}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Skills Count */}
                  <TableRow>
                    <TableCell className="font-medium">
                      Skills Covered
                    </TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.skills.length} skills
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Resources Count */}
                  <TableRow>
                    <TableCell className="font-medium">
                      Study Resources
                    </TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        {cert.resources.length} resources
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Actions */}
                  <TableRow>
                    <TableCell className="font-medium">Action</TableCell>
                    {certifications.map((cert) => (
                      <TableCell key={cert.id}>
                        <Button asChild size="sm">
                          <Link href={`/certifications/${cert.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROI Calculator Section */}
      {certifications.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>ROI Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {certifications.map((cert) => {
                  const cost = cert.costs.find((c) => c.currency === 'USD');
                  const examCost = cost?.examCost || 0;
                  const avgSalaryImpact =
                    cert.marketRecognition[0]?.averageSalaryImpact || 15;
                  const assumedSalary = 80000; // Base salary assumption
                  const salaryIncrease =
                    assumedSalary * (avgSalaryImpact / 100);
                  const roi = ((salaryIncrease - examCost) / examCost) * 100;

                  return (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{cert.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Investment
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            -{formatCurrency(examCost, 'USD')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Salary Impact ({avgSalaryImpact}%)
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            +{formatCurrency(salaryIncrease, 'USD')}/year
                          </p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">
                            ROI (First Year)
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {roi.toFixed(0)}%
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          *Based on $80k base salary assumption
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
