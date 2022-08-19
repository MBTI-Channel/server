import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/types.core";
import { Logger } from "../../../shared/utils/logger.util";
import { User } from "../entity/user.entity";
import { LoginLog } from "./entity/login-log.entity";
import { ILoginLogRepository } from "./interfaces/ILogin-log.repository";
import { ILoginLogService } from "./interfaces/ILogin-log.service";

@injectable()
export class LoginLogService implements ILoginLogService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ILoginLogRepository)
    private readonly _loginLogRepository: ILoginLogRepository
  ) {}

  private _log(message: string) {
    this._logger.trace(`[LoginLogService] ${message}`);
  }

  public async record(
    user: User,
    userAgent: string,
    ip: string
  ): Promise<void> {
    this._log(`record start`);
    const loginLogEntity = LoginLog.of(user, ip, userAgent);

    await this._loginLogRepository.create(loginLogEntity);
    this._log(`record done`);
  }
}
