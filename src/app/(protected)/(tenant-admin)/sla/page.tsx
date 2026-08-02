'use client';

import { useEffect, useState } from 'react';

import { AlertCircle, ChevronRight, Clock, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenantSLA, useUpdateTenantSLASettings, useUpdateTenantSLATier } from '@/hooks/use-sla';

const PRIORITY_META = {
  URGENT: {
    label: 'URGENT',
    desc: 'System down or critical impact',
    borderClass: 'border-red-500',
    badgeClass: 'bg-red-50 text-red-600 border-red-200',
    activeClass: 'border-red-500 bg-slate-50',
  },
  HIGH: {
    label: 'HIGH',
    desc: 'Major feature affected',
    borderClass: 'border-orange-500',
    badgeClass: 'bg-orange-50 text-orange-600 border-orange-200',
    activeClass: 'border-orange-500 bg-slate-50',
  },
  MEDIUM: {
    label: 'MEDIUM',
    desc: 'Minor feature or functionality issue',
    borderClass: 'border-yellow-500',
    badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    activeClass: 'border-yellow-500 bg-slate-50',
  },
  LOW: {
    label: 'LOW',
    desc: 'Cosmetic or enhancement',
    borderClass: 'border-green-500',
    badgeClass: 'bg-green-50 text-green-600 border-green-200',
    activeClass: 'border-green-500 bg-slate-50',
  },
} as const;

type PriorityType = keyof typeof PRIORITY_META;

export default function SLAPolicyPage() {
  const { data, isLoading } = useTenantSLA();
  const updateTier = useUpdateTenantSLATier();

  const [selectedPriority, setSelectedPriority] = useState<PriorityType>('URGENT');
  const [tierForm, setTierForm] = useState({
    responseVal: 0,
    responseUnit: 'Minutes',
    resolutionVal: 0,
    resolutionUnit: 'Hours',
  });

  const policy = data?.policy;

  // Initialize form when policy or selected priority changes
  useEffect(() => {
    if (policy?.tiers) {
      const tier = policy.tiers.find((t: any) => t.priority === selectedPriority);
      if (tier) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTierForm({
          responseVal:
            tier.responseTimeMinutes >= 60 && tier.responseTimeMinutes % 60 === 0
              ? tier.responseTimeMinutes / 60
              : tier.responseTimeMinutes,
          responseUnit:
            tier.responseTimeMinutes >= 60 && tier.responseTimeMinutes % 60 === 0
              ? 'Hours'
              : 'Minutes',
          resolutionVal:
            tier.resolutionTimeMinutes >= 60 && tier.resolutionTimeMinutes % 60 === 0
              ? tier.resolutionTimeMinutes / 60
              : tier.resolutionTimeMinutes,
          resolutionUnit:
            tier.resolutionTimeMinutes >= 60 && tier.resolutionTimeMinutes % 60 === 0
              ? 'Hours'
              : 'Minutes',
        });
      }
    }
  }, [policy, selectedPriority]);

  const handleSaveTier = async () => {
    try {
      const responseMins =
        tierForm.responseUnit === 'Hours' ? tierForm.responseVal * 60 : tierForm.responseVal;
      const resolutionMins =
        tierForm.resolutionUnit === 'Hours' ? tierForm.resolutionVal * 60 : tierForm.resolutionVal;

      await updateTier.mutateAsync({
        priority: selectedPriority,
        responseTimeMinutes: responseMins,
        resolutionTimeMinutes: resolutionMins,
      });
      toast.success(`${selectedPriority} SLA tier updated`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update SLA tier');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full gap-6 space-y-6 p-8">
        <Skeleton className="h-full w-[300px]" />
        <Skeleton className="h-full flex-1" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-slate-300" />
        <h3 className="text-lg font-semibold text-slate-900">No SLA Policy Found</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Your tenant does not have a default SLA policy configured yet. Please contact support.
        </p>
      </div>
    );
  }

  const meta = PRIORITY_META[selectedPriority];

  return (
    <div className="flex h-full gap-8 overflow-hidden bg-white p-8">
      {/* Left Pane - Priority Levels */}
      <div className="flex w-[340px] shrink-0 flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Priority Levels</h2>
          <p className="mt-1 text-sm text-slate-500">Manage SLA targets for each priority</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-8">
          {(Object.keys(PRIORITY_META) as PriorityType[]).map((p) => {
            const m = PRIORITY_META[p];
            const isActive = selectedPriority === p;
            return (
              <div
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`group cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-sm ${
                  isActive
                    ? m.activeClass + ' border-l-4'
                    : 'border-l-4 border-slate-200 hover:border-slate-300 ' +
                      'border-l-' +
                      m.borderClass.split('-')[1] +
                      '-500'
                }`}
                style={
                  !isActive
                    ? {
                        borderLeftColor:
                          m.badgeClass.match(/text-([a-z]+)-/)?.[1] === 'red'
                            ? '#ef4444'
                            : m.badgeClass.match(/text-([a-z]+)-/)?.[1] === 'orange'
                              ? '#f97316'
                              : m.badgeClass.match(/text-([a-z]+)-/)?.[1] === 'yellow'
                                ? '#eab308'
                                : '#22c55e',
                      }
                    : {}
                }
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${m.badgeClass}`}
                  >
                    {m.label}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${isActive ? 'translate-x-1 text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}
                  />
                </div>
                <p className="text-sm text-slate-600">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane - Edit SLA */}
      <div className="flex h-[fit-content] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                Edit SLA for {meta.label.charAt(0) + meta.label.slice(1).toLowerCase()} Priority
              </h2>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${meta.badgeClass}`}
              >
                {meta.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Set response and resolution time targets for{' '}
              {meta.label.charAt(0) + meta.label.slice(1).toLowerCase()} priority tickets.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto bg-slate-50/30 p-6">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-slate-200 pb-3 text-sm font-medium text-slate-500">
            <div className="col-span-5">SLA Target</div>
            <div className="col-span-7">Business Hours</div>
          </div>

          <div className="space-y-6">
            {/* First Response Time */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-5 flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Clock className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">First Response Time</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Time to respond to the ticket</p>
                </div>
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  className="h-10 w-24 bg-white text-center"
                  value={tierForm.responseVal}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, responseVal: Number(e.target.value) })
                  }
                />
                <select
                  className="h-10 w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  value={tierForm.responseUnit}
                  onChange={(e) => setTierForm({ ...tierForm, responseUnit: e.target.value })}
                >
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>
            </div>

            <div className="h-px w-full bg-slate-200" />

            {/* Resolution Time */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-5 flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Clock className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Resolution Time</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Time to resolve the ticket</p>
                </div>
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  className="h-10 w-24 bg-white text-center"
                  value={tierForm.resolutionVal}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, resolutionVal: Number(e.target.value) })
                  }
                />
                <select
                  className="h-10 w-32 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  value={tierForm.resolutionUnit}
                  onChange={(e) => setTierForm({ ...tierForm, resolutionUnit: e.target.value })}
                >
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Business Hours: Monday - Friday, 09:00 AM - 06:00 PM (Tenant Timezone)
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                SLA calculations exclude holidays and non-business hours.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <Button
            className="w-32 bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSaveTier}
            disabled={updateTier.isPending}
          >
            {updateTier.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
