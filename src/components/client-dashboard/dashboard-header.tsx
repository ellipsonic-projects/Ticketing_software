'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import {
  Bell,
  Search,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';

interface DashboardHeaderProps {
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

function Initials({
  name,
}: {
  name: string;
}) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  }, [name]);

  return (
    <span className="text-sm font-semibold text-white">
      {initials}
    </span>
  );
}

export function DashboardHeader({
  firstName,
  avatarUrl,
  notificationCount = 0,
  roleLabel,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">

      <div className="mx-auto flex h-24 items-center justify-between px-8">

        {/* LEFT */}

        <div className="flex flex-col">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">

            {getGreeting()},
            <span className="text-blue-600">
              {' '}
              {firstName}
            </span>
            {' '}
            👋

          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

            <CalendarDays className="h-4 w-4" />

            <span>
              {getCurrentDate()}
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-5">

          {/* SEARCH */}

          <div className="relative hidden lg:block">

            <Search
              className="
                absolute
                left-5
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              placeholder="Search tickets, projects..."
              className="
                h-12
                w-[360px]
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-14
                pr-16
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <div
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2
                py-1
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              ⌘ K
            </div>

          </div>

          {/* NOTIFICATION */}

          <button
            className="
              relative
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-200
              bg-white
              transition
              hover:bg-slate-50
            "
          >

            <Bell className="h-5 w-5 text-slate-600" />

            {notificationCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {notificationCount > 99
                  ? '99+'
                  : notificationCount}
              </span>
            )}

          </button>

          {/* PROFILE */}

          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              transition
              hover:bg-slate-50
            "
          >

            <div
              className="
                relative
                h-11
                w-11
                overflow-hidden
                rounded-full
                bg-blue-600
              "
            >

              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={firstName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                  "
                >
                  <Initials
                    name={firstName}
                  />
                </div>
              )}

            </div>

            <div className="hidden text-left xl:block">

              <p className="text-sm font-semibold text-slate-900">
                {firstName}
              </p>

              {roleLabel && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {roleLabel}
                </p>
              )}

            </div>

            <ChevronDown
              className="
                hidden
                h-4
                w-4
                text-slate-400
                xl:block
              "
            />

          </button>

        </div>

      </div>

    </header>
  );
}