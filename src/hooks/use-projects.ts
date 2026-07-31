import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { projectApi } from '@/services/api/project-api';
import { ProjectQuery, CreateProjectInput, UpdateProjectInput } from '@/lib/project/project.schema';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectQuery & { withStats?: boolean }) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  stats: () => [...projectKeys.all, 'stats'] as const,
};

export function useProjects(query: ProjectQuery & { withStats?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: projectKeys.list(query),
    queryFn: () => projectApi.getProjects(query),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useProjectActivity(id: string, page = 1, pageSize = 20) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [...projectKeys.detail(id), 'activity', page, pageSize],
    queryFn: () => projectApi.getProjectActivity(id, page, pageSize),
    enabled: !!id && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useProjectStats() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn: () => projectApi.getStats(),
    enabled: isAuthenticated,
  });
}

export function useProject(id: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getProject(id),
    enabled: !!id && isAuthenticated,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectInput) => projectApi.updateProject({ id, data }),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.archiveProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
  });
}
