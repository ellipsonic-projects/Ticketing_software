'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Bell,
  Building2,
  ChevronRight,
  FolderOpen,
  Headphones,
  LayoutDashboard,
  PlusCircle,
  Ticket,
  User,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useClient } from '@/hooks/use-clients';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'My Projects', href: '/client/projects', icon: FolderOpen },
  { label: 'My Tickets', href: '/client/tickets', icon: Ticket },
  { label: 'Create Ticket', href: '/client/tickets/new', icon: PlusCircle },
  { label: 'Notifications', href: '/client/notifications', icon: Bell },
  { label: 'Profile', href: '/client/profile', icon: User },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DashboardSidebarProps {
  notificationCount?: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NavItem({
  label,
  href,
  icon: Icon,
  active,
  badge,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-12 items-center rounded-xl px-4 text-[15px] font-medium transition-all duration-200',
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <Icon className={cn('mr-4 h-5 w-5', active ? 'text-blue-600' : 'text-slate-500')} />
      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
          {badge}
        </div>
      )}
    </Link>
  );
}

function ClientInfoFooter() {
  const { user } = useAuth();
  const { data: clientResponse, isLoading } = useClient(user?.clientId ?? '');
  const clientInfo = clientResponse?.client;

  if (isLoading && !clientInfo) {
    return (
      <div className="border-t border-slate-200 p-5">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!clientInfo) return null;

  return (
    <div className="border-t border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="h-5 w-5 text-slate-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium text-slate-900">{clientInfo.name}</p>
          <p className="truncate text-xs text-slate-500">
            Member since{' '}
            {new Date(clientInfo.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardSidebar({ notificationCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="px-7 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600">
            <div className="h-6 w-6 rounded-full border-2 border-blue-600" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-900">Elipsonics</h2>
            <p className="text-sm text-slate-500">Client Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {NAV_ITEMS.map(({ label, href, icon }) => (
            <NavItem
              key={href}
              label={label}
              href={href}
              icon={icon}
              active={pathname === href}
              badge={label === 'Notifications' ? notificationCount : undefined}
            />
          ))}
        </div>
      </nav>

      {/* Help Card */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">Need Help?</h4>
          <p className="mt-2 text-sm leading-6 text-slate-500">Can&apos;t find what you need?</p>
          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <Headphones className="h-4 w-4" />
            Contact Support
          </button>
        </div>
      </div>

      {/* Company footer */}
      <ClientInfoFooter />
    </aside>
  );
}
