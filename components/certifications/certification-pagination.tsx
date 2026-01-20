'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CertificationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CertificationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CertificationPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 pages at a time
  let visiblePages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      visiblePages = pages.slice(0, 5);
    } else if (currentPage >= totalPages - 2) {
      visiblePages = pages.slice(totalPages - 5, totalPages);
    } else {
      visiblePages = pages.slice(currentPage - 3, currentPage + 2);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button variant="outline" size="icon" onClick={() => onPageChange(1)}>
            1
          </Button>
          {visiblePages[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
