import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClientQuery, CreateClientInput, UpdateClientInput, OnboardClientInput } from '@/lib/client/client.schema';
import { clientApi } from '@/services/api/client-api';
import { useAuth } from '@/hooks/use-auth';

export function useClients(query: ClientQuery) {
  const { accessToken } = useAuth();
  
  return useQuery({
    queryKey: ['clients', query],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.getClients(query, accessToken);
    },
    enabled: !!accessToken,
    staleTime: 60_000,
  });
}

export function useClientActivity(id: string, page = 1, pageSize = 20) {
  const { accessToken } = useAuth();
  
  return useQuery({
    queryKey: ['clients', id, 'activity', page, pageSize],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.getClientActivity(id, page, pageSize, accessToken);
    },
    enabled: !!accessToken && !!id,
    staleTime: 60_000,
  });
}

export function useClient(id: string) {
  const { accessToken } = useAuth();
  
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.getClient(id, accessToken);
    },
    enabled: !!accessToken && !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (data: CreateClientInput) => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.createClient(data, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useOnboardClient() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (data: OnboardClientInput) => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.onboardClient(data, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientInput }) => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.updateClient(id, data, accessToken);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['clients', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) throw new Error('No access token');
      return clientApi.deleteClient(id, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
