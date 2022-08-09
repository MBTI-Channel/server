import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { GetAllTrendDto } from "./dto/get-all-trend.dto";
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

  public async findAllTrends(
    pageOptionsDto: GetAllTrendDto
  ): Promise<[Trend[], number]> {
    const repository = await this._database.getRepository(Trend);
    return await repository.findAndCount({
      select: ["id", "postId", "createdAt", "updatedAt"],
      relations: {
        post: true,
      },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
    });
  }
}
