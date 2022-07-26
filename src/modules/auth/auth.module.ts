import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { AuthService } from "./auth.service";
import { IAuthService } from "./interfaces/IAuth.service";
import { IOauthService } from "./interfaces/IOauth.service";
import { OauthService } from "./oauth.service";

export const authModule = new ContainerModule((bind) => {
  bind<IAuthService>(TYPES.IAuthService).to(AuthService);
  bind<IOauthService>(TYPES.IOauthService).to(OauthService);
});
