import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../shared/utils/logger.util";
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

  async record(userId: number, userAgent: string, ip: string): Promise<void> {
    this._logger.trace(`[LoginLogService] record start`);
    const loginLogEntity = new LoginLog();
    loginLogEntity.userId = userId;
    loginLogEntity.useragent = userAgent;
    loginLogEntity.ip = ip;

    await this._loginLogRepository.create(loginLogEntity);
    this._logger.trace(`[LoginLogService] record done`);
  }
}
