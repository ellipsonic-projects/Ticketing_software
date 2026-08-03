'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight, Headphones, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavItemType {
  label: string;
  href: string;
  icon: LucideIcon | any;
  badge?: number;
}

export interface BaseSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;

  // Theme
  themeColor?: 'blue' | 'violet';

  // Header / Logo area
  logoIcon?: React.ReactNode;
  logoTitle: string;
  logoSubtitle: string;

  // Navigation
  navItems: readonly NavItemType[];

  // Help Card
  showHelpCard?: boolean;

  // Footer
  footerIcon?: React.ReactNode;
  footerTitle?: string;
  footerSubtitle?: string;
  customFooter?: React.ReactNode;
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
  onClick,
  themeColor,
}: {
  label: string;
  href: string;
  icon: any;
  active: boolean;
  badge?: number;
  onClick?: () => void;
  themeColor: 'blue' | 'violet';
}) {
  const activeBg =
    themeColor === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600';
  const activeIconColor = themeColor === 'violet' ? 'text-violet-600' : 'text-blue-600';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex h-12 items-center rounded-xl px-4 text-[15px] font-medium transition-all duration-200',
        active ? activeBg : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <Icon className={cn('mr-4 h-5 w-5 shrink-0', active ? activeIconColor : 'text-slate-500')} />
      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
          {badge}
        </div>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BaseSidebar({
  isOpen = false,
  onClose,
  themeColor = 'blue',
  logoIcon,
  logoTitle,
  logoSubtitle,
  navItems,
  showHelpCard = false,
  footerIcon,
  footerTitle,
  footerSubtitle,
  customFooter,
}: BaseSidebarProps) {
  const pathname = usePathname();

  const borderColor = themeColor === 'violet' ? 'border-violet-200' : 'border-blue-200';
  const btnHover = themeColor === 'violet' ? 'hover:bg-violet-50' : 'hover:bg-blue-50';
  const textColor = themeColor === 'violet' ? 'text-violet-600' : 'text-blue-600';

  const sidebarContent = (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* 1. Header / Logo */}
      <div className="flex items-center justify-between px-7 pt-7 pb-6">
        <div className="flex items-center gap-3">
          {logoIcon}
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-900">{logoTitle}</h2>
            <p className="text-sm text-slate-500">{logoSubtitle}</p>
          </div>
        </div>

        {/* Close button — mobile only */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 2. Navigation */}
      <nav className="flex-1 overflow-y-auto px-4" aria-label="Sidebar navigation">
        <div className="space-y-1 sm:space-y-2">
          {navItems.map((item) => {
            // Find the most specific match (longest href) to prevent parent items
            // from highlighting when a child item has its own menu entry
            const bestMatch = navItems.reduce(
              (best, current) => {
                // If it's the root '/' we only match exactly.
                // Otherwise we check if pathname starts with current.href
                const isMatch =
                  current.href === '/'
                    ? pathname === '/'
                    : pathname === current.href || pathname.startsWith(`${current.href}/`);

                if (isMatch && current.href.length > best.href.length) {
                  return current;
                }
                return best;
              },
              { href: '' },
            );

            const isActive = bestMatch.href === item.href;

            return (
              <NavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={isActive}
                badge={item.badge}
                onClick={onClose}
                themeColor={themeColor}
              />
            );
          })}
        </div>
      </nav>

      {/* 3. Help Card (Optional) */}
      {showHelpCard && (
        <div className="px-5 pt-4 pb-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-semibold text-slate-900">Need Help?</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Platform support is available 24/7.
            </p>
            <button
              type="button"
              className={cn(
                'mt-5 flex w-full items-center justify-center gap-2 rounded-xl border bg-white py-3 text-sm font-semibold transition',
                borderColor,
                btnHover,
                textColor,
              )}
            >
              <Headphones className="h-4 w-4" />
              Contact Support
            </button>
          </div>
        </div>
      )}

      {/* 4. Footer */}
      {customFooter ? (
        customFooter
      ) : (
        <div className="border-t border-slate-200 p-5">
          <div className="flex items-center gap-3">
            {footerIcon}
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-slate-900">{footerTitle}</p>
              <p className="truncate text-xs text-slate-500">{footerSubtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:flex">{sidebarContent}</div>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 h-full shadow-2xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
