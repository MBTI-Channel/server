import { User } from "../../user/entity/user.entity";

export interface IAuthService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(key: string): Promise<string>;
  validateUserWithToken(
    id: number,
    nickname: string,
    mbti: string
  ): Promise<void>;
  hasRefreshAuth(key: string, refreshToken: string): Promise<boolean>;
}
