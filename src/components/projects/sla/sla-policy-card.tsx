/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

import { SLAPolicySchema, SLAPolicyInput } from '@/lib/project/sla.schema';
import { useProjectSLA, useUpdateProjectSLA } from '@/hooks/use-sla';
import { useCan } from '@/hooks/use-can';

export function SLAPolicyCard({ projectId, isArchived }: { projectId: string; isArchived?: boolean }) {
  const canUpdate = useCan('PROJECT_UPDATE') && !isArchived;
  const { data: response, isLoading } = useProjectSLA(projectId);
  const { mutateAsync: updateSLA, isPending } = useUpdateProjectSLA(projectId);

  const policy = response?.policy;

  const form = useForm<SLAPolicyInput>({
    resolver: zodResolver(SLAPolicySchema) as any,
    defaultValues: {
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 480,
      businessHoursEnabled: true,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (policy) {
      form.reset({
        responseTimeMinutes: policy.responseTimeMinutes,
        resolutionTimeMinutes: policy.resolutionTimeMinutes,
        businessHoursEnabled: policy.businessHoursEnabled,
      });
    }
  }, [policy, form]);

  const onSubmit = async (values: SLAPolicyInput) => {
    try {
      await updateSLA(values);
      toast.success('SLA Policy saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save SLA Policy');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>SLA Policy</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="responseTimeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Response SLA (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!canUpdate}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormDescription>
                      Time to first response. Example: 60 (1 hour).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="resolutionTimeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution SLA (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!canUpdate}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormDescription>
                      Time to resolve ticket. Example: 480 (8 hours).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="businessHoursEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!canUpdate}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Enable Business Hours Constraints
                    </FormLabel>
                    <FormDescription>
                      If enabled, SLA timers will pause outside of configured business hours.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {canUpdate && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending || !form.formState.isDirty} className="bg-indigo-600 hover:bg-indigo-700">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save SLA Policy
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
