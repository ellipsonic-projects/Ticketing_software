import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const gradients = [
  'from-indigo-100 to-white text-indigo-700 ring-indigo-100',
  'from-emerald-100 to-white text-emerald-700 ring-emerald-100',
  'from-amber-100 to-white text-amber-700 ring-amber-100',
  'from-rose-100 to-white text-rose-700 ring-rose-100',
  'from-fuchsia-100 to-white text-fuchsia-700 ring-fuchsia-100',
  'from-cyan-100 to-white text-cyan-700 ring-cyan-100',
  'from-violet-100 to-white text-violet-700 ring-violet-100',
  'from-pink-100 to-white text-pink-700 ring-pink-100',
];

const hovers = [
  'hover:bg-indigo-50/60 data-[selected=true]:bg-indigo-50/80 border-l-2 border-transparent data-[selected=true]:border-indigo-500',
  'hover:bg-emerald-50/60 data-[selected=true]:bg-emerald-50/80 border-l-2 border-transparent data-[selected=true]:border-emerald-500',
  'hover:bg-amber-50/60 data-[selected=true]:bg-amber-50/80 border-l-2 border-transparent data-[selected=true]:border-amber-500',
  'hover:bg-rose-50/60 data-[selected=true]:bg-rose-50/80 border-l-2 border-transparent data-[selected=true]:border-rose-500',
  'hover:bg-fuchsia-50/60 data-[selected=true]:bg-fuchsia-50/80 border-l-2 border-transparent data-[selected=true]:border-fuchsia-500',
  'hover:bg-cyan-50/60 data-[selected=true]:bg-cyan-50/80 border-l-2 border-transparent data-[selected=true]:border-cyan-500',
  'hover:bg-violet-50/60 data-[selected=true]:bg-violet-50/80 border-l-2 border-transparent data-[selected=true]:border-violet-500',
  'hover:bg-pink-50/60 data-[selected=true]:bg-pink-50/80 border-l-2 border-transparent data-[selected=true]:border-pink-500',
];

export function getStringColorGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export function getStringColorHover(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % hovers.length;
  return hovers[index];
}
