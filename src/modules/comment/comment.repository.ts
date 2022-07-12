import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Comment } from "./entity/comment.entity";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { Logger } from "../../shared/utils/logger.util";

@injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async createComment(commentEntity: Comment): Promise<Comment> {
    const repository = await this._database.getRepository(Comment);
    const comment = await repository.save(commentEntity);
    return comment;
  }

  async findById(id: number): Promise<Comment | null> {
    const repository = await this._database.getRepository(Comment);
    return await repository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Comment);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Comment>);
  }
}
