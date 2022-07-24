import { Bookmark } from "../entity/bookmark.entity";

export interface IBookmarkRepository {
  findOneByUserAndPost(postId: number, userId: number): Promise<Bookmark>;
  findOneById(id: number): Promise<Bookmark | null>;
  createBookmark(bookmarkEntity: Bookmark): Promise<Bookmark>;
  remove(id: number): Promise<void>;
}
