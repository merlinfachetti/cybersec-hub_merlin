'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { REGIONS } from '@/lib/constants';

interface MarketFiltersProps {
  certifications: Array<{ id: string; name: string }>;
  selectedCertification?: string;
  selectedRegion?: string;
  onCertificationChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onReset: () => void;
}

export function MarketFilters({
  certifications,
  selectedCertification,
  selectedRegion,
  onCertificationChange,
  onRegionChange,
  onReset,
}: MarketFiltersProps) {
  const hasFilters = selectedCertification || selectedRegion;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certification">Certification</Label>
          <Select
            value={selectedCertification || 'all'}
            onValueChange={onCertificationChange}
          >
            <SelectTrigger id="certification">
              <SelectValue placeholder="All certifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All certifications</SelectItem>
              {certifications.map((cert) => (
                <SelectItem key={cert.id} value={cert.id}>
                  {cert.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            value={selectedRegion || 'all'}
            onValueChange={onRegionChange}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {Object.entries(REGIONS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
