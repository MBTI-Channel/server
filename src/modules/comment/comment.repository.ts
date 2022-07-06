import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Comment } from "./entity/comment.entity";
import { ICommentRepository } from "./interfaces/IComment.repository";

@injectable()
export class CommentRepository implements ICommentRepository {
  @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService;

  async createComment(commentEntity: Comment): Promise<Comment> {
    const repository = await this._database.getRepository(Comment);
    const comment = await repository.save(commentEntity);
    return comment;
  }
}
