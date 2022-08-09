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

  public async findAllTrends(pageOptionsDto: GetAllTrendDto): Promise<Trend[]> {
    const repository = await this._database.getRepository(Trend);
    return await repository
      .createQueryBuilder("trend")
      .select([
        "trend.id",
        "trend.createdAt",
        "trend.updatedAt",
        "post.userId",
        "post.userMbti",
        "post.userNickname",
        "post.isSecret",
        "post.createdAt",
        "post.updatedAt",
        "post.title",
        "post.content",
        "post.viewCount",
        "post.likesCount",
        "post.commentCount",
      ])
      .innerJoin("trend.post", "post", "post.id = trend.postId")
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.maxResults + 1) // nextId를 위한 +1
      .orderBy(`trend.createdAt`, "DESC")
      .getMany();
  }
}
