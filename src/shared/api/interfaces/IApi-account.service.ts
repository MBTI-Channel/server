import { IAccountDto } from "./IAccount.dto";

export interface IApiAccountService {
  /**
   * `authCode`로 api 인증 서비스에서 `accessToken`을 받아온다
   */
  getAccessToken(authCode: string): Promise<string | null>;
  /**
   * `accessToken`으로 api 서비스의 user 정보를 받아온다
   */
  getUserInfo(accessToken: string): Promise<IAccountDto | null>;
  /**
   * `accessToken`을 만료시켜 api 서비스 로그아웃
   */
  expiresToken?(accessToken: string): Promise<void>;
}
