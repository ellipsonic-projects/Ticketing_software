'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ArrowDownUp } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SortOption {
  label: string;
  value: string; // Format: "field:order", e.g., "name:asc"
}

interface SortDropdownProps {
  options: SortOption[];
  defaultSort?: string;
  defaultOrder?: string;
}

export function SortDropdown({
  options,
  defaultSort = 'createdAt',
  defaultOrder = 'desc',
}: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || defaultSort;
  const currentOrder = searchParams.get('order') || defaultOrder;
  const currentValue = `${currentSort}:${currentOrder}`;

  const onValueChange = (val: string | null) => {
    if (!val) return;
    const [sort, order] = val.split(':');
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', sort);
    params.set('order', order);

    // Changing sort should arguably keep you on the same page, but resetting to page 1 is often safer for data tables.
    params.set('page', '1');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={currentValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4 text-gray-500" />
          <SelectValue placeholder="Sort by..." />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
