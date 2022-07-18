import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Comment } from "./entity/comment.entity";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { Logger } from "../../shared/utils/logger.util";
import { GetAllCommentDto } from "./dto/get-all-comment.dto";

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

  async findAllComments(
    pageOptionsDto: GetAllCommentDto
  ): Promise<[Comment[], number]> {
    const repository = await this._database.getRepository(Comment);
    return await repository
      .createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.userId",
        "comment.userNickname",
        "comment.userMbti",
        "comment.isSecret",
        "comment.content",
        "comment.replyCount",
        "comment.likesCount",
        "comment.isPostWriter",
        "comment.isActive",
        "comment.createdAt",
        "comment.updatedAt",
        "post.userId",
      ])
      .where("comment.post_id = :postId", { postId: pageOptionsDto.postId })
      .andWhere("comment.parent_id IS NULL")
      .innerJoin("comment.post", "post", "post.id = comment.postId")
      .take(pageOptionsDto.maxResults)
      .skip(pageOptionsDto.skip)
      .orderBy(`comment.${pageOptionsDto.order}`, pageOptionsDto.orderOption)
      .getManyAndCount();
  }

  async update(id: number, payload: Partial<Comment>) {
    const repository = await this._database.getRepository(Comment);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Comment>)
      .then(async () => await repository.findOne({ where: { id } }));
  }

  public async increaseReplyCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Comment);
    const result = await repository.increment({ id }, "replyCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Comment);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Comment>);
  }
}
