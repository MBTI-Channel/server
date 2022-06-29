import { IProviderUserInfo } from "./IProviderUserInfo";

export interface IOauthService {
  getProviderAccessToken(authCode: string): Promise<string | null>;
  getProviderUserInfo(accessToken: string): Promise<IProviderUserInfo | null>;
  expiresProviderToken(accessToken: string): Promise<void>;
}
