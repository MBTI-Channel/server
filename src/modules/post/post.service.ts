import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { TREND_LIKE, TREND_VIEW } from "../../shared/constant.shared";
import {
  CategoryName,
  FileTargetType,
  PostType,
} from "../../shared/enum.shared";
import {
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { HttpException } from "../../shared/errors/http.exception";
import {
  PageResponseDto,
  PageInfiniteScrollInfoDto,
  PageInfoDto,
} from "../../shared/page";
import { Logger } from "../../shared/utils/logger.util";
import { Category } from "../category/entity/category.entity";
import { ICategoryRepository } from "../category/interfaces/ICategory.repository";
import { IFileService } from "../file/interfaces/IFile.service";
import { INotificationService } from "../notifications/interfaces/INotification.service";
import { User } from "../user/entity/user.entity";
import {
  GetAllPostDto,
  GetMyPostsDto,
  PostResponseDto,
  SearchPostDto,
  GetTrendDto,
} from "./dto";
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
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IDatabaseService)
    private readonly _dbService: IDatabaseService,
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService,
    @inject(TYPES.IFileService)
    private readonly _fileService: IFileService
  ) {}

  private _log(message: string) {
    this._logger.trace(`[PostService] ${message}`);
  }

  public async create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryName: CategoryName,
    filesUrl: string[],
    user: User
  ): Promise<PostResponseDto> {
    this._log(`create start`);

    const category = await this._categoryRepository.findOneByName(categoryName);

    if (!category || !category.isActive) {
      throw new NotFoundException("category name error");
    }

    let postType = PostType.POST;
    if (category.name === CategoryName.MBTI) {
      postType = PostType.MBTI;
    }
    const postEntity = Post.of(
      user,
      category,
      isSecret,
      filesUrl ? filesUrl[0] : null,
      title,
      content,
      postType
    );

    const createdPost = await this._postRepository.create(postEntity);
    // file 테이블에 이미지 저장
    await this._fileService.create(
      FileTargetType.POST,
      createdPost.id,
      filesUrl
    );

    return new PostResponseDto(createdPost, user);
  }

  public async increaseReportCount(id: number): Promise<void> {
    this._log(`increaseReportCount start`);
    // 댓글이 존재하는지 확인
    const post = await this._postRepository.findOneById(id);
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    // 댓글 신고 수 증가. 만약 도중에 삭제되었다면 false 반환
    const hasIncreased = await this._postRepository.increaseReportCount(id);
    if (!hasIncreased) throw new NotFoundException(`not exists post`);
  }

  public async increaseCommentCount(id: number): Promise<void> {
    this._log(`increaseCommentCount start`);
    this._log(`check exists post id: ${id}`);
    const post = await this._postRepository.findOneById(id);
    // err: 존재하지 않는 || 삭제된 게시글 id
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    this._log(`try post id ${id} comment count + 1...`);
    const hasIncreased = await this._postRepository.increaseCommentCount(id);
    this._log(`check comment count has increased`);
    // err: 업데이트 도중 삭제된 게시글 id
    if (!hasIncreased) throw new NotFoundException(`not exists post`);
    this._log(`increaseCommentCount done`);
  }

  public async increaseLikeCount(id: number): Promise<void> {
    this._log(`increaseLikeCount start`);
    const post = await this._postRepository.findOneById(id);
    // err: 존재하지 않는 || 삭제된 게시글 id
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    const hasIncreased = await this._postRepository.increaseLikeCount(id);
    // err: 업데이트 도중 삭제된 게시글 id
    if (!hasIncreased) throw new NotFoundException(`not exists post`);

    post.likesCount++;
    // 인기 게시글 등록을 위한 검사 진행
    if (
      post.type === PostType.POST &&
      post.likesCount >= TREND_LIKE &&
      post.viewCount >= TREND_VIEW
    ) {
      const t = await this._dbService.getTransaction();
      await t.startTransaction();
      try {
        await this._postRepository.update(id, {
          isTrend: true,
        });
        await this._notificationService.createByTargetUser(
          post.user,
          post.userId,
          post.id,
          "trend"
        );
        await t.commitTransaction();
      } catch (err: any) {
        await t.rollbackTransaction();
        throw new HttpException(err.name, err.message, err.status);
      } finally {
        await t.release();
      }
    }
  }

  public async decreaseLikeCount(id: number): Promise<void> {
    this._log(`decreaseLikeCount start`);
    const post = await this._postRepository.findOneById(id);
    // err: 존재하지 않는 || 삭제된 게시글 id
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    const hasDecreased = await this._postRepository.decreaseLikeCount(id);
    // err: 업데이트 도중 삭제된 게시글 id
    if (!hasDecreased) throw new NotFoundException(`not exists post`);
  }

  public async delete(user: User, id: number): Promise<void> {
    this._log(`delete start`);
    const post = await this._postRepository.findOneById(id);

    this._log(`check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    if (post.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._log(`remove post id ${id}`);
    await this._postRepository.remove(id);
  }

  public async getDetail(user: User, id: number): Promise<PostResponseDto> {
    this._log(`getDetail start`);
    const post = await this._postRepository.findOneById(id);

    this._log(`check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    // 타입이 mbti 일 경우
    if (post.type === PostType.MBTI) {
      if (user.mbti !== post.userMbti)
        throw new ForbiddenException("authorization error");
    }

    const hasIncreased = await this._postRepository.increaseViewCount(id);
    // err: 업데이트 도중 삭제된 게시글 id
    if (!hasIncreased) throw new NotFoundException(`not exists post`);
    post.viewCount++;
    // 인기 게시글 등록을 위한 검사 진행
    if (
      post.type === PostType.POST &&
      post.likesCount >= TREND_LIKE &&
      post.viewCount >= TREND_VIEW
    ) {
      const t = await this._dbService.getTransaction();
      await t.startTransaction();
      try {
        await this._postRepository.update(id, {
          isTrend: true,
        });
        await this._notificationService.createByTargetUser(
          post.user,
          post.userId,
          post.id,
          "trend"
        );
        await t.commitTransaction();
      } catch (err: any) {
        await t.rollbackTransaction();
        throw new HttpException(err.name, err.message, err.status);
      } finally {
        await t.release();
      }
    }

    return new PostResponseDto(post, user);
  }

  public async isValid(id: number): Promise<boolean> {
    this._log(`is valid post id ? ${id}`);
    const post = await this._postRepository.findOneById(id);
    if (!post || !post.isActive) return false;
    return true;
  }

  // 내가 작성한 게시글 조회
  public async getMyPosts(user: User, pageOptionsDto: GetMyPostsDto) {
    const { id } = user;
    const { page, maxResults } = pageOptionsDto;
    const [myPostArray, totalCount] =
      await this._postRepository.findAllByUserId(pageOptionsDto, id);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      myPostArray.length,
      page,
      maxResults
    );

    return new PageResponseDto(
      pageInfoDto,
      myPostArray.map((e) => new PostResponseDto(e, user))
    );
  }

  public async getTrends(
    user: User,
    pageOptionsDto: GetTrendDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>> {
    this._log(`getTrends start`);

    let postArray;
    postArray = await this._postRepository.findAllTrends(pageOptionsDto);

    if (postArray.length === 0) {
      throw new NotFoundException(`post not found`);
    }

    let nextId: number | null;
    if (postArray.length < pageOptionsDto.maxResults) {
      nextId = null;
    } else {
      // 배열 마지막 id를 nextId에 할당
      nextId = postArray[postArray.length - 1].id;
    }

    const pageInfoDto = new PageInfiniteScrollInfoDto(postArray.length, nextId);

    return new PageResponseDto(
      pageInfoDto,
      postArray.map((e) => new PostResponseDto(e, user))
    );
  }

  public async getAll(
    user: User,
    pageOptionsDto: GetAllPostDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>> {
    this._log(`getAll start`);
    this._log(`check category name ${pageOptionsDto.category}`);

    // startId에 대한 처리 필요 (1 이하일 경우, 처리)

    const category = await this._categoryRepository.findOneByName(
      pageOptionsDto.category
    );
    if (!category || !category.isActive) {
      throw new NotFoundException("not exists category");
    }
    let postArray;

    if (!user && pageOptionsDto.category === CategoryName.MBTI) {
      throw new ForbiddenException("not authorizatie");
    }

    if (pageOptionsDto.category === CategoryName.MBTI) {
      postArray = await this._postRepository.findAllPostsWithMbti(
        pageOptionsDto,
        category.id,
        user.mbti
      );
    } else {
      postArray = await this._postRepository.findAllPosts(
        pageOptionsDto,
        category.id
      );
    }

    if (postArray.length === 0) {
      throw new NotFoundException(`post not found`);
    }

    let nextId: number | null;
    if (postArray.length < pageOptionsDto.maxResults) {
      nextId = null;
    } else {
      // 배열 마지막 id를 nextId에 할당
      nextId = postArray[postArray.length - 1].id;
    }

    const pageInfoDto = new PageInfiniteScrollInfoDto(postArray.length, nextId);

    return new PageResponseDto(
      pageInfoDto,
      postArray.map((e) => new PostResponseDto(e, user))
    );
  }

  public async update(
    user: User,
    id: number,
    title: string,
    content: string,
    isSecret: boolean
  ): Promise<PostResponseDto> {
    this._log(`update start`);
    const post = await this._postRepository.findOneById(id);

    this._log(`check exists post id ${id}`);
    if (!post || !post.isActive) throw new NotFoundException("not exists post");

    // 권환 확인
    if (post.userId !== user.id)
      throw new ForbiddenException("authorization error");

    const updatedPost = await this._postRepository.update(id, {
      title,
      content,
      isSecret,
    });

    return new PostResponseDto(updatedPost, user);
  }

  public async search(
    user: User,
    pageOptionsDto: SearchPostDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>> {
    this._log(`search start`);

    let postArray: Post[] = [];

    // 카테고리를 지정하지 않은 경우
    if (!pageOptionsDto.category) {
      // 로그인 하지 않은 경우 (mbti카테고리 제외 전체 검색)
      if (!user) {
        postArray = await this._postRepository.searchAllWithoutMbtiCategory(
          pageOptionsDto
        );
      }
      // 로그인 한 경우 (본인의 mbti 게시판 포함 전체 검색)
      else {
        postArray = await this._postRepository.searchAllWithMbti(
          pageOptionsDto,
          user.mbti
        );
      }
    }
    // 카테고리를 지정한 경우
    else {
      // 카테고리가 mbti가 아닌 경우
      if (pageOptionsDto.category !== CategoryName.MBTI) {
        postArray = await this._postRepository.searchInCategory(
          pageOptionsDto,
          Category.typeTo(pageOptionsDto.category)
        );
      }
      // 카테고리가 mbti인 경우
      else {
        // 로그인 하지 않은 경우
        if (!user) {
          throw new ForbiddenException("not authorizatie");
        }
        // 로그인 한 경우
        else {
          postArray = await this._postRepository.searchInMbtiCategory(
            pageOptionsDto,
            user.mbti
          );
        }
      }
    }

    if (postArray.length === 0) {
      throw new NotFoundException(`post not found`);
    }

    let nextId: number | null;
    if (postArray.length < pageOptionsDto.maxResults) {
      nextId = null;
    } else {
      // 배열 마지막 id를 nextId에 할당
      nextId = postArray[postArray.length - 1].id;
    }

    const pageInfoDto = new PageInfiniteScrollInfoDto(postArray.length, nextId);

    return new PageResponseDto(
      pageInfoDto,
      postArray.map((e) => new PostResponseDto(e, user))
    );
  }
}
