import { User } from "../../user/entity/user.entity";
import { LikeResponseDto } from "../dto/like-response.dto";

export interface ILikeService {
  create(type: string, targetId: number, user: User): Promise<LikeResponseDto>;
  //   getStatus(type: number, targetId: number, user: User): Promise<boolean>;
  remove(type: string, targetId: number, user: User): Promise<void>;
}
