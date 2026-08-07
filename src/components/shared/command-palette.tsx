'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  ClipboardList,
  Command,
  CornerDownLeft,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  Search,
  Ticket,
  UserRound,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(() => {
    if (pathname.startsWith('/platform')) {
      return [
        {
          label: 'Go to dashboard',
          description: 'Platform overview',
          href: '/platform/dashboard',
          icon: LayoutDashboard,
          keywords: ['home', 'overview'],
        },
      ];
    }
    if (pathname.startsWith('/client')) {
      return [
        {
          label: 'Go to dashboard',
          description: 'Your support overview',
          href: '/client/dashboard',
          icon: LayoutDashboard,
          keywords: ['home', 'overview'],
        },
        {
          label: 'Create a support request',
          description: 'Submit a new ticket',
          href: '/client/tickets/new',
          icon: FilePlus2,
          keywords: ['new', 'create', 'ticket', 'request', 'support'],
        },
        {
          label: 'View my projects',
          description: 'Browse your active projects',
          href: '/client/projects',
          icon: FolderKanban,
          keywords: ['projects', 'project'],
        },
        {
          label: 'Open activity history',
          description: 'Review ticket audit logs',
          href: '/client/audit-logs',
          icon: ClipboardList,
          keywords: ['audit', 'logs', 'activity', 'history'],
        },
        {
          label: 'View profile',
          description: 'Manage your account details',
          href: '/client/profile',
          icon: UserRound,
          keywords: ['account', 'settings'],
        },
      ];
    }
    if (pathname.startsWith('/engineer')) {
      return [
        {
          label: 'Go to dashboard',
          description: 'Your work overview',
          href: '/engineer',
          icon: LayoutDashboard,
          keywords: ['home', 'overview'],
        },
        {
          label: 'View assigned tickets',
          description: 'Browse your support queue',
          href: '/engineer/tickets',
          icon: Ticket,
          keywords: ['tickets', 'queue', 'work'],
        },
      ];
    }
    return [
      {
        label: 'Go to dashboard',
        description: 'Your workspace overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        keywords: ['home', 'overview'],
      },
      {
        label: 'View tickets',
        description: 'Browse all support requests',
        href: '/tickets',
        icon: Ticket,
        keywords: ['requests', 'support'],
      },
      {
        label: 'Create a ticket',
        description: 'Start a new support request',
        href: '/tickets/new',
        icon: FilePlus2,
        keywords: ['new', 'request', 'support'],
      },
    ];
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
        setQuery('');
        setActiveIndex(0);
      }
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
        setActiveIndex(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        !normalized ||
        `${item.label} ${item.description} ${item.keywords.join(' ')}`
          .toLowerCase()
          .includes(normalized),
    );
  }, [items, query]);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    router.push(href);
  };

  const closePalette = () => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const openPalette = () => {
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      navigate(results[activeIndex].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="hidden h-10 w-[min(26vw,320px)] items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 text-left text-sm text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-700 md:flex"
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1">Search anything…</span>
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘ K
        </kbd>
      </button>
      <button
        type="button"
        onClick={openPalette}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
        aria-label="Search workspace"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[max(6rem,16vh)] backdrop-blur-[1px]"
          onMouseDown={closePalette}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_70px_-18px_rgb(15_23_42_/_0.45)]"
          >
            <div className="border-b border-slate-100 p-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-inner shadow-slate-200/40">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search pages and actions..."
                  className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="command-palette-results"
                  aria-activedescendant={
                    results[activeIndex] ? `command-${activeIndex}` : undefined
                  }
                />
                <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                  ESC
                </kbd>
              </div>
            </div>
            <div id="command-palette-results" role="listbox" className="p-2.5">
              <p className="px-2.5 pt-1 pb-2 text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                Navigate
              </p>
              {results.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setActiveIndex(index)}
                    id={`command-${index}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                      activeIndex === index ? 'bg-indigo-50/70' : 'hover:bg-slate-50',
                      pathname === item.href && 'bg-slate-50',
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </span>
                    <CornerDownLeft className="h-4 w-4 text-slate-300 transition group-hover:text-indigo-400" />
                  </button>
                );
              })}
              {!results.length && (
                <p className="px-3 py-8 text-center text-sm text-slate-500">
                  No matching commands.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
              <Command className="h-3.5 w-3.5" />
              <span>Navigate with</span>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px]">
                ↓
              </kbd>
              <span>and open with</span>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px]">
                ↵
              </kbd>
              <span className="ml-auto">Press</span>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px]">
                Esc
              </kbd>{' '}
              to close
            </div>
          </section>
        </div>
      )}
    </>
  );
}
