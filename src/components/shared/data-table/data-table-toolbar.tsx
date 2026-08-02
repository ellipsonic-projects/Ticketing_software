'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DataTableToolbarProps {
  children: ReactNode;
}

export function DataTableToolbar({ children }: DataTableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFiltered =
    searchParams.size > 0 &&
    (searchParams.has('search') || searchParams.has('status') || searchParams.has('supportStatus'));

  const resetFilters = () => {
    // Preserve limit, delete all filters
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('status');
    params.delete('supportStatus');
    params.delete('sort');
    params.delete('order');
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {children}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-2 text-sm font-medium lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
