import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Ask extends BaseEntity {
  // Ask (*) <-> User (1)
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ unsigned: true })
  userId: number;

  @Column({ nullable: true, comment: "문의 알림 받을 메일" })
  email: string;

  @Column({ length: 100, comment: "문의 제목" })
  title: string;

  @Column({ type: "text", comment: "문의 내용" })
  content: string;

  @Column({ type: "text", nullable: true, comment: "문의 사진" })
  imageUrl: string;

  @Column({ type: "text", nullable: true, comment: "답변 내용" })
  answer: string;

  static of(
    user: User,
    title: string,
    content: string,
    email: string,
    imageUrl: string
  ) {
    const ask = new Ask();
    ask.user = user;
    ask.userId = user.id;
    ask.title = title;
    ask.content = content;
    ask.email = email ?? undefined;
    ask.imageUrl = imageUrl ?? undefined;

    return ask;
  }
}
