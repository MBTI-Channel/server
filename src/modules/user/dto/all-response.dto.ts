import { User } from "../entity/user.entity";

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

export class UserTokenResponseDto extends UserResponseDto {
  constructor(
    user: User,
    public accessToken: string,
    public refreshToken: string
  ) {
    super(user);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class NeedSignUpResponseDto {
  id: number;
  uuid: string;
  constructor(user: User) {
    this.id = user.id;
    this.uuid = user.uuid;
  }
}
