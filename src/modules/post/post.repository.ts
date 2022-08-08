import { inject, injectable } from "inversify";
import { In, Like } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { Category } from "../category/entity/category.entity";
import { GetAllPostDto } from "./dto/get-all-post.dto";
import { SearchPostDto } from "./dto/search-post.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { GetMyPostsDto } from "./dto";

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
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    const [result, totalCount] = await repository.findAndCount({
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
      where: { categoryId },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
      order: { [pageOptionsDto.order]: "DESC" },
    });
    return [result, totalCount];
  }

  public async findAllPostsWithMbti(
    pageOptionsDto: GetAllPostDto,
    categoryId: number,
    mbti: string
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    const [result, totalCount] = await repository.findAndCount({
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
      where: { categoryId, userMbti: mbti },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
      order: { [pageOptionsDto.order]: "DESC" },
    });
    return [result, totalCount];
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
      .orderBy(`post.createdAt`, "DESC")
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
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    const [result, totalCount] = await repository.findAndCount({
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
      where: { categoryId, title: Like(`%${pageOptionsDto.searchWord}%`) },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
      order: { [pageOptionsDto.order]: "DESC" },
    });
    return [result, totalCount];
  }

  public async searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number,
    mbti: string
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    const [result, totalCount] = await repository.findAndCount({
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
        title: Like(`%${pageOptionsDto.searchWord}%`),
      },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
      order: { [pageOptionsDto.order]: "DESC" },
    });
    return [result, totalCount];
  }

  public async searchWithoutMbtiCategory(
    pageOptionsDto: SearchPostDto
  ): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    const [result, totalCount] = await repository.findAndCount({
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
          Category.typeTo("game"),
          Category.typeTo("trip"),
          Category.typeTo("love"),
        ]),
        title: Like(`%${pageOptionsDto.searchWord}%`),
      },
      take: pageOptionsDto.maxResults + 1,
      skip: pageOptionsDto.skip,
      order: { [pageOptionsDto.order]: "DESC" },
    });
    return [result, totalCount];
  }

  public async searchAll(): Promise<[Post[], number]> {
    const repository = await this._database.getRepository(Post);
    // 수정 필요
    return [[], 0];
  }
}
