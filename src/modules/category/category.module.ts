import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { CategoryRepository } from "./category.repository";
import { ICategoryRepository } from "./interfaces/ICategory.repository";

export const categoryModule = new ContainerModule((bind) => {
  bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
});
