import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../../core/type.core";
import { ICommentService } from "./interfaces/IComment.service";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { Comment } from "./entity/comment.entity";
import { User } from "../user/entity/user.entity";
import { NotFoundException } from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { CommentResponseDto } from "./dto/all-response.dto";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository
  ) {}

  private _toCommentResponseDto(comment: Comment) {
    return plainToInstance(CommentResponseDto, { id: comment.id });
  }

  async createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<any> {
    const post = await this._postRepository.findOneById(postId);

    // err: 존재하지않는 || 삭제된 post
    if (!post || post.isDisabled === true)
      throw new NotFoundException(`not exists post`);

    const commentEntity = new Comment();
    commentEntity.post = post;
    commentEntity.user = user;
    commentEntity.userNickname = user.nickname;
    commentEntity.userMbti = user.mbti;
    commentEntity.content = content;
    commentEntity.isSecret = isSecret;

    const comment = await this._commentRepository.createComment(commentEntity);

    return this._toCommentResponseDto(comment);
  }
}
