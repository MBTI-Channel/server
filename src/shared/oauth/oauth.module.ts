import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { IOauthService } from "./interfaces/IOauth.service";
import { OauthService } from "./oauth.service";

export const oauthModule = new ContainerModule((bind) => {
  bind<IOauthService>(TYPES.IOauthService).to(OauthService);
});
