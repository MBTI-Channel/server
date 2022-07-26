import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { Logger } from "../../shared/utils/logger.util";
import { User } from "../user/entity/user.entity";
import { LoginLog } from "./entity/login-log.entity";
import { ILoginLogService } from "./interfaces/ILogin-log.service";
import { LoginLogRepository } from "./login-log.repository";

@injectable()
export class LoginLogService implements ILoginLogService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ILoginLogRepository)
    private readonly _loginLogRepository: LoginLogRepository
  ) {}

  async record(user: User, userAgent: string, ip: string): Promise<void> {
    this._logger.trace(`[LoginLogService] record start`);
    const loginLogEntity = LoginLog.of(user, ip, userAgent);

    await this._loginLogRepository.create(loginLogEntity);
    this._logger.trace(`[LoginLogService] record done`);
  }
}
