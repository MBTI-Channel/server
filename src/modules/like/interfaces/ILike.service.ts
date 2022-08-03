import { User } from "../../user/entity/user.entity";
import { LikeResponseDto } from "../dto/like-response.dto";

export interface ILikeService {
  createLike(
    type: string,
    targetId: number,
    user: User
  ): Promise<LikeResponseDto>;
  //   getStatus(type: number, targetId: number, user: User): Promise<boolean>;
  deleteLike(type: string, targetId: number, user: User): Promise<void>;
}
