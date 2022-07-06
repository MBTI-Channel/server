export interface ICategoryService {
  findOneById(id: number): Promise<boolean>;
}
