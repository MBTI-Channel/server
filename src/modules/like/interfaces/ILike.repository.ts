import { Like } from "../entity/like.entity";

export interface ILikeRepository {
  findOneById(id: number): Promise<Like | null>;
  findOneByTarget(targetId: number, targetType: number): Promise<Like | null>;
  createLike(likeEntity: Like): Promise<Like>;
}
