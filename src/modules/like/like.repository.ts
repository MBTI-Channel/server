import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Like } from "./entity/like.entity";
import { ILikeRepository } from "./interfaces/ILike.repository";

@injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}
  async findOneById(id: number): Promise<Like | null> {
    const repository = await this._database.getRepository(Like);
    return await repository.findOne({ where: { id } });
  }

  async findOneByTarget(
    targetId: number,
    targetType: number
  ): Promise<Like | null> {
    const repository = await this._database.getRepository(Like);
    return await repository.findOne({ where: { targetId, targetType } });
  }

  async createLike(likeEntity: Like): Promise<Like> {
    const repository = await this._database.getRepository(Like);
    const like = await repository.save(likeEntity);
    return like;
  }
}
