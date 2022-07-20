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
  BadReqeustException,
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { GetAllCommentDto, CommentResponseDto, ReplyResponseDto } from "./dto";
import { Logger } from "../../shared/utils/logger.util";
import { HttpException } from "../../shared/errors/http.exception";
import { PageResponseDto, PageInfoDto } from "../../shared/page";

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
    // 게시글 검증
    const post = await this._postRepository.findOneById(postId);
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

  async createReply(
    user: User,
    postId: number,
    parentId: number,
    taggedId: number,
    content: string,
    isSecret: boolean
  ): Promise<ReplyResponseDto> {
    // 게시글 댓글이 존재하는지, 삭제 되지 않았는지 확인
    const post = await this._postRepository.findOneById(postId);
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);
    const parentComment = await this._commentRepository.findById(parentId);
    if (!parentComment || !parentComment.isActive)
      throw new NotFoundException(`not exists comment`);
    // 부모댓글이 부모댓글이 맞는지 확인
    if (parentComment.parentId)
      throw new BadReqeustException(
        `replies cannot be written to a reply with a parent id`
      );

    //태그된 댓글 검증
    if (taggedId) {
      const taggedReply = await this._commentRepository.findById(taggedId);
      if (!taggedReply || !taggedReply.isActive)
        throw new NotFoundException(`not exists comment`);
      //태그된 댓글이 같은 댓글군에 포함되는지 확인
      if (taggedReply.parentId !== parentId)
        throw new BadReqeustException(
          `tagged comments must be in the same comment group`
        );
    }

    const replyEntity = Comment.replyOf(
      post,
      user,
      content,
      isSecret,
      parentId,
      taggedId
    );

    const t = await this._dbService.getTransaction();
    await t.startTransaction();
    try {
      // TODO: 알림
      const reply = await this._commentRepository.createComment(replyEntity);
      await this._commentRepository.increaseReplyCount(parentId);
      await this._postService.increaseCommentCount(post.id);
      await t.commitTransaction();
      return new ReplyResponseDto(reply, user);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }

  async findAllComments(pageOptionsDto: GetAllCommentDto, user: User) {
    this._logger.trace(`[CommentService] findAllComments start`);

    // 게시글 검증
    const isValidPost = this._postService.isValid(pageOptionsDto.postId);
    if (!isValidPost) throw new NotFoundException("not exists post");

    const [commentArray, totalCount] =
      await this._commentRepository.findAllComments(pageOptionsDto);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      commentArray.length,
      pageOptionsDto.page
    );

    return new PageResponseDto(
      pageInfoDto,
      commentArray.map((e) => new CommentResponseDto(e, user))
    );
  }

  async update(user: User, id: number, content: string) {
    // 댓글 검증
    const comment = await this._commentRepository.findById(id);
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    // 게시글 검증
    const isValidPost = await this._postService.isValid(comment.postId);
    if (!isValidPost) throw new NotFoundException("not exists post");

    // 권한 확인 
    if (comment.userId !== user.id)
      throw new ForbiddenException("authorization error");

    const updatedComment = await this._commentRepository.update(id, {
      content,
    });
    return new CommentResponseDto(updatedComment, user);
  }

  async delete(user: User, id: number): Promise<void> {
    this._logger.trace(`[CommentService] delete start`);
    // 댓글 검증
    const comment = await this._commentRepository.findById(id);
    this._logger.trace(`[CommentService] check exists comment id ${id}`);
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    // 권한 확인
    this._logger.trace(
      `[CommentService] check user authorization u: ${id} c: ${comment.id}`
    );
    if (comment.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._logger.trace(`[CommentService] remove comment ${id}`);
    await this._commentRepository.remove(id);
  }
}
