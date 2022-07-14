import { LoginLog } from "../entity/login-log.entity";

export interface ILoginLogRepository {
  create(loginLogEntity: LoginLog): Promise<void>;
}
