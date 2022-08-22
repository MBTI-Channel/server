import { User } from "../../user/entity/user.entity";

export interface IAuthService {
  /**
   * 새 access token을 발급합니다.
   */
  generateAccessToken(user: User): Promise<string>;
  /**
   * 새 refresh token을 발급합니다.
   */
  generateRefreshToken(key: string): Promise<string>;
  /**
   * token 정보와 서버의 user 정보를 비교하여 검증합니다.
   */
  validateUserWithToken( //TODO: 이름과 매개변수가 맞지않음.
    id: number,
    nickname: string,
    mbti: string
  ): Promise<void>;
  /**
   * refresh 권한이 있는지 확인합니다.
   */
  hasRefreshAuth(key: string, refreshToken: string): Promise<boolean>;
  /**
   * userId와 userAgent로 refresh key를 생성합니다.
   */
  getRefreshKey(userId: number, userAgent: string): string;
  /**
   * refresh 상태를 제거합니다.
   */
  removeRefreshKey(key: string): Promise<void>;
}
