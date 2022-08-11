import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { Comment } from "./entity/comment.entity";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { Logger } from "../../shared/utils/logger.util";
import { GetAllByUserDto, GetAllCommentDto, GetAllRepliesDto } from "./dto";
import { CommentOrder } from "../../shared/enum.shared";

@injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  public async createComment(commentEntity: Comment): Promise<Comment> {
    const repository = await this._database.getRepository(Comment);
    const comment = await repository.save(commentEntity);
    return comment;
  }

  public async findOneById(id: number): Promise<Comment | null> {
    const repository = await this._database.getRepository(Comment);
    return await repository.findOne({ where: { id } });
  }

  public async findAllComments(
    pageOptionsDto: GetAllCommentDto
  ): Promise<Comment[]> {
    const repository = await this._database.getRepository(Comment);
    const queryBuilder = repository
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
      .orderBy(`comment.id`, "ASC");
    //TODO: LIKES_COUNT 개선 필요
    if (pageOptionsDto.order === CommentOrder.LIKES_COUNT) {
      queryBuilder.addOrderBy(`comment.${pageOptionsDto.order}`, "ASC");
    }

    return queryBuilder.getMany();
  }

  public async findAllReplies(
    pageOptionsDto: GetAllRepliesDto
  ): Promise<[Comment[], number]> {
    const { parentId, startId, maxResults } = pageOptionsDto;
    const repository = await this._database.getRepository(Comment);
    return await repository
      .createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.userId",
        "comment.taggedId",
        "comment.userNickname",
        "comment.userMbti",
        "comment.isSecret",
        "comment.content",
        "comment.likesCount",
        "comment.isPostWriter",
        "comment.isActive",
        "comment.createdAt",
        "comment.updatedAt",
        "post.userId",
      ])
      .where("comment.id >= :startId", { startId })
      .andWhere("comment.parent_id = :parentId", { parentId })
      .innerJoin("comment.post", "post", "post.id = comment.postId")
      .take(maxResults + 1) // nextId를 위한 +1
      .orderBy(`comment.createdAt`, "ASC")
      .getManyAndCount();
  }

  public async findAllByUser(
    pageOptionsDto: GetAllByUserDto,
    userId: number
  ): Promise<[Comment[], number]> {
    const repository = await this._database.getRepository(Comment);
    return await repository
      .createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.content",
        "comment.replyCount",
        "comment.likesCount",
        "comment.isPostWriter",
        "comment.isActive",
        "comment.createdAt",
        "comment.updatedAt",
        "post.id",
        "post.title",
        "post.isActive",
        "post.commentCount",
      ])
      .where("comment.user_id = :userId", { userId })
      .andWhere("comment.is_active = true")
      .innerJoin("comment.post", "post", "post.id = comment.postId")
      .take(pageOptionsDto.maxResults)
      .skip(pageOptionsDto.skip)
      .orderBy(`comment.createdAt`, "DESC")
      .getManyAndCount();
  }

  public async update(id: number, payload: Partial<Comment>) {
    const repository = await this._database.getRepository(Comment);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Comment>)
      .then(async () => await repository.findOne({ where: { id } }));
  }

  public async increaseReportCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Comment);
    const result = await repository.increment({ id }, "reportCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async increaseReplyCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Comment);
    const result = await repository.increment({ id }, "replyCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async increaseLikeCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Comment);
    const result = await repository.increment({ id }, "likesCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async decreaseLikeCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Comment);
    const result = await repository.decrement({ id }, "likesCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Comment);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Comment>);
  }
}
