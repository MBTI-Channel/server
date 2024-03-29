import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { ICommentService } from "./interfaces/IComment.service";
import { IPostService } from "../post/interfaces/IPost.service";
import { INotificationService } from "../notifications/interfaces/INotification.service";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { Comment } from "./entity/comment.entity";
import { User } from "../user/entity/user.entity";
import {
  BadReqeustException,
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import {
  GetAllCommentDto,
  GetAllRepliesDto,
  GetAllByUserDto,
  CommentResponseDto,
  ReplyResponseDto,
  UserCommentResponseDto,
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

  private _log(message: string) {
    this._logger.trace(`[CommentService] ${message}`);
  }

  public async createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto> {
    // 댓글 작성할 게시글 존재하는지 확인
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

  public async createReply(
    user: User,
    postId: number,
    parentId: number,
    taggedId: number,
    content: string,
    isSecret: boolean
  ): Promise<ReplyResponseDto> {
    let replyTarget: Comment | null;

    // 대댓글 작성할 게시글이 존재하는지 확인
    const post = await this._postRepository.findOneById(postId);
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    // parentId === taggedId라면 부모 댓글에 대한 대댓글 작성이다.
    if (parentId === taggedId) {
      replyTarget = await this._commentRepository.findOneById(parentId);
      if (!replyTarget || !replyTarget.isActive)
        throw new NotFoundException(`not exists comment`);
      if (replyTarget.isReply())
        throw new BadReqeustException(`invalid parent comment id`);
    }
    // parentId !== taggedId라면 대댓글에 대한 대댓글 작성이다.
    else {
      replyTarget = await this._commentRepository.findOneById(taggedId);
      if (!replyTarget || !replyTarget.isActive)
        throw new NotFoundException(`not exists reply`);
      // 대댓글이 같은 댓글군에 포함되는지 확인
      if (replyTarget.parentId !== parentId)
        throw new BadReqeustException(
          `tagged reply must be in the same comment group`
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
      const reply = await this._commentRepository.createComment(replyEntity);
      await this._commentRepository.increaseReplyCount(parentId);
      await this._postService.increaseCommentCount(post.id);
      // 대댓글 작성자의 게시글이 아니라면, 게시글 작성자에게 알림을 생성한다.
      if (!user.isMy(post))
        await this._notificationService.createByTargetUser(
          user,
          post.userId,
          reply.id,
          "comment"
        );
      // 대댓글 작성자의 (대)댓글이 아니라면, (대)댓글 작성자에게 알림 생성한다.
      if (!user.isMy(replyTarget))
        await this._notificationService.createByTargetUser(
          user,
          replyTarget.userId,
          reply.id,
          "reply"
        );
      await t.commitTransaction();
      return new ReplyResponseDto(reply, user);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }

  public async getAllComments(pageOptionsDto: GetAllCommentDto, user: User) {
    this._log(`findAllComments start`);
    const { postId, maxResults, page } = pageOptionsDto;
    // 댓글을 조회할 게시글이 존재하는지 확인
    const foundPost = await this._postRepository.findOneById(postId);
    if (!foundPost || !foundPost.isActive)
      throw new NotFoundException("not exists post");

    const [commentArray, totalCount] =
      await this._commentRepository.findAllComments(pageOptionsDto);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      commentArray.length,
      page,
      maxResults
    );

    return new PageResponseDto(
      pageInfoDto,
      commentArray.map((e) => new CommentResponseDto(e, user))
    );
  }

  public async getAllReplies(pageOptionsDto: GetAllRepliesDto, user: User) {
    this._log(`findAllReplies start`);

    // 부모댓글이 존재하는지 확인
    const comment = await this._commentRepository.findOneById(
      pageOptionsDto.parentId
    );
    if (!comment) throw new NotFoundException("not exists comment");

    // 게시글이 존재하는지 확인
    const isValidPost = this._postService.isValid(comment.postId);
    if (!isValidPost) throw new NotFoundException("not exists post");

    // 대댓글 조회
    const replyArray = await this._commentRepository.findAllReplies(
      pageOptionsDto
    );
    // 아무런 대댓글 없으면 NotFoundException
    if (replyArray.length === 0)
      throw new NotFoundException(
        `there are no replies to parent comment id ${pageOptionsDto.parentId}`
      );

    // replyArray길이가 maxResults보다 작다면 nextId는 null, 아니라면 마지막 idx의 id 할당
    let nextId: number | null;
    if (replyArray.length < pageOptionsDto.maxResults) nextId = null;
    else nextId = replyArray[replyArray.length - 1].id;

    // 응답 DTO로 변환후 리턴
    const pageInfoDto = new PageInfiniteScrollInfoDto(
      replyArray.length,
      nextId
    );

    return new PageResponseDto(
      pageInfoDto,
      replyArray.map((e) => new ReplyResponseDto(e, user))
    );
  }

  public async getAllByUser(
    user: User,
    pageOptionsDto: GetAllByUserDto
  ): Promise<PageResponseDto<PageInfoDto, UserCommentResponseDto>> {
    const { id: userId } = user;
    const { page, maxResults } = pageOptionsDto;

    const [commentArray, totalCount] =
      await this._commentRepository.findAllByUser(pageOptionsDto, userId);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      commentArray.length,
      page,
      maxResults
    );

    return new PageResponseDto(
      pageInfoDto,
      commentArray.map((e) => new UserCommentResponseDto(e, user))
    );
  }

  public async increaseReportCount(id: number): Promise<void> {
    this._log(`increaseReportCount start`);
    // 댓글이 존재하는지 확인
    const comment = await this._commentRepository.findOneById(id);
    if (!comment || !comment.isActive)
      throw new NotFoundException(`not exists comment`);

    // 댓글 신고 수 증가. 만약 도중에 삭제되었다면 false 반환
    const hasIncreased = await this._commentRepository.increaseReportCount(id);
    if (!hasIncreased) throw new NotFoundException(`not exists comment`);
  }

  public async increaseLikeCount(id: number): Promise<void> {
    this._log(`increaseLikeCount start`);
    // 댓글이 존재하는지 확인
    const comment = await this._commentRepository.findOneById(id);
    if (!comment || !comment.isActive)
      throw new NotFoundException(`not exists comment`);

    // 댓글 좋아요 수 증가. 만약 도중에 삭제되었다면 false 반환
    const hasIncreased = await this._commentRepository.increaseLikeCount(id);
    if (!hasIncreased) throw new NotFoundException(`not exists comment`);
  }

  public async decreaseLikeCount(id: number): Promise<void> {
    this._log(`decreaseLikeCount start`);

    // 댓글이 존재하는지 확인
    const comment = await this._commentRepository.findOneById(id);
    if (!comment || !comment.isActive)
      throw new NotFoundException(`not exists comment`);

    // 댓글 좋아요 수 감소. 만약 도중에 삭제되었다면 false 반환
    const hasIncreased = await this._commentRepository.decreaseLikeCount(id);
    if (!hasIncreased) throw new NotFoundException(`not exists comment`);
  }

  public async update(user: User, id: number, content: string) {
    // 댓글 존재하는지 확인
    const comment = await this._commentRepository.findOneById(id);
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    // 댓글이 속한 게시글 존재하는지 확인
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

  public async remove(user: User, id: number): Promise<void> {
    this._log(`remove start`);
    // 댓글 존재하는지 확인
    const comment = await this._commentRepository.findOneById(id);
    this._logger.trace(`[CommentService] check exists comment id ${id}`);
    if (!comment || !comment.isActive)
      throw new NotFoundException("not exists comment");

    // 권한 확인
    this._log(`check user authorization u: ${id} c: ${comment.id}`);
    if (comment.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._log(`remove comment ${id}`);
    await this._commentRepository.remove(id);
  }

  public async isValid(id: number): Promise<boolean> {
    this._log(`is valid comment id ? ${id}`);
    const comment = await this._commentRepository.findOneById(id);
    if (!comment || !comment.isActive) return false;
    return true;
  }
}
