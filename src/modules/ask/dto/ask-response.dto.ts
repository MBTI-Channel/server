import { User } from "../../user/entity/user.entity";
import { Ask } from "../entity/ask.entity";

export class AskResponseDto {
  userId: number;
  email: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date | null;
  constructor(ask: Ask, user: User) {
    this.userId = user.id;
    this.email = ask.email ?? "";
    this.title = ask.title;
    this.content = ask.content;
    this.imageUrl = ask.imageUrl ?? "";
    this.createdAt = ask.createdAt;
    this.updatedAt =
      ask.createdAt.getTime() === ask.updatedAt.getTime()
        ? null
        : ask.updatedAt;
  }
}
