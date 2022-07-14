import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Category } from "./entity/category.entity";
import { ICategoryRepository } from "./interfaces/ICategory.repository";

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  async findOneById(id: number): Promise<Category | null> {
    const repository = await this._database.getRepository(Category);
    return await repository.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Category | null> {
    const repository = await this._database.getRepository(Category);
    return await repository.findOne({ where: { name } });
  }
}
