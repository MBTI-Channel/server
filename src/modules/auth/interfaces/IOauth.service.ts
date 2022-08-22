import { IAccountDto } from "../../../shared/api/interfaces/IAccount.dto";
import { Provider } from "../../../shared/type.shared";

export interface IOauthService {
  /**
   * API 서비스로부터 사용자 정보를 받아옵니다.
   * @param accessToken OAuth 서비스로 부터 받은 access token
   * @param provider    OAuth 제공 서비스 종류
   */
  getUserInfoByProvider(
    accessToken: string,
    provider: Provider
  ): Promise<IAccountDto>;
}
