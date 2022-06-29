import { IProviderUserInfo } from "./IProviderUserInfo";

export interface IOauth {
  getProviderAccessToken(authCode: string): Promise<string | null>;
  getProviderUserInfo(accessToken: string): Promise<IProviderUserInfo | null>;
  expiresProviderToken(accessToken: string): Promise<void>;
}
