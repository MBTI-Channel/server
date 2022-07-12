import { plainToInstance } from "class-transformer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import {
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { ICategoryRepository } from "../category/interfaces/ICategory.repository";
import { User } from "../user/entity/user.entity";
import { IUserRepository } from "../user/interfaces/IUser.repository";
import { PostCreateResponseDto } from "./dto/all-response.dto";
import { SearchDetailResponseDto } from "./dto/search-detail-response.dto";
import { SearchDetailPostDto } from "./dto/search-detail-post.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepository: ICategoryRepository,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  private _toPostCreateResponseDto(post: Post) {
    // TODO: 게시글 등록시 리턴 타입 id만 반환해도 되는지?
    return plainToInstance(PostCreateResponseDto, { id: post.id });
  }

  private _toPostDetailResponseDto(
    post: Post,
    isActiveUser: boolean,
    isMy: boolean
  ) {
    return plainToInstance(SearchDetailPostDto, {
      ...post,
      isActiveUser,
      isMy,
    });
  }

  public async create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryId: number,
    user: User
  ): Promise<PostCreateResponseDto> {
    this._logger.trace(`[PostService] create start`);
    const category = await this._categoryRepository.findOneById(categoryId);

    if (!category || !category.isActive) {
      throw new NotFoundException("category id error");
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

  public async increaseCommentCount(id: number): Promise<void> {
    this._logger.trace(`[PostService] increaseCommentCount start`);
    this._logger.trace(`[PostService] check exists post id: ${id}`);
    const post = await this._postRepository.findOneById(id);
    // err: 존재하지 않는 || 삭제된 게시글 id
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    this._logger.trace(`[PostService] try post id ${id} comment count + 1...`);
    const hasIncreased = await this._postRepository.increaseCommentCount(id);
    this._logger.trace(`[PostService] check comment count has increased`);
    // err: 업데이트 도중 삭제된 게시글 id
    if (!hasIncreased) throw new NotFoundException(`not exists post`);
    this._logger.trace(`[PostService] clear`);
  }

  public async delete(user: User, id: number): Promise<void> {
    this._logger.trace(`[PostService] delete start`);
    const post = await this._postRepository.findOneById(id);

    this._logger.trace(`[PostService] check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    if (post.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._logger.trace(`[PostService] remove post ${id}`);
    await this._postRepository.remove(id);
  }

  public async searchDetail(
    user: User,
    id: number
  ): Promise<SearchDetailPostDto> {
    this._logger.trace(`[PostService] searchDetail start`);
    const post = await this._postRepository.findOneById(id);

    this._logger.trace(`[PostService] check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    // 타입이 mbti 일 경우
    if (post.type === 2) {
      if (user.mbti !== post.userMbti)
        throw new ForbiddenException("authorization error");
    }

    let isActiveUser = false;
    let isMy = false;

    // 게시글 작성자의 활성화 여부를 확인
    const postUser = plainToInstance(
      User,
      await this._userRepository.findOneStatus(post.userId)
    );
    if (postUser && postUser.status === 2) isActiveUser = true;

    // 본인 게시판이 맞는지 확인
    if (user.id === post.userId) isMy = true;

    return this._toPostDetailResponseDto(post, isActiveUser, isMy);
  }
}
