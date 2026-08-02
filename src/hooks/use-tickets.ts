import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/services/api/api-client';
import {
  AssignTicketInput,
  CreateTicketInput,
  UpdateTicketInput,
} from '@/lib/ticket/ticket.schema';
import { TicketWithDetails } from '@/lib/ticket/ticket.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TicketListResponse {
  items: TicketWithDetails[];
  totalItems: number;
  totalPages: number;
  page: number;
}

interface TicketStatsResponse {
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  closedCount: number;
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

async function fetchTickets(searchParams: URLSearchParams): Promise<TicketListResponse> {
  const res = await apiClient<{ data: TicketListResponse }>(`/tickets?${searchParams.toString()}`);
  return res.data;
}

async function fetchTicketById(id: string): Promise<TicketWithDetails> {
  const res = await apiClient<{ data: { ticket: TicketWithDetails } }>(`/tickets/${id}`);
  return res.data.ticket;
}

async function fetchTicketStats(clientId?: string): Promise<TicketStatsResponse> {
  const url = clientId ? `/tickets/stats?clientId=${clientId}` : '/tickets/stats';
  const res = await apiClient<{ data: TicketStatsResponse }>(url);
  return res.data;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useTickets(searchParams: URLSearchParams) {
  return useQuery({
    queryKey: ['tickets', searchParams.toString()],
    queryFn: () => fetchTickets(searchParams),
    staleTime: 60_000,
  });
}

export function useTicketStats(clientId?: string) {
  return useQuery({
    queryKey: ['ticket-stats', clientId],
    queryFn: () => fetchTicketStats(clientId),
    staleTime: 60_000,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => fetchTicketById(id),
    staleTime: 60_000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTicketInput) => {
      const res = await apiClient<{ data: { ticket: TicketWithDetails } }>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateTicketInput) => {
      const res = await apiClient<{ data: { ticket: TicketWithDetails } }>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAssignTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AssignTicketInput) => {
      const res = await apiClient<{ data: { ticket: TicketWithDetails } }>(
        `/tickets/${id}/assign`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
