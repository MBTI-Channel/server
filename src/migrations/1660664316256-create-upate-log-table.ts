import { MigrationInterface, QueryRunner } from "typeorm";

export class createUpateLogTable1660664316256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("update_log");

    if (!hasTable) {
      await queryRunner.query(
        "CREATE TABLE `update_log` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` varchar(20) NOT NULL COMMENT '업데이트 종류', `before` varchar(10) NOT NULL COMMENT '업데이트 전', `after` varchar(10) NOT NULL COMMENT '업데이트 후', `user_id` int UNSIGNED NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
      );
      await queryRunner.query(
        "ALTER TABLE `update_log` ADD CONSTRAINT `FK_efe915ac8b3f0f867627fc75429` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
