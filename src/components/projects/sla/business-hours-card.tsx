/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

import { BusinessHoursSchema } from '@/lib/project/sla.schema';
import { useBusinessHours, useUpdateBusinessHours } from '@/hooks/use-sla';
import { useCan } from '@/hooks/use-can';
import { z } from 'zod';

const FormSchema = z.object({
  schedule: BusinessHoursSchema,
});
type FormValues = z.infer<typeof FormSchema>;

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function BusinessHoursCard({ projectId, isArchived }: { projectId: string; isArchived?: boolean }) {
  const canUpdate = useCan('PROJECT_UPDATE') && !isArchived;
  const { data: response, isLoading } = useBusinessHours(projectId);
  const { mutateAsync: updateSchedule, isPending } = useUpdateBusinessHours(projectId);

  const businessHours = response?.businessHours;

  const defaultSchedule = DAYS_OF_WEEK.map((_, index) => ({
    dayOfWeek: index,
    isOpen: index !== 0 && index !== 6, // Closed on weekends by default
    startTime: index !== 0 && index !== 6 ? '09:00' : null,
    endTime: index !== 0 && index !== 6 ? '18:00' : null,
    timezone: null,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schedule: defaultSchedule,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  // Helper to format ISO Date to HH:mm string
  const formatTime = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString().substr(11, 5); // Extract HH:mm from 1970-01-01THH:mm:00.000Z
  };

  useEffect(() => {
    if (businessHours && businessHours.length === 7) {
      form.reset({
        schedule: businessHours.map((bh: any) => ({
          dayOfWeek: bh.dayOfWeek,
          isOpen: bh.isOpen,
          startTime: formatTime(bh.startTime),
          endTime: formatTime(bh.endTime),
          timezone: bh.timezone,
        })),
      });
    }
  }, [businessHours, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSchedule(values.schedule);
      toast.success('Business hours saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save Business Hours');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Business Hours</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-center border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="col-span-12 sm:col-span-3 font-medium text-sm">
                    {DAYS_OF_WEEK[index]}
                  </div>
                  
                  <div className="col-span-12 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.isOpen`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked) {
                                  form.setValue(`schedule.${index}.startTime`, null);
                                  form.setValue(`schedule.${index}.endTime`, null);
                                } else {
                                  form.setValue(`schedule.${index}.startTime`, '09:00');
                                  form.setValue(`schedule.${index}.endTime`, '18:00');
                                }
                              }}
                              disabled={!canUpdate}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-sm">
                            Enabled
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              disabled={!form.watch(`schedule.${index}.isOpen`) || !canUpdate}
                              value={field.value || ''}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              disabled={!form.watch(`schedule.${index}.isOpen`) || !canUpdate}
                              value={field.value || ''}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {canUpdate && (
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending || !form.formState.isDirty} className="bg-indigo-600 hover:bg-indigo-700">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Business Hours
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
