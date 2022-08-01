import { User } from "../../entity/user.entity";

export class UserResponseDto {
  id: number;
  nickname: string;
  mbti: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.mbti = user.mbti;
    this.isAdmin = user.isAdmin;
    this.isActive = user.isActive();
    this.createdAt = user.createdAt;
  }
}
