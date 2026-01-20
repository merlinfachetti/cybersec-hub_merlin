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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface ResourceFiltersProps {
  certifications: Array<{ id: string; name: string }>;
  selectedCertification?: string;
  selectedType?: string;
  isFreeOnly: boolean;
  minRating: number;
  search: string;
  orderBy: string;
  onCertificationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onFreeOnlyChange: (checked: boolean) => void;
  onMinRatingChange: (value: number) => void;
  onSearchChange: (value: string) => void;
  onOrderByChange: (value: string) => void;
  onReset: () => void;
}

const RESOURCE_TYPES = [
  { value: 'COURSE_VIDEO', label: 'Video Course' },
  { value: 'COURSE_INTERACTIVE', label: 'Interactive Course' },
  { value: 'BOOK', label: 'Book' },
  { value: 'PRACTICE_EXAM', label: 'Practice Exam' },
  { value: 'LAB_ENVIRONMENT', label: 'Lab Environment' },
  { value: 'CHEAT_SHEET', label: 'Cheat Sheet' },
  { value: 'STUDY_GUIDE', label: 'Study Guide' },
  { value: 'BOOTCAMP', label: 'Bootcamp' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Best Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'cost', label: 'Price: Low to High' },
  { value: 'recent', label: 'Recently Updated' },
];

export function ResourceFilters({
  certifications,
  selectedCertification,
  selectedType,
  isFreeOnly,
  minRating,
  search,
  orderBy,
  onCertificationChange,
  onTypeChange,
  onFreeOnlyChange,
  onMinRatingChange,
  onSearchChange,
  onOrderByChange,
  onReset,
}: ResourceFiltersProps) {
  const hasFilters =
    selectedCertification ||
    selectedType ||
    isFreeOnly ||
    minRating > 0 ||
    search;

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
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Certification */}
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

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Resource Type</Label>
          <Select value={selectedType || 'all'} onValueChange={onTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {RESOURCE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={orderBy} onValueChange={onOrderByChange}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Free Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="free"
            checked={isFreeOnly}
            onCheckedChange={(checked) => onFreeOnlyChange(checked as boolean)}
          />
          <Label htmlFor="free" className="text-sm font-normal cursor-pointer">
            Free resources only
          </Label>
        </div>

        {/* Min Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select
            value={minRating.toString()}
            onValueChange={(v) => onMinRatingChange(parseFloat(v))}
          >
            <SelectTrigger id="rating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
