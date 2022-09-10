import { User } from "../../../user/entity/user.entity";
import { Post } from "../../entity/post.entity";
import { PostResponseDto } from "./post-response.dto";

export class PostDetailResponseDto extends PostResponseDto {
  isUserLike: boolean;
  isUserBookmark: boolean;
  constructor(
    post: Post,
    user: User,
    isUserLike: boolean,
    isUserBookmark: boolean
  ) {
    super(post, user);
    this.isUserLike = isUserLike;
    this.isUserBookmark = isUserBookmark;
  }
}
