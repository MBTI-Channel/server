import { PostType } from "../../../shared/enum.shared";
import { Post } from "../../post/entity/post.entity";
import { Bookmark } from "../entity/bookmark.entity";

export class BookmarkResponseDto {
  id: number;
  postId: number;
  userId: number;
  title: string;
  content: string;
  isSecret: boolean;
  type: PostType;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(entity: Bookmark, post: Post) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.title = post.title;
    this.content = post.content;
    this.isSecret = post.isSecret;
    this.type = post.type as PostType;
    this.createdAt = entity.createdAt;
    this.updatedAt =
      entity.createdAt.getTime() === entity.updatedAt.getTime()
        ? null
        : entity.updatedAt;
  }
}
