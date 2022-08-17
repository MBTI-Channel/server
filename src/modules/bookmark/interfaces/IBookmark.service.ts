import { PageInfoDto, PageResponseDto } from "../../../shared/page";
import { PageOptionsDto } from "../../../shared/page/dto/page-options.dto";
import { User } from "../../user/entity/user.entity";
import { BookmarkPostResponseDto } from "../dto/bookmark-post-response.dto";
import { BookmarkResponseDto } from "../dto/bookmark-response.dto";

export interface IBookmarkService {
  createBookmark(targetId: number, user: User): Promise<BookmarkResponseDto>;
  getAllByUser(
    user: User,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageResponseDto<PageInfoDto, BookmarkPostResponseDto>>;
  delete(user: User, id: number): Promise<void>;
}
