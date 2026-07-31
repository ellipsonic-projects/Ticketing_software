/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/services/api/api-client';
import { SLAPolicyInput, BusinessHoursInput, HolidayCreateInput, HolidayUpdateInput } from '@/lib/project/sla.schema';

export const slaKeys = {
  all: ['project-sla'] as const,
  policy: (projectId: string) => [...slaKeys.all, projectId, 'policy'] as const,
  businessHours: (projectId: string) => [...slaKeys.all, projectId, 'business-hours'] as const,
  holidays: (projectId: string) => [...slaKeys.all, projectId, 'holidays'] as const,
};

// --- SLA Policy ---

export function useProjectSLA(projectId: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: slaKeys.policy(projectId),
    queryFn: () => apiClient<any>(`/projects/${projectId}/sla`),
    enabled: !!projectId && isAuthenticated,
  });
}

export function useUpdateProjectSLA(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SLAPolicyInput) => apiClient<any>(`/projects/${projectId}/sla`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slaKeys.policy(projectId) });
    },
  });
}

// --- Business Hours ---

export function useBusinessHours(projectId: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: slaKeys.businessHours(projectId),
    queryFn: () => apiClient<any>(`/projects/${projectId}/business-hours`),
    enabled: !!projectId && isAuthenticated,
  });
}

export function useUpdateBusinessHours(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BusinessHoursInput) => apiClient<any>(`/projects/${projectId}/business-hours`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slaKeys.businessHours(projectId) });
    },
  });
}

// --- Holidays ---

export function useProjectHolidays(projectId: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: slaKeys.holidays(projectId),
    queryFn: () => apiClient<any>(`/projects/${projectId}/holidays`),
    enabled: !!projectId && isAuthenticated,
  });
}

export function useCreateHoliday(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HolidayCreateInput) => apiClient<any>(`/projects/${projectId}/holidays`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slaKeys.holidays(projectId) });
    },
  });
}

export function useUpdateHoliday(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ holidayId, data }: { holidayId: string; data: HolidayUpdateInput }) => 
      apiClient<any>(`/projects/${projectId}/holidays/${holidayId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slaKeys.holidays(projectId) });
    },
  });
}

export function useDeleteHoliday(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holidayId: string) => apiClient<any>(`/projects/${projectId}/holidays/${holidayId}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slaKeys.holidays(projectId) });
    },
  });
}
