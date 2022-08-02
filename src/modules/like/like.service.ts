import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { LikeTargetType } from "../../shared/enum.shared";
import {
  BadReqeustException,
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { HttpException } from "../../shared/errors/http.exception";
import { Logger } from "../../shared/utils/logger.util";
import { ICommentRepository } from "../comment/interfaces/IComment.repository";
import { ICommentService } from "../comment/interfaces/IComment.service";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { IPostService } from "../post/interfaces/IPost.service";
import { User } from "../user/entity/user.entity";
import { LikeResponseDto } from "./dto/like-response.dto";
import { Like } from "./entity/like.entity";
import { ILikeRepository } from "./interfaces/ILike.repository";
import { ILikeService } from "./interfaces/ILike.service";
import { Post } from "../post/entity/post.entity";
import { Comment } from "../comment/entity/comment.entity";
import { INotificationService } from "../notifications/interfaces/INotification.service";
import e from "express";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IPostService) private readonly _postService: IPostService,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ICommentService)
    private readonly _commentService: ICommentService,
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.ILikeRepository)
    private readonly _likeRepository: ILikeRepository,
    @inject(TYPES.IDatabaseService)
    private readonly _dbService: IDatabaseService
  ) {}

  private async _checkMbti(target: Post | Comment, user: User, type: string) {
    let aver_target;
    if (type === LikeTargetType.POST) {
      aver_target = target as Post;
      if (
        aver_target.type === Post.typeTo("mbti") &&
        user.mbti !== aver_target.userMbti
      )
        throw new ForbiddenException("authorization error");
    }

    if (type === LikeTargetType.COMMENT) {
      aver_target = target as Comment;
      const post = await this._postRepository.findOneById(aver_target.postId);
      if (!post || !post.isActive)
        throw new NotFoundException(`not exists target`);
      if (post.type === Post.typeTo("mbti") && user.mbti !== post?.userMbti)
        throw new ForbiddenException("authorization error");
    }
  }

  private async _checkId(type: string, targetId: number) {
    let target;

    if (type === LikeTargetType.POST)
      target = await this._postRepository.findOneById(targetId);
    if (type === LikeTargetType.COMMENT)
      target = await this._commentRepository.findOneById(targetId);

    if (!target || !target.isActive)
      throw new NotFoundException(`not exists target`);

    return target;
  }

  public async createLike(
    type: string,
    targetId: number,
    user: User
  ): Promise<LikeResponseDto> {
    this._logger.trace(`[LikeService] createLike start`);

    // targetId 존재하는지 확인
    let target = await this._checkId(type, targetId);

    // mbti 게시글일 경우 mbti 확인
    await this._checkMbti(target, user, type);

    // post: 1 , comment: 2
    const targetType = type === LikeTargetType.POST ? 1 : 2;

    // 이미 좋아요 되어 있는지 확인
    let like = await this._likeRepository.findOneByTarget(
      user.id,
      targetId,
      targetType
    );
    if (like && like.isActive) {
      throw new BadReqeustException(`like already existed`);
    }

    // 좋아요를 처음 누른 경우 좋아요 생성
    if (!like) {
      const likeEntity = Like.of(target, user, targetType);
      like = await this._likeRepository.createLike(likeEntity);
    } else {
      like = await this._likeRepository.active(like.id);
    }

    const t = await this._dbService.getTransaction();
    await t.startTransaction();
    try {
      if (type === LikeTargetType.POST)
        await this._postService.increaseLikeCount(targetId);

      if (type === LikeTargetType.COMMENT)
        await this._commentService.increaseLikeCount(targetId);

      if (!user.isMy(target)) {
        await this._notificationService.createByTargetUser(
          user,
          target.userId,
          target.id,
          "likes"
        );
      }
      await t.commitTransaction();
      return new LikeResponseDto(target, like);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }

  async deleteLike(type: string, targetId: number, user: User): Promise<void> {
    this._logger.trace(`[LikeService] deleteLike start`);

    // targetId 존재하는지 확인
    let target = await this._checkId(type, targetId);
    // post: 1 , comment: 2
    const targetType = type === LikeTargetType.POST ? 1 : 2;
    // 이미 좋아요 취소 되어 있는지 확인
    const like = await this._likeRepository.findOneByTarget(
      user.id,
      targetId,
      targetType
    );
    if (!like || !like.isActive) {
      throw new BadReqeustException(`like already canceld`);
    }

    // mbti 게시글일 경우 mbti 확인
    await this._checkMbti(target, user, type);

    const t = await this._dbService.getTransaction();
    await t.startTransaction();
    try {
      await this._likeRepository.remove(like.id);
      if (type === LikeTargetType.POST)
        await this._postService.decreaseLikeCount(targetId);

      if (type === LikeTargetType.COMMENT)
        await this._commentService.decreaseLikeCount(targetId);
      await t.commitTransaction();
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }
}
