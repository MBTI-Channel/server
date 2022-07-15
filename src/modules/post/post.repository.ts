import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { PostOrder } from "../../shared/enum.shared";
import { GetAllPostDto } from "./dto/get-all-post.dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";

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
    return await repository
      .createQueryBuilder("post")
      .select([
        "post.id",
        "post.categoryId",
        "post.type",
        "post.isActive",
        "post.userId",
        "post.userNickname",
        "post.userMbti",
        "post.isSecret",
        "post.title",
        "post.content",
        "post.viewCount",
        "post.commentCount",
        "post.likesCount",
        "post.reportCount",
        "post.createdAt",
        "post.updatedAt",
      ])
      .where("post.categoryId = :categoryId", {
        categoryId,
      })
      .take(pageOptionsDto.maxResults)
      .skip(pageOptionsDto.skip)
      .orderBy(`post.${pageOptionsDto.order}`)
      .getManyAndCount();
  }
}
