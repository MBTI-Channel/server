import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { FileTargetType } from "../../../shared/enum.shared";
import { FileTargetTypeTransformer } from "../helper/file-target-type-transormer";

@Entity()
export class File extends BaseEntity {
  @Column({
    type: "text",
    comment: "s3에 담겨 있는 파일 url",
  })
  url: string;

  @Column({
    comment: "파일 확장자",
  })
  extension: string;

  @Column({
    default: true,
    comment: "파일 활성 여부",
  })
  isActive: boolean;

  @Column({
    comment: "파일이 업로드 된 타켓 id",
    unsigned: true,
  })
  targetId: number;

  @Column({
    type: "tinyint",
    transformer: new FileTargetTypeTransformer(),
    comment: "파일이 업로드 될 타겟 종류 [1: user, 2: post, 3: comment]",
  })
  targetType: number | FileTargetType;

  static of(
    targetType: FileTargetType,
    targetId: number,
    extension: string,
    url: string
  ) {
    const file = new File();
    file.targetType = targetType;
    file.targetId = targetId;
    file.extension = extension;
    file.url = url;
    return file;
  }
}
