import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

import { Post } from "../../post/entity/post.entity";

@Entity("Trend")
export class Trend {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Post, (post: any) => post.id, { cascade: true })
  @JoinColumn()
  post: Post;

  @CreateDateColumn({
    default: () => "(CURRENT_DATE)",
    comment: "인기글 등록 날짜시간",
  })
  datetime: Date;
}
