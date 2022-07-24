import { User } from "../../user/entity/user.entity";
import { BookmarkResponseDto } from "../dto/bookmark-response.dto";

export interface IBookmarkService {
  createBookmark(targetId: number, user: User): Promise<BookmarkResponseDto>;
  delete(user: User, id: number): Promise<void>;
}
