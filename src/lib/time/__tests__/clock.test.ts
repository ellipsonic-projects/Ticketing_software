import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { clock } from '../clock';

describe('Time Provider (Clock)', () => {
  const fixedDate = new Date('2026-07-26T12:00:00.000Z');

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('now() should return the current Date object', () => {
    const current = clock.now();
    expect(current).toBeInstanceOf(Date);
    expect(current.getTime()).toBe(fixedDate.getTime());
  });

  it('iso() should return the current ISO string', () => {
    const isoString = clock.iso();
    expect(isoString).toBe('2026-07-26T12:00:00.000Z');
  });
});
