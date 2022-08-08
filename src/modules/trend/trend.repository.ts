import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { Trend } from "./entity/trend.entity";
import { ITrendRepository } from "./interfaces/ITrendRepository";

@injectable()
export class TrendRepository implements ITrendRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async createTrend(trendEntity: Trend): Promise<Trend> {
    const repository = await this._database.getRepository(Trend);
    return await repository.save(trendEntity);
  }
}
