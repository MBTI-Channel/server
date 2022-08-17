import { PostResponseDto } from "../../post/dto";
import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";
import { Bookmark } from "../entity/bookmark.entity";

export class BookmarkPostResponseDto {
  id: number;
  createdAt: Date;
  post: PostResponseDto;
  constructor(bookmark: Bookmark, post: Post, user: User) {
    this.id = bookmark.id;
    this.createdAt = bookmark.createdAt;
    this.post = new PostResponseDto(post, user);
  }
}
