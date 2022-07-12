import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";

@Entity()
export class Ask extends BaseEntity {
  @Column({ comment: "문의자 이메일" })
  email: string;

  @Column({ length: 100, comment: "문의 제목" })
  title: string;

  @Column({ type: "text", comment: "문의 내용" })
  content: string;

  @Column({ type: "text", comment: "문의 사진" })
  image: string;

  @Column({ type: "text", comment: "답변 내용" })
  answer: string;
}
