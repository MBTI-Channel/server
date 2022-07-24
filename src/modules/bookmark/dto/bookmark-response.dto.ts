import { Bookmark } from "../entity/bookmark.entity";

export class BookmarkResponseDto {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(entity: Bookmark) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
    this.updatedAt =
      entity.createdAt.getTime() === entity.updatedAt.getTime()
        ? null
        : entity.updatedAt;
  }
}
