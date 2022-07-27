import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";
import { PostRepository } from "./post.repository";
import { PostService } from "./post.service";

export const postModule = new ContainerModule((bind) => {
  bind<IPostService>(TYPES.IPostService).to(PostService);
  bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);
});
