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
      <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder={placeholder}
        className="h-10 w-full rounded-full border-slate-200/60 bg-white/60 px-10 text-sm text-slate-900 shadow-sm backdrop-blur transition-all hover:bg-white/80 focus-visible:border-indigo-500/50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-500/10"
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
          className="absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => {
            setValue('');
            handleSearch('');
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
