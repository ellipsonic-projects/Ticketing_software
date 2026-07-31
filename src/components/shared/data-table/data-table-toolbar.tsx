'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface DataTableToolbarProps {
  children: ReactNode;
}

export function DataTableToolbar({ children }: DataTableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFiltered = searchParams.size > 0 && 
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {children}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-2 lg:px-3 text-sm font-medium"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
