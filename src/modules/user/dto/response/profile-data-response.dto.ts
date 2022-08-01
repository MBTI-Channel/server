import { User } from "../../entity/user.entity";

export class ProfileDataResponseDto {
  nickname: string;
  mbti: string;
  createdAt: Date;
  isMe: boolean;
  constructor(userId: number, profileUser: User) {
    this.nickname = profileUser.nickname;
    this.mbti = profileUser.mbti;
    this.createdAt = profileUser.createdAt;
    this.isMe = userId === profileUser.id;
  }
}
