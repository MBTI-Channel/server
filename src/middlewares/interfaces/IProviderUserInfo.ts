import { Provider } from "../../entities/user.entity";

export interface IProviderUserInfo {
  provider: Provider;
  providerId: string;
  providerData?: string;
}
