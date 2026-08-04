import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { userApi } from '@/services/api/user-api';
import { ListUsersInput } from '@/lib/user/user.schema';

export function useUsers(query?: ListUsersInput) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['users', query],
    queryFn: () => userApi.getUsers(query),
    enabled: isAuthenticated,
  });
}

export function useUser(id: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUser(id),
    enabled: isAuthenticated && !!id,
  });
}
