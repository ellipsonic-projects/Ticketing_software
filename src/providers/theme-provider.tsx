'use client';

import * as React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // We will integrate next-themes and dark mode later
  return <>{children}</>;
}
