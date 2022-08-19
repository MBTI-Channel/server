import { Post } from "../../post/entity/post.entity";

export interface IFileService {
  create(post: Post, files_url: string[]): Promise<void>;
  // delete(post: Post, files_url: string[]): Promise<void>;
}
