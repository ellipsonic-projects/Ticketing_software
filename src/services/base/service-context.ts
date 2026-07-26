import { DbClient } from '@/repositories/base.repository';
import { RequestContext } from '@/lib/request-context';

export interface ServiceContextOptions {
  reqContext: RequestContext;
  db?: DbClient;
}

export class ServiceContext {
  public readonly reqContext: RequestContext;
  public db?: DbClient;

  constructor(options: ServiceContextOptions) {
    this.reqContext = options.reqContext;
    this.db = options.db;
  }
}
