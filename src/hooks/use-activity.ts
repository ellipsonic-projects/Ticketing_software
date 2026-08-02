import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/services/api/api-client';
import { TimelineEvent } from '@/lib/activity/activity.schema';

interface ActivityResponse {
  data: TimelineEvent[];
  total: number;
  pages: number;
}

export function useActivity(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['my-activity', page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await apiClient<{ data: ActivityResponse }>(
        `/users/me/activity?${searchParams.toString()}`,
      );
      return res.data;
    },
    staleTime: 60_000,
  });
}
