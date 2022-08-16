import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { UpdateLogType } from "../../shared/type.shared";
import { Logger } from "../../shared/utils/logger.util";
import { UpdateLog } from "./entity/update-log.entity";
import { IUpdateLogRepository } from "./interfaces/IUpdate-log.repository";
import { IUpdateLogService } from "./interfaces/IUpdate-log.service";

@injectable()
export class UpdateLogService implements IUpdateLogService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IUpdateLogRepository)
    private readonly _updateLogRepository: IUpdateLogRepository
  ) {}

  //TODO: create

  public async findLastOneByType(
    userId: any,
    type: UpdateLogType
  ): Promise<UpdateLog | null> {
    if (type === "mbti")
      return await this._updateLogRepository.findLastOfTypeMbtiByUserId(userId);
    // UpdateLogType === nickname
    else
      return await this._updateLogRepository.findLastOfTypeNicknameByUserId(
        userId
      );
  }
}
