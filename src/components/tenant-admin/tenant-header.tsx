'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { Bell, CalendarDays, ChevronDown, Search } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TenantHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  roleLabel?: string;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';

  return 'Good Evening';
}

function getCurrentDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function Initials({ name }: { name: string }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  }, [name]);

  return <span className="text-sm font-semibold text-white">{initials}</span>;
}

export function TenantHeader({
  firstName,
  avatarUrl,
  notificationCount = 0,
  roleLabel,
}: TenantHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-24 items-center justify-between px-8">
        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {getGreeting()},<span className="text-blue-600"> {firstName}</span> 👋
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span>{getCurrentDate()}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <div className="relative hidden lg:block">
            <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search clients, projects, tickets..."
              className="h-12 w-[360px] rounded-2xl border border-slate-200 bg-slate-50 pr-16 pl-14 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <div className="absolute top-1/2 right-4 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
              ⌘ K
            </div>
          </div>

          {/* NOTIFICATION */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-50 focus:outline-none">
                <Bell className="h-5 w-5 text-slate-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-2 w-80 rounded-xl border-slate-100 p-0 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="font-semibold text-slate-800">Notifications</span>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Mark all as read
                </button>
              </div>
              <div className="flex max-h-[300px] flex-col overflow-y-auto">
                <div className="cursor-pointer border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-800">New ticket created</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    TKT-0012: Login page is throwing 500 error
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">2 mins ago</p>
                </div>
                <div className="relative cursor-pointer border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50">
                  <span className="absolute top-4 left-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <p className="pl-2 text-sm font-medium text-slate-800">SLA Warning</p>
                  <p className="mt-0.5 line-clamp-1 pl-2 text-xs text-slate-500">
                    TKT-0008 is approaching resolution breach
                  </p>
                  <p className="mt-1 pl-2 text-[10px] text-slate-400">1 hour ago</p>
                </div>
                <div className="cursor-pointer px-4 py-3 transition hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-800">Engineer assigned</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    Sarah Wood was assigned to TKT-0005
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">3 hours ago</p>
                </div>
              </div>
              <div className="border-t border-slate-100 p-2 text-center">
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                  View all notifications
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* PROFILE */}
          <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-blue-600">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={firstName} fill sizes="44px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Initials name={firstName} />
                </div>
              )}
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-sm font-semibold text-slate-900">{firstName}</p>
              {roleLabel && <p className="mt-0.5 text-xs text-slate-500">{roleLabel}</p>}
            </div>

            <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
