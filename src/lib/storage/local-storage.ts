import { IStorageProvider } from './types';

export class LocalStorageProvider implements IStorageProvider {
  async upload(file: File | Blob | Buffer, filename: string): Promise<string> {
    // Development placeholder - would write to local filesystem
    return `/uploads/${filename}`;
  }

  async delete(): Promise<boolean> {
    // Development placeholder
    return true;
  }

  getUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
