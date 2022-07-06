import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../shared/utils/logger.util";
import { ICategoryRepository } from "./interfaces/ICategory.repository";
import { ICategoryService } from "./interfaces/ICategory.service";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepository: ICategoryRepository
  ) {}

  async findOneById(id: number): Promise<boolean> {
    this._logger.trace(`[CategoryService] findOneById start`);
    const category = await this._categoryRepository.findOneById(id);
    if (category) return true;
    return false;
  }
}
