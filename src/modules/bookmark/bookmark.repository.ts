import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Bookmark } from "./entity/bookmark.entity";
import { IBookmarkRepository } from "./interfaces/IBookmark.repository";

@injectable()
export class BookmarkRepository implements IBookmarkRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}

  async findOneByUserAndPost(
    postId: number,
    userId: number
  ): Promise<Bookmark> {
    const repository = await this._database.getRepository(Bookmark);
    return await repository.findOne({ where: { postId, userId } });
  }

  async createBookmark(bookmarkEntity: Bookmark): Promise<Bookmark> {
    const repository = await this._database.getRepository(Bookmark);
    const bookmark = await repository.save(bookmarkEntity);
    return bookmark;
  }
}
