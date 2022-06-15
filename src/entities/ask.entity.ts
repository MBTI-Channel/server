import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("Ask")
export class Ask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "문의자 이메일" })
  email: string;

  @Column({ type: "tinyint", comment: "문의 유형. 설정필요" }) //TODO: 논의 필요
  type: number;

  @Column({ length: 100, comment: "문의 제목" })
  title: string;

  @Column({ type: "text", comment: "문의 내용" })
  content: string;

  @CreateDateColumn({ comment: "문의 날짜시간" })
  datetime: Date;

  @Column({ type: "text", comment: "문의 사진" })
  image: string;

  @Column({ type: "tinyint", default: 0, comment: "답변 유무" })
  response: number;
}
