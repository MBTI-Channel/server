import { inject, injectable } from "inversify";
import { In, LessThan, LessThanOrEqual, Like, MoreThan } from "typeorm";
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

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

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

  public async searchInCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord } = pageOptionsDto;
    let whereCondition;
    if (startId > 1) {
      whereCondition = {
        categoryId,
        title: Like(`%${searchWord}%`),
        id: LessThan(startId),
      };
    } else {
      whereCondition = { categoryId, title: Like(`%${searchWord}%`) };
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

  public async searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number,
    mbti: string
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord } = pageOptionsDto;
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
      where: {
        categoryId,
        userMbti: mbti,
        title: Like(`%${searchWord}%`),
        id: LessThan(startId),
      },
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  public async searchWithoutMbtiCategory(
    pageOptionsDto: SearchPostDto
  ): Promise<Post[]> {
    const { startId, maxResults, searchWord } = pageOptionsDto;
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
      where: {
        categoryId: In([
          Category.typeTo("game"), // TODO: transform 으로 수정
          Category.typeTo("trip"),
          Category.typeTo("love"),
        ]),
        title: Like(`%${searchWord}%`),
        id: LessThan(startId),
      },
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  // 인기글 조회
  public async findAllTrends(pageOptionsDto: GetTrendDto): Promise<Post[]> {
    const { startId, maxResults } = pageOptionsDto;
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
      where: { isTrend: true, id: LessThan(startId) },
      take: maxResults,
      order: { id: "DESC" },
    });
    return result;
  }

  public async searchAll(): Promise<Post[]> {
    const repository = await this._database.getRepository(Post);
    // 수정 필요
    return [];
  }
}
