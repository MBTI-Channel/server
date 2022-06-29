import { Provider } from "../../../modules/user/entity/user.entity";

export interface IProviderUserInfo {
  provider: Provider;
  providerId: string;
  providerData?: string;
}
