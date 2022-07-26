import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { LikeTargetType } from "../../shared/enum.shared";
import {
  BadReqeustException,
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

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IPostService) private readonly _postService: IPostService,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ICommentService)
    private readonly _commentService: ICommentService,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.ILikeRepository)
    private readonly _likeRepository: ILikeRepository,
    @inject(TYPES.IDatabaseService)
    private readonly _dbService: IDatabaseService
  ) {}
  async createLike(
    type: string,
    targetId: number,
    user: User
  ): Promise<LikeResponseDto> {
    this._logger.trace(`[LikeService] createLike start`);

    // targetId 존재 여부
    let target;
    if (type === LikeTargetType.POST) {
      target = await this._postRepository.findOneById(targetId);
    } else if (type === LikeTargetType.COMMENT) {
      target = await this._commentRepository.findById(targetId);
    }
    if (!target || !target.isActive)
      throw new NotFoundException(`not exists target`);

    // post: 1 , comment: 2
    const targetType = type === LikeTargetType.POST ? 1 : 2;

    // 이미 좋아요 되어 있는지 확인
    const foundLike = await this._likeRepository.findOneByTarget(
      targetId,
      targetType
    );
    if (foundLike && foundLike.isActive) {
      throw new BadReqeustException(`like already existed`);
    }

    // TODO: MBTI check
    // if (type === LikeTargetType.POST) {
    //   if (target.type === Post.typeTo("mbti") && user.mbti !== target.userMbti)
    //     throw new ForbiddenException("authorization error");
    // } else if (type === LikeTargetType.COMMENT){
    //   const post = await this._postRepository.findOneById(target.postId);
    //   if (post.type === Post.typeTo("mbti") && user.mbti !== post.userMbti)
    //     throw new ForbiddenException("authorization error")
    // }

    const likeEntity = Like.of(target, user, targetType);

    const t = await this._dbService.getTransaction();
    await t.startTransaction();
    try {
      const like = await this._likeRepository.createLike(likeEntity);
      if (type === LikeTargetType.POST) {
        await this._postService.increaseLikeCount(targetId);
      } else if (type === LikeTargetType.COMMENT) {
        await this._commentService.increaseLikeCount(targetId);
      }
      // TODO: notification check
      await t.commitTransaction();
      return new LikeResponseDto(target, like);
    } catch (err: any) {
      await t.rollbackTransaction();
      throw new HttpException(err.name, err.message, err.status);
    } finally {
      await t.release();
    }
  }
}
