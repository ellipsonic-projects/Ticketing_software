import { storageConfig } from '@/config';

import { LocalStorageProvider } from './local-storage';
import { IStorageProvider } from './types';

let storage: IStorageProvider;

switch (storageConfig.provider) {
  case 'local':
  default:
    storage = new LocalStorageProvider();
    break;
}

export { storage };
