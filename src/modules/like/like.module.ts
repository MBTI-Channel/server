import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { ILikeRepository } from "./interfaces/ILike.repository";
import { ILikeService } from "./interfaces/ILike.service";
import { LikeRepository } from "./like.repository";
import { LikeService } from "./like.service";

export const likeModule = new ContainerModule((bind) => {
  bind<ILikeService>(TYPES.ILikeService).to(LikeService);
  bind<ILikeRepository>(TYPES.ILikeRepository).to(LikeRepository);
});
