import { plainToInstance } from "class-transformer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { NotFoundException } from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { Category } from "../category/entity/category.entity";
import { ICategoryService } from "../category/interfaces/ICategory.service";
import { User } from "../user/entity/user.entity";
import { PostCreateResponseDto } from "./dto/all-response.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ICategoryService)
    private readonly _categoryService: ICategoryService,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  private _toPostCreateResponseDto(post: Post) {
    // TODO: 게시글 등록시 리턴 타입 id만 반환해도 되는지?
    return plainToInstance(PostCreateResponseDto, { id: post.id });
  }
  public async create(
    isSecret: boolean,
    title: string,
    content: string,
    category: Category,
    user: User
  ): Promise<PostCreateResponseDto> {
    this._logger.trace(`[PostService] create start`);

    if (!(await this._categoryService.findOneById(category.id))) {
      throw new NotFoundException("not exists categoryId");
    }

    // TODO: 나만의 mbti 게시판일 경우, 사용자 mbti 확인
    const { mbti, nickname } = user;
    const postEntity = await this._postRepository.createEntity(
      isSecret,
      title,
      content,
      mbti,
      nickname,
      category,
      user
    );
    const createdPost = await this._postRepository.create(postEntity);
    return this._toPostCreateResponseDto(createdPost);
  }
}
