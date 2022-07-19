import { inject, injectable } from "inversify";
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
import {
  GetAllCommentDto,
  GetAllRepliesDto,
  CommentResponseDto,
  ReplyResponseDto,
} from "./dto";
import { Logger } from "../../shared/utils/logger.util";
import { HttpException } from "../../shared/errors/http.exception";
import {
  PageResponseDto,
  PageInfoDto,
  PageInfiniteScrollInfoDto,
} from "../../shared/page";

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

  async createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto> {
    const post = await this._postRepository.findOneById(postId);

    // err: 존재하지않는 || 삭제된 post
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    const commentEntity = Comment.of(post, user, content, isSecret);

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
      return new CommentResponseDto(comment, user);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }

  async findAllComments(pageOptionsDto: GetAllCommentDto, user: User) {
    this._logger.trace(`[CommentService] findAllComments start`);

    const isValidPost = this._postService.isValid(pageOptionsDto.postId);
    //err: 존재하지 않거나 삭제된 게시글
    if (!isValidPost) throw new NotFoundException("not exists post");

    const [commentArray, totalCount] =
      await this._commentRepository.findAllComments(pageOptionsDto);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      pageOptionsDto.maxResults,
      pageOptionsDto.page
    );

    return new PageResponseDto(
      pageInfoDto,
      commentArray.map((e) => new CommentResponseDto(e, user))
    );
  }

  async findAllReplies(
    pageOptionsDto: GetAllRepliesDto,
    user: User
  ): Promise<any> {
    this._logger.trace(`[CommentService] findAllReplies start`);

    // 부모댓글, 게시글 검증
    const comment = await this._commentRepository.findById(
      pageOptionsDto.parentId
    );
    if (!comment) throw new NotFoundException("not exists comment");

    const isValidPost = this._postService.isValid(comment.postId);
    if (!isValidPost) throw new NotFoundException("not exists post");

    // 대댓글 조회
    const [replyArray, totalCount] =
      await this._commentRepository.findAllReplies(pageOptionsDto);

    // 다음 대댓글 페이지 있는지 확인
    let nextId = null;
    if (replyArray.length === pageOptionsDto.maxResults + 1) {
      nextId = replyArray[replyArray.length - 1].id;
      replyArray.pop();
    }

    // 응답 DTO로 변환후 리턴
    const pageInfoDto = new PageInfiniteScrollInfoDto(
      totalCount,
      replyArray.length,
      nextId
    );

    return new PageResponseDto(
      pageInfoDto,
      replyArray.map((e) => new ReplyResponseDto(e, user))
    );
  }

  async update(user: User, id: number, content: string) {
    const comment = await this._commentRepository.findById(id);

    //err: 존재하지 않거나 삭제된 댓글
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    //err: 존재하지 않거나 삭제된 게시글
    const isValidPost = await this._postService.isValid(comment.postId);
    if (!isValidPost) throw new NotFoundException("not exists post");

    // err: 권한 없음
    if (comment.userId !== user.id)
      throw new ForbiddenException("authorization error");

    const updatedComment = await this._commentRepository.update(id, {
      content,
    });
    return new CommentResponseDto(updatedComment, user);
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
