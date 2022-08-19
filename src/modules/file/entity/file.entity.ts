import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { Post } from "../../post/entity/post.entity";

@Entity()
export class File extends BaseEntity {
  @Column({
    comment: "s3에 담겨 있는 파일 url",
  })
  fileUrl: string;

  @Column({
    default: true,
    comment: "파일 활성 여부",
  })
  isActive: boolean;

  @Column({
    comment: "게시글 id",
    unsigned: true,
  })
  postId: number;

  @ManyToOne(() => Post, (post) => post.id, {
    onDelete: "CASCADE",
  })
  post: Post;

  static of(post: Post, fileUrl: string) {
    const file = new File();
    file.post = post;
    file.fileUrl = fileUrl;

    return file;
  }
}
