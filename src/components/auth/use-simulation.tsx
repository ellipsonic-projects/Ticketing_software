'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type SimulationStage =
  | 'idle'
  | 'arrived'
  | 'classifying'
  | 'receive'
  | 'process'
  | 'engineer'
  | 'reply'
  | 'resolve'
  | 'analytics'
  | 'ticket_update'
  | 'operational';

type SimulationState = {
  stage: SimulationStage;
  cycleCount: number;
};

const SimulationContext = createContext<SimulationState>({ stage: 'idle', cycleCount: 0 });

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimulationState>({ stage: 'idle', cycleCount: 0 });

  useEffect(() => {
    let mounted = true;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const runCycle = async () => {
      // 1.5s initial load wait
      await sleep(100);

      while (mounted) {
        setState((prev) => ({ stage: 'arrived', cycleCount: prev.cycleCount })); // Notification
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'classifying', cycleCount: prev.cycleCount })); // AI
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'receive', cycleCount: prev.cycleCount })); // Workflow 1
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'process', cycleCount: prev.cycleCount })); // Workflow 2
        await sleep(1500);
        if (!mounted) break;

        setState((prev) => ({ stage: 'engineer', cycleCount: prev.cycleCount })); // Team
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'reply', cycleCount: prev.cycleCount })); // Quick Reply
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'resolve', cycleCount: prev.cycleCount })); // Workflow 3
        await sleep(1500);
        if (!mounted) break;

        setState((prev) => ({ stage: 'analytics', cycleCount: prev.cycleCount })); // Analytics
        await sleep(600);
        if (!mounted) break;

        setState((prev) => ({ stage: 'ticket_update', cycleCount: prev.cycleCount })); // Ticket Counter
        await sleep(1000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'operational', cycleCount: prev.cycleCount })); // Status Badge
        await sleep(2000);
        if (!mounted) break;

        setState((prev) => ({ stage: 'idle', cycleCount: prev.cycleCount + 1 })); // Pause before repeat
        await sleep(1500);
      }
    };

    runCycle();

    return () => {
      mounted = false;
    };
  }, []);

  return <SimulationContext.Provider value={state}>{children}</SimulationContext.Provider>;
}

export const useSimulation = () => useContext(SimulationContext);
