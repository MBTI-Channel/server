import { inject, injectable } from "inversify";
import { In, LessThan, Like, Not } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { Category } from "../category/entity/category.entity";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import {
  GetMyPostsDto,
  GetTrendDto,
  GetAllPostDto,
  SearchPostDto,
} from "./dto";
import { SearchOption } from "../../shared/enum.shared";
import { CategoryName } from "aws-sdk/clients/support";

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  private _searchOption(
    whereCondition: any,
    option: SearchOption,
    searchWord: string
  ) {
    switch (option) {
      case SearchOption.TITLE:
        return { ...whereCondition, title: Like(`%${searchWord}%`) };
      case SearchOption.CONTENT:
        return { ...whereCondition, content: Like(`%${searchWord}%`) };
      case SearchOption.ALL:
        return [
          { ...whereCondition, title: Like(`%${searchWord}%`) },
          { ...whereCondition, content: Like(`%${searchWord}%`) },
        ];
    }
  }

  public async create(postEntity: Post) {
    const repository = await this._database.getRepository(Post);
    const post = await repository.save(postEntity);
    return post;
  }

  public async findOneById(id: number): Promise<Post | null> {
    const repository = await this._database.getRepository(Post);
    const post = await repository.findOne({ where: { id } });
    return post;
  }

  public async increaseReportCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.increment({ id }, "reportCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async increaseCommentCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.increment({ id }, "commentCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async increaseLikeCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.increment({ id }, "likesCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async decreaseLikeCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.decrement({ id }, "likesCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async increaseViewCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.increment({ id }, "viewCount", 1);
    if (result.affected === 1) return true;
    return false;
  }

  public async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Post);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Post>);
  }

  public async findAllPosts(
    pageOptionsDto: GetAllPostDto,
    categoryId: number
  ): Promise<Post[]> {
    const { startId, maxResults } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId,
        id: LessThan(startId),
      };
    } else {
      whereCondition = { categoryId };
    }
    const repository = await this._database.getRepository(Post);
    return await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: whereCondition,
      take: maxResults,
      order: { id: "DESC" },
    });
  }

  public async findAllPostsWithMbti(
    pageOptionsDto: GetAllPostDto,
    categoryId: number,
    mbti: string
  ): Promise<Post[]> {
    const { startId, maxResults } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId,
        userMbti: mbti,
        id: LessThan(startId),
      };
    } else {
      whereCondition = { categoryId, userMbti: mbti };
    }
    const repository = await this._database.getRepository(Post);
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: whereCondition,
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // 일반 페이지네이션
  public async findAllByUserId(
    pageOptionsDto: GetMyPostsDto,
    userId: number
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    return await repository
      .createQueryBuilder("post")
      .select([
        "post.id",
        "post.categoryId",
        "post.userId",
        "post.userNickname",
        "post.userMbti",
        "post.type",
        "post.isActive",
        "post.isSecret",
        "post.title",
        "post.content",
        "post.viewCount",
        "post.commentCount",
        "post.likesCount",
        "post.createdAt",
        "post.updatedAt",
      ])
      .where("post.user_id = :userId", { userId })
      .take(pageOptionsDto.maxResults)
      .skip(pageOptionsDto.skip)
      .orderBy(`post.id`, "DESC")
      .getManyAndCount();
  }

  public async update(id: number, payload: Partial<Post>): Promise<Post> {
    const repository = await this._database.getRepository(Post);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Post>)
      .then(async () => await repository.findOne({ where: { id } }));
  }

  // 내 MBTI 게시판에서 search
  public async searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord, searchOption } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId: Category.typeTo("mbti"),
        userMbti: mbti,
        id: LessThan(startId),
      };
    } else {
      whereCondition = {
        categoryId: Category.typeTo("mbti"),
        userMbti: mbti,
      };
    }
    const repository = await this._database.getRepository(Post);
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: this._searchOption(whereCondition, searchOption, searchWord),
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // 특정 카테고리에서 검색 (mbti 카테고리 제외)
  public async searchInCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord, searchOption } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId,
        id: LessThan(startId),
      };
    } else {
      whereCondition = {
        categoryId,
      };
    }
    const repository = await this._database.getRepository(Post);
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: this._searchOption(whereCondition, searchOption, searchWord),
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // mbti 카테고리 제외 전체 검색
  public async searchAllWithoutMbtiCategory(
    pageOptionsDto: SearchPostDto
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord, searchOption } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId: Not(In([Category.typeTo("mbti")])),
        id: LessThan(startId),
      };
    } else {
      whereCondition = {
        categoryId: Not(In([Category.typeTo("mbti")])),
      };
    }
    const repository = await this._database.getRepository(Post);
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: this._searchOption(whereCondition, searchOption, searchWord),
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // 인기글 조회
  public async findAllTrends(pageOptionsDto: GetTrendDto): Promise<Post[]> {
    const { startId, maxResults } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        isTrend: true,
        id: LessThan(startId),
      };
    } else {
      whereCondition = {
        isTrend: true,
      };
    }
    const repository = await this._database.getRepository(Post);
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "isTrend",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where: whereCondition,
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // 전체 검색 (본인의 mbti게시판 포함)
  public async searchAllWithMbti(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]> {
    const repository = await this._database.getRepository(Post);
    const { startId, maxResults, searchWord, searchOption } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = [
        {
          categoryId: Not(In([Category.typeTo("mbti")])),
          id: LessThan(startId),
        },
        {
          categoryId: Category.typeTo("mbti"),
          userMbti: mbti,
          id: LessThan(startId),
        },
      ];
    } else {
      whereCondition = [
        {
          categoryId: Not(In([Category.typeTo("mbti")])),
        },
        {
          categoryId: Category.typeTo("mbti"),
          userMbti: mbti,
        },
      ];
    }

    let where = [];
    for (let x of whereCondition) {
      where.push(this._searchOption(x, searchOption, searchWord));
    }
    const result = await repository.find({
      select: [
        "id",
        "categoryId",
        "type",
        "isActive",
        "userId",
        "userNickname",
        "userMbti",
        "isSecret",
        "isTrend",
        "title",
        "content",
        "viewCount",
        "commentCount",
        "likesCount",
        "reportCount",
        "createdAt",
        "updatedAt",
      ],
      where,
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }
}
