/* eslint-disable */
import { Client, Project, ProjectStatus } from '@prisma/client';

export type ProjectWithClient = Project & {
  client: Pick<Client, 'id' | 'name' | 'code'>;
};

export interface ProjectStats {
  total: number;
  active: number;
  inactive: number;
  archived: number;
}
