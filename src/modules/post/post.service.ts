import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { CategoryName } from "../../shared/enum.shared";
import {
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { PageResponseDto, PageInfiniteScrollInfoDto } from "../../shared/page";
import { Logger } from "../../shared/utils/logger.util";
import { ICategoryRepository } from "../category/interfaces/ICategory.repository";
import { User } from "../user/entity/user.entity";
import { GetAllPostDto } from "./dto/get-all-post.dto";
import { PostResponseDto } from "./dto/post-response.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepository: ICategoryRepository,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  public async create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryId: number,
    user: User
  ): Promise<PostResponseDto> {
    this._logger.trace(`[PostService] create start`);
    const category = await this._categoryRepository.findOneById(categoryId);

    if (!category || !category.isActive) {
      throw new NotFoundException("category id error");
    }

    let postType = Post.typeTo("post");
    if (category.name === "mbti") {
      postType = Post.typeTo("mbti");
    }

    const postEntity = Post.of(user, category, isSecret, title, content);
    const createdPost = await this._postRepository.create(postEntity);
    return new PostResponseDto(createdPost, user);
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

  public async getDetail(user: User, id: number): Promise<PostResponseDto> {
    this._logger.trace(`[PostService] getDetail start`);
    const post = await this._postRepository.findOneById(id);

    this._logger.trace(`[PostService] check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    // 타입이 mbti 일 경우
    if (Post.typeFrom(post.type) === "mbti") {
      if (user.mbti !== post.userMbti)
        throw new ForbiddenException("authorization error");
    }

    return new PostResponseDto(post, user);
  }

  public async isValid(id: number): Promise<boolean> {
    this._logger.trace(`[PostService] is valid post id ? ${id}`);
    const post = await this._postRepository.findOneById(id);
    if (!post || !post.isActive) return false;
    return true;
  }

  public async getAll(
    user: User,
    pageOptionsDto: GetAllPostDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>> {
    this._logger.trace(`[PostService] getAll start`);
    this._logger.trace(
      `[PostService] check category name ${pageOptionsDto.category}`
    );

    const category = await this._categoryRepository.findOneByName(
      pageOptionsDto.category
    );
    if (!category || !category.isActive) {
      throw new NotFoundException("not exists category");
    }
    let postArray, totalCount;

    if (!user && pageOptionsDto.category === CategoryName.MBTI) {
      throw new ForbiddenException("not authorizatie");
    }

    if (pageOptionsDto.category === CategoryName.MBTI) {
      [postArray, totalCount] = await this._postRepository.findAllPostsWithMbti(
        pageOptionsDto,
        category.id,
        user.mbti
      );
    } else {
      [postArray, totalCount] = await this._postRepository.findAllPosts(
        pageOptionsDto,
        category.id
      );
    }

    // 페이지 정보
    let nextId = pageOptionsDto.startId + postArray.length + 1;

    const pageInfoDto = new PageInfiniteScrollInfoDto(
      totalCount, // 결과에 맞는 개수
      pageOptionsDto.maxResults, //
      nextId
    );

    return new PageResponseDto(
      pageInfoDto,
      postArray.map((e) => new PostResponseDto(e, user))
    );
  }
}
