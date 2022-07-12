import { IAccountDto } from "../../api/interfaces/IAccount.dto";
import { Provider } from "../../type.shared";

export interface IOauthService {
  getUserInfoByProvider(
    accessToken: string,
    provider: Provider
  ): Promise<IAccountDto>;
}
