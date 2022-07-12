import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../../core/type.core";
import { ICommentService } from "./interfaces/IComment.service";
import { IPostService } from "../post/interfaces/IPost.service";
import { INotificationService } from "../notifications/interfaces/INotification.service";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { Comment } from "./entity/comment.entity";
import { User } from "../user/entity/user.entity";
import {
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { CommentResponseDto } from "./dto/all-response.dto";
import { HttpException } from "../../shared/errors/http.exception";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.IPostService)
    private readonly _postService: IPostService,
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService,
    @inject(TYPES.IDatabaseService)
    private readonly _dbService: IDatabaseService
  ) {}

  private _toCommentResponseDto(comment: Comment) {
    return plainToInstance(CommentResponseDto, { id: comment.id });
  }

  async createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto> {
    const post = await this._postRepository.findOneById(postId);

    // err: 존재하지않는 || 삭제된 post
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    const commentEntity = new Comment();
    commentEntity.post = post;
    commentEntity.user = user;
    commentEntity.userNickname = user.nickname;
    commentEntity.userMbti = user.mbti;
    commentEntity.content = content;
    commentEntity.isSecret = isSecret;

    const t = await this._dbService.getTransaction();
    await t.startTransaction();
    try {
      const comment = await this._commentRepository.createComment(
        commentEntity
      );
      await this._postService.increaseCommentCount(post.id);
      await this._notificationService.createByTargetUser(
        user,
        post.userId,
        postId,
        "comment"
      );
      await t.commitTransaction();
      return this._toCommentResponseDto(comment);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }

  async delete(user: User, id: number): Promise<void> {
    this._logger.trace(`[CommentService] delete start`);
    const comment = await this._commentRepository.findById(id);

    this._logger.trace(`[CommentService] check exists comment id ${id}`);
    //err: 존재하지 않는 댓글 || 비활성화된 댓글
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    this._logger.trace(
      `[CommentService] check user authorization u: ${id} c: ${comment.id}`
    );
    //err: 권한 없음
    if (comment.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._logger.trace(`[CommentService] remove comment ${id}`);
    await this._commentRepository.remove(id);
  }
}
