import { PageOptionsDto } from "../../../shared/page/dto/page-options.dto";
import { Bookmark } from "../entity/bookmark.entity";

export interface IBookmarkRepository {
  findOneByUserAndPost(postId: number, userId: number): Promise<Bookmark>;
  findOneById(id: number): Promise<Bookmark | null>;
  findAllByUserId(
    userId: number,
    pageOptionsDto: PageOptionsDto
  ): Promise<[Bookmark[], number]>;
  createBookmark(bookmarkEntity: Bookmark): Promise<Bookmark>;
  remove(id: number): Promise<void>;
}
