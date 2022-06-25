import { CreatePostDto } from "../dto";
import { Post } from "../entity/post.entity";

export interface IPostService {
  create(dto: CreatePostDto): Promise<Post>;
}
