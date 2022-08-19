import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1660896788663 implements MigrationInterface {
    name = 'migrations1660896788663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`file_url\` varchar(255) NOT NULL COMMENT 's3에 담겨 있는 파일 url', \`is_active\` tinyint NOT NULL COMMENT '파일 활성 여부' DEFAULT 1, \`post_id\` int UNSIGNED NOT NULL COMMENT '게시글 id', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumbnail\` varchar(255) NULL COMMENT '썸네일 이미지 url'`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_6f5531bea310c8d5d58f2e7b2f0\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_6f5531bea310c8d5d58f2e7b2f0\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
        await queryRunner.query(`DROP TABLE \`file\``);
    }

}
