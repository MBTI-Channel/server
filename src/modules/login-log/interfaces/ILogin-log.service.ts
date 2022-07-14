export interface ILoginLogService {
  record(userId: number, userAgent: string, ip: string): Promise<void>;
}
