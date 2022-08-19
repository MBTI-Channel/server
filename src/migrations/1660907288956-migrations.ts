import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1660907288956 implements MigrationInterface {
    name = 'migrations1660907288956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` text NOT NULL COMMENT 's3에 담겨 있는 파일 url', \`extension\` varchar(255) NOT NULL COMMENT '파일 확장자', \`is_active\` tinyint NOT NULL COMMENT '파일 활성 여부' DEFAULT 1, \`target_id\` int UNSIGNED NOT NULL COMMENT '파일이 업로드 된 타켓 id', \`target_type\` tinyint NOT NULL COMMENT '파일이 업로드 될 타겟 종류 [1: user, 2: post, 3: comment]', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumbnail\` text NULL COMMENT '썸네일 이미지 url'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
        await queryRunner.query(`DROP TABLE \`file\``);
    }

}
