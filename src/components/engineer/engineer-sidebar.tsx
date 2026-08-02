'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Building2, ChevronRight, Headphones, LayoutDashboard, Ticket } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/engineer', icon: LayoutDashboard },
  { label: 'All Tickets', href: '/engineer/tickets', icon: Ticket },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EngineerSidebarProps {
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

function EngineerInfoFooter() {
  const { user } = useAuth();
  const tenantName = user?.tenant?.name ?? 'Workspace';

  return (
    <div className="border-t border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="h-5 w-5 text-slate-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium text-slate-900">{tenantName}</p>
          <p className="truncate text-xs text-slate-500">Engineer</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EngineerSidebar({ notificationCount = 0 }: EngineerSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="px-7 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50">
            <div className="h-6 w-6 rounded-full border-2 border-blue-600 bg-blue-600" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-900">
              {user?.tenant?.name ? user.tenant.name.split(' ')[0] : 'Elipsonics'}
            </h2>
            <p className="text-sm text-slate-500">Engineer Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2">
          {NAV_ITEMS.map(({ label, href, icon }) => (
            <NavItem
              key={label}
              label={label}
              href={href}
              icon={icon}
              active={
                pathname === href || (href !== '/engineer' && pathname.startsWith(`${href}/`))
              }
              // @ts-expect-error
              badge={label === 'Notifications' ? notificationCount : undefined}
            />
          ))}
        </div>
      </nav>

      {/* Help Card */}
      <div className="px-5 pt-4 pb-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">Need Help?</h4>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Platform support is available 24/7.
          </p>
          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <Headphones className="h-4 w-4" />
            Contact Platform
          </button>
        </div>
      </div>

      {/* Company footer */}
      <EngineerInfoFooter />
    </aside>
  );
}
