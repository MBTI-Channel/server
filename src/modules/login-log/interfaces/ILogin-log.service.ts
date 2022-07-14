import { User } from "../../user/entity/user.entity";

export interface ILoginLogService {
  record(user: User, userAgent: string, ip: string): Promise<void>;
}
