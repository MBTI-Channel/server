import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { Bookmark } from "./entity/bookmark.entity";
import { IBookmarkRepository } from "./interfaces/IBookmark.repository";
import { PageOptionsDto } from "../../shared/page/dto/page-options.dto";

@injectable()
export class BookmarkRepository implements IBookmarkRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}

  public async findOneByUserAndPost(
    postId: number,
    userId: number
  ): Promise<Bookmark> {
    const repository = await this._database.getRepository(Bookmark);
    return await repository.findOne({ where: { postId, userId } });
  }

  public async findOneById(id: number): Promise<Bookmark | null> {
    const repository = await this._database.getRepository(Bookmark);
    return await repository.findOne({ where: { id } });
  }

  public async findAllByUserId(
    userId: number,
    pageOptionsDto: PageOptionsDto
  ): Promise<[Bookmark[], number]> {
    const repository = await this._database.getRepository(Bookmark);
    return await repository
      .createQueryBuilder("bookmark")
      .select([
        "bookmark.id",
        "bookmark.postId",
        "bookmark.createdAt",
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
        "post.createdAt",
        "post.updatedAt",
      ])
      .where("bookmark.user_id = :userId", { userId })
      .innerJoin("bookmark.post", "post", "post.id = bookmark.postId")
      .take(pageOptionsDto.maxResults)
      .skip(pageOptionsDto.skip)
      .orderBy(`bookmark.id`, "DESC")
      .getManyAndCount();
  }

  public async createBookmark(bookmarkEntity: Bookmark): Promise<Bookmark> {
    const repository = await this._database.getRepository(Bookmark);
    const bookmark = await repository.save(bookmarkEntity);
    return bookmark;
  }

  public async remove(id: number): Promise<void> {
    const repository = await this._database.getRepository(Bookmark);
    await repository.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<Bookmark>);
  }
}
