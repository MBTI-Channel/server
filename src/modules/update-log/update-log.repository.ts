import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { UpdateLog } from "./entity/update-log.entity";
import { IUpdateLogRepository } from "./interfaces/IUpdate-log.repository";

@injectable()
export class UdpateLogRepository implements IUpdateLogRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async create(entity: UpdateLog): Promise<UpdateLog> {
    const repository = await this._database.getRepository(UpdateLog);
    return await repository.save(entity);
  }

  public async findLastOfTypeMbtiByUserId(userId: number) {
    const repository = await this._database.getRepository(UpdateLog);
    return await repository.findOne({
      where: { userId, type: "mbti" },
      order: { id: "DESC" },
    });
  }

  public async findLastOfTypeNicknameByUserId(userId: number) {
    const repository = await this._database.getRepository(UpdateLog);
    return await repository.findOne({
      where: { userId, type: "nickname" },
      order: { id: "DESC" },
    });
  }
}
