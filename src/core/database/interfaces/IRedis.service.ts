export interface IRedisService {
  init(): Promise<void>;
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
  del(key: string): Promise<void>;
}
