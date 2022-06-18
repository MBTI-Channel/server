import { Provider } from "../../user/entity/user.entity";

export interface IProviderUserInfo {
  provider: Provider;
  providerId: string;
  providerData?: string;
}
