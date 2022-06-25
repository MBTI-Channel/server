import { CreatePostDto } from "../dto";
import { Post } from "../entity/post.entity";

export interface IPostRepository {
  create(dto: CreatePostDto): Promise<Post>;
}
