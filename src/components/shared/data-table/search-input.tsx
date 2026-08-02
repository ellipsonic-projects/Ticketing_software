/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchInput({ placeholder = 'Search...' }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get('search') || '');

  // Keep internal state in sync with URL if user navigates back/forward
  useEffect(() => {
    setValue(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1 on search
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 400);

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-9 pl-9"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 h-9 w-9 text-gray-500 hover:bg-transparent hover:text-gray-900"
          onClick={() => {
            setValue('');
            handleSearch('');
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
