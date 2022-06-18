import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "../../post/entity/post..entity";
import { User } from "../../user/entity/user.entity";

@Entity("Survey")
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  // Survey (*) <-> Post(1)
  @ManyToOne((type) => Post, (post) => post.id)
  post!: Post;

  // Survey (*) <-> User(1)
  @ManyToOne((type) => User, (user) => user.id)
  user!: User;

  @Column({ length: 4, comment: "참여한 유저 MBTI" })
  userMbti: string;

  @Column({ type: "tinyint", comment: "1:찬성 2:반대" })
  type: number;

  @CreateDateColumn({ comment: "찬성,반대한 날짜시간" })
  datetime: Date;
}
