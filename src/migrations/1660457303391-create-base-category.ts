import { MigrationInterface, QueryRunner } from "typeorm";
import { Category } from "../modules/category/entity/category.entity";

export class createBaseCategory1660457303391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const BASE_CATEGORIES = [
      "mbti",
      "love",
      "school",
      "workLife",
      "music",
      "movie",
      "trip",
      "hobby",
    ];

    const repository = await queryRunner.connection.getRepository(Category);

    // 1. 모든 카테고리 low 조회
    const categories = await repository.find({
      select: ["name"],
    });

    // 2. BASE_CATEGORIES 배열 돌면서 없는 low INSERT
    BASE_CATEGORIES.forEach(async (e) => {
      const foundCategory = categories.find((c) => c.name === e);
      if (!foundCategory) await repository.insert({ name: e });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
