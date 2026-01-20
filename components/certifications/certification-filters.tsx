'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  CERTIFICATION_LEVELS,
  CERTIFICATION_CATEGORIES,
} from '@/lib/constants';

interface CertificationFiltersProps {
  level?: string;
  category?: string;
  search?: string;
  onLevelChange: (level: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export function CertificationFilters({
  level,
  category,
  search,
  onLevelChange,
  onCategoryChange,
  onSearchChange,
  onReset,
}: CertificationFiltersProps) {
  const hasFilters = level || category || search;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name..."
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Level Filter */}
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={level || 'all'} onValueChange={onLevelChange}>
            <SelectTrigger id="level">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {Object.entries(CERTIFICATION_LEVELS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category || 'all'} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.entries(CERTIFICATION_CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
