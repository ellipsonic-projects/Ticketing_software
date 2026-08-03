'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { formatDistanceToNow } from 'date-fns';
import { Bell, CalendarDays, Check, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from '@/hooks/use-notifications';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BaseHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  roleLabel?: string;
  notificationCount?: number; // Deprecated: Now fetched internally
  onMenuClick?: () => void;
  themeColor?: 'blue' | 'violet';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getCurrentDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function UserInitials({ name }: { readonly name: string }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }, [name]);

  return <span className="text-sm font-semibold text-white">{initials}</span>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BaseHeader({
  firstName,
  avatarUrl,
  roleLabel,
  onMenuClick,
  themeColor = 'blue',
}: BaseHeaderProps) {
  const { accessToken, logout } = useAuth();

  // Notification API Integration
  const { data: notificationsResponse } = useNotifications(accessToken ?? '');
  const markAsRead = useMarkNotificationAsRead(accessToken ?? '');
  const markAllAsRead = useMarkAllNotificationsAsRead(accessToken ?? '');

  const notifications = notificationsResponse?.data ?? [];
  const unreadCount = notificationsResponse?.meta?.unreadCount ?? 0;

  // Theme classes
  const accentText = themeColor === 'violet' ? 'text-violet-600' : 'text-blue-600';
  const avatarBg = themeColor === 'violet' ? 'bg-violet-600' : 'bg-blue-600';
  const focusBorder = themeColor === 'violet' ? 'focus:border-violet-500' : 'focus:border-blue-500';
  const focusRing = themeColor === 'violet' ? 'focus:ring-violet-100' : 'focus:ring-blue-100';
  const notificationLinkHover =
    themeColor === 'violet'
      ? 'text-violet-600 hover:text-violet-700'
      : 'text-blue-600 hover:text-blue-700';
  const notificationDot = themeColor === 'violet' ? 'bg-violet-500' : 'bg-blue-500';

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:h-24 lg:px-8">
        {/* LEFT — Hamburger + Greeting */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              {getGreeting()},<span className={accentText}> {firstName}</span> 👋
            </h1>
            <div className="mt-0.5 hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{getCurrentDate()}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
          {/* NOTIFICATIONS */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 focus:outline-none sm:h-12 sm:w-12 sm:rounded-2xl"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-2 w-72 rounded-xl border-slate-100 p-0 shadow-lg sm:w-96"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="font-semibold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead.mutate()}
                    className={`text-xs font-medium ${notificationLinkHover} disabled:opacity-50`}
                    disabled={markAllAsRead.isPending}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="flex max-h-[400px] flex-col overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    You have no new notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.isRead && markAsRead.mutate(notification.id)}
                      className={`relative border-b border-slate-50 px-4 py-3 transition ${
                        notification.isRead
                          ? 'bg-white opacity-70'
                          : 'cursor-pointer hover:bg-slate-50'
                      }`}
                    >
                      {!notification.isRead && (
                        <span
                          className={`absolute top-5 left-2 h-1.5 w-1.5 rounded-full ${notificationDot}`}
                        ></span>
                      )}
                      <p
                        className={`pl-2 text-sm font-medium ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 pl-2 text-xs leading-relaxed text-slate-500">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between pl-2">
                        <p className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                        {notification.isRead && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Check className="h-3 w-3" /> Read
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-100 p-2 text-center">
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                  View all notifications
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-100 focus:outline-none sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2"
              aria-label="User menu"
            >
              <div
                className={`relative h-8 w-8 overflow-hidden rounded-full ${avatarBg} sm:h-11 sm:w-11`}
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
                  <div className="flex h-full w-full items-center justify-center">
                    <UserInitials name={firstName} />
                  </div>
                )}
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-sm font-semibold text-slate-900">{firstName}</p>
                {roleLabel && <p className="mt-0.5 text-xs text-slate-500">{roleLabel}</p>}
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-slate-100 p-2 shadow-lg"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-slate-900">{firstName}</p>
                <p className="text-xs text-slate-500">{roleLabel ?? 'User'}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                variant="destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
