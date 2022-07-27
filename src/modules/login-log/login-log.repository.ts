import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { LoginLog } from "./entity/login-log.entity";
import { ILoginLogRepository } from "./interfaces/ILogin-log.repository";

@injectable()
export class LoginLogRepository implements ILoginLogRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}
  async create(loginLogEntity: LoginLog): Promise<void> {
    const repository = await this._database.getRepository(LoginLog);
    await repository.save(loginLogEntity);
  }
}
