import { plainToInstance } from "class-transformer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../shared/utils/logger.util";
import { PostCreateResponseDto } from "./dto/all-response.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  private _toPostCreateResponseDto(post: Post) {
    // TODO: 게시글 등록시 리턴 타입 id만 반환해도 되는지?
    return plainToInstance(PostCreateResponseDto, { id: post.id });
  }
  public async create(
    categoryId: number,
    isSecret: boolean,
    title: string,
    content: string,
    mbti: string,
    nickname: string
  ): Promise<PostCreateResponseDto> {
    this._logger.trace(`[PostService] create start`);
    // TODO: user.status 체크 해야하는지 ?

    // mbti check (임의로 mbti 게시판은 1로 지정)
    if (categoryId === 1) {
      // TODO: category === 'mbti' 내부적으로 16가지로 나뉘어지는데,
      // 유저와 mbti 비교를 위해 우째할까?
    }

    const postEntity = await this._postRepository.createEntity(
      categoryId,
      isSecret,
      title,
      content,
      mbti,
      nickname
    );
    const createdPost = await this._postRepository.create(postEntity);
    return this._toPostCreateResponseDto(createdPost);
  }
}