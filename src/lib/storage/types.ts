/// <reference types="node" />

export interface IStorageProvider {
  upload(file: File | Blob | Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<boolean>;
  getUrl(filename: string): string;
}
