import { IAccountDto } from "../../../shared/api/interfaces/IAccount.dto";
import { Provider } from "../../../shared/type.shared";

export interface IOauthService {
  getUserInfoByProvider(
    accessToken: string,
    provider: Provider
  ): Promise<IAccountDto>;
}
