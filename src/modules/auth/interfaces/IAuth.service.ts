import { User } from "../../user/entity/user.entity";

export interface IAuthService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(key: string): Promise<string>;
  validateUserWithToken( //TODO: 이름과 매개변수가 맞지않음.
    id: number,
    nickname: string,
    mbti: string
  ): Promise<void>;
  hasRefreshAuth(key: string, refreshToken: string): Promise<boolean>;
  getRefreshKey(userId: number, userAgent: string): string;
  removeRefreshKey(key: string): Promise<void>;
}
