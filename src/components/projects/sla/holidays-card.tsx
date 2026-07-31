/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { HolidayCreateSchema, HolidayCreateInput } from '@/lib/project/sla.schema';
import { useProjectHolidays, useCreateHoliday, useDeleteHoliday } from '@/hooks/use-sla';
import { useCan } from '@/hooks/use-can';

export function HolidaysCard({ projectId, isArchived }: { projectId: string; isArchived?: boolean }) {
  const canUpdate = useCan('PROJECT_UPDATE') && !isArchived;
  const { data: response, isLoading } = useProjectHolidays(projectId);
  const { mutateAsync: createHoliday, isPending: isCreating } = useCreateHoliday(projectId);
  const { mutateAsync: deleteHoliday, isPending: isDeleting } = useDeleteHoliday(projectId);

  const holidays = response?.holidays || [];

  const form = useForm<HolidayCreateInput>({
    resolver: zodResolver(HolidayCreateSchema) as any,
    defaultValues: {
      name: '',
      holidayDate: '',
    },
  });

  const onSubmit = async (values: HolidayCreateInput) => {
    try {
      await createHoliday(values);
      form.reset();
      toast.success('Holiday added successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add holiday');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;
    try {
      await deleteHoliday(id);
      toast.success('Holiday deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete holiday');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Holidays</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holidays</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {holidays.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  {canUpdate && <TableHead className="w-[100px] text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday: any) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{new Date(holiday.holidayDate).toLocaleDateString()}</TableCell>
                    {canUpdate && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting}
                          onClick={() => handleDelete(holiday.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 border rounded-md bg-slate-50">
            No holidays configured for this project.
          </div>
        )}

        {canUpdate && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-4">Add Holiday</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Holiday Name (e.g., New Year)" disabled={isCreating} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control as any}
                  name="holidayDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input type="date" disabled={isCreating} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700">
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Holiday
                </Button>
              </form>
            </Form>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
