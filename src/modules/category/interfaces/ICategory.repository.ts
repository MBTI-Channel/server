import { Category } from "../entity/category.entity";

export interface ICategoryRepository {
  findOneById(id: number): Promise<Category | null>;
}
