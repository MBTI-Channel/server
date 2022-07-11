import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "../../user/entity/user.entity";

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ comment: "로그인한 시간" })
  datetime: Date;

  @Column({
    length: "50",
    comment: "로그인한 ip",
  })
  ip: string;

  @Column({
    length: "255",
    comment: "로그인한 유저 에이전트",
  })
  useragent: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;
}
