import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { Like } from "./entity/like.entity";
import { ILikeRepository } from "./interfaces/ILike.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}
  public async findOneById(id: number): Promise<Like | null> {
    const repository = await this._database.getRepository(Like);
    return await repository.findOne({ where: { id } });
  }

  public async findOneByTarget(
    userId: number,
    targetId: number,
    targetType: number
  ): Promise<Like | null> {
    const repository = await this._database.getRepository(Like);
    return await repository.findOne({
      where: { userId, targetId, targetType },
    });
  }

  public async createLike(likeEntity: Like): Promise<Like> {
    const repository = await this._database.getRepository(Like);
    const like = await repository.save(likeEntity);
    return like;
  }

  public async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Like);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Like>);
  }

  public async active(id: number): Promise<Like> {
    const repository = await this._database.getRepository(Like);
    const like = await repository
      .update(id, {
        isActive: true,
      } as QueryDeepPartialEntity<Like>)
      .then(async () => await repository.findOne({ where: { id } }));
    return like;
  }
}
