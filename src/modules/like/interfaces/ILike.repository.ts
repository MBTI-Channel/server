import { Like } from "../entity/like.entity";

export interface ILikeRepository {
  findOneById(id: number): Promise<Like | null>;
  findOneByTarget(
    userId: number,
    targetId: number,
    targetType: number
  ): Promise<Like | null>;
  createLike(likeEntity: Like): Promise<Like>;
  remove(id: number): Promise<void>;
  active(id: number): Promise<Like>;
}
