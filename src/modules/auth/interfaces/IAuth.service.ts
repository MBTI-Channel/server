import { User } from "../../user/entity/user.entity";

export interface IAuthService {
  /**
   * 새 access token을 발급합니다.
   */
  generateAccessToken(user: User): Promise<string>;
  /**
   * 새 refresh token을 발급합니다.
   */
  generateRefreshToken(refreshStatusKey: string): Promise<string>;
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
  hasRefreshAuth(
    refreshStatusKey: string,
    refreshToken: string
  ): Promise<boolean>;
  /**
   * userId와 userAgent로 refresh 상태 key를 받습니다.
   */
  getRefreshStatusKey(userId: number, userAgent: string): string;
  /**
   * refresh 상태를 제거합니다.
   */
  removeRefreshStatus(key: string): Promise<void>;
}
