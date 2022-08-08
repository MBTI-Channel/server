import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { Logger } from "../../shared/utils/logger.util";
import { Trend } from "./entity/trend.entity";
import { ITrendService } from "./interfaces/ITrend.service";
import { ITrendRepository } from "./interfaces/ITrendRepository";

@injectable()
export class TrendService implements ITrendService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ITrendRepository)
    private readonly _trendRepository: ITrendRepository
  ) {}

  private _log(message: string) {
    this._logger.trace(`[TrendService] ${message}`);
  }

  public async createTrend(targetId: number): Promise<void> {
    this._log("createTrend start");

    const trendEntity = Trend.of(targetId);

    const trend = await this._trendRepository.createTrend(trendEntity);

    // TODO: targetUser 에게 알림 보내기
  }
}
